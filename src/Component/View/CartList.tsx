import React, { Component } from 'react';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Checkbox,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { numberWithCommas } from '../../Common/common';
import Header from '../Header/Header';

import { getCartList, getCartProductList, addCartList, deleteCartList } from '../../VServer/VServer';

type CartListProps = {
  classes: any
}

type CartListState = {
  cartList: string[],
  productItems: Product[],
  couponList: Coupon[],
}

const styles = {
  root: {
    maxWidth: 1920,
    marginTop: 60,
  },
  title: {
    fontSize: 30,
  },
  tableTitle: {
    fontSize: 15,
    marginBottom: -30,
  },
  saleCoupon: {
    padding: 10,
    background: 'red',
    color: 'white',
  },
}

class CartList extends Component<CartListProps, CartListState> {
  constructor(props: any) {
    super(props);
    this.state = {
      cartList: [],
      productItems: [],
      couponList: [],
    }
  }

  deleteShoppingCart = (id: string) => {
    let copiedProductItems: Product[] = [...this.state.productItems];
    copiedProductItems = copiedProductItems.filter(ProductItem => id !== ProductItem.id);
    const copiedCardList = [...this.state.cartList];
    copiedCardList.splice(copiedCardList.indexOf(id), 1);
    deleteCartList(id);
    this.setState({ productItems: copiedProductItems, cartList: copiedCardList });
  }

  componentDidMount = () => {
    const cartList: string[] = getCartList();
    const productItems: Product[] = getCartProductList(cartList);
    this.setState({ cartList, productItems });
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Header cartList={this.state.cartList} />
        <Grid className={classes.root} container spacing={0} direction="column" justify="center" alignItems="center">
          <Typography className={classes.title} variant="body2" color="textSecondary">
            장바구니
          </Typography>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="center">클래스</TableCell>
                  <TableCell align="center">할인쿠폰</TableCell>
                  <TableCell align="center">수량</TableCell>
                  <TableCell align="center">판매금액</TableCell>
                  <TableCell align="center">삭제</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.productItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      <Checkbox></Checkbox>
                    </TableCell>
                    <TableCell align="center">
                      <img src={item.coverImage} alt='' width='160'></img>
                      <div>{item.title}</div>
                    </TableCell>
                    <TableCell align="center">{item?.availableCoupon !== false && <div className={classes.saleCoupon}>쿠폰 적용 가능</div>}</TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">{numberWithCommas(item.price.toString())}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          this.deleteShoppingCart(item.id);
                        }}>
                        삭제
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CartList);