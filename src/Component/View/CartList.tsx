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
  TextField,
  Hidden,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { numberWithCommas } from '../../Common/common';
import Header from '../Header/Header';

import { getCartList, getCartProductList, deleteCartList } from '../../VServer/VServer';

type CartListProps = {
  classes: any
}

type CartListState = {
  cartList: string[],
  productItems: Product[],
  couponList: Coupon[],
  allSelected: boolean,
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
      allSelected: true,
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

  selecedDeleteShoppingCart = () => {
    const copiedProductItems: Product[] = [...this.state.productItems];
    const copiedCardList = [...this.state.cartList];
    const productItems: Product[] = [];
    for (let idx = 0; idx < copiedProductItems.length; idx++) {
      if (copiedProductItems[idx].isSelected === true) {
        copiedCardList.splice(copiedCardList.indexOf(copiedProductItems[idx].id), 1);
        deleteCartList(copiedProductItems[idx].id);
      } else {
        productItems.push(copiedProductItems[idx]);
      }
    }
    this.setState({ productItems, cartList: copiedCardList });
  }

  clickCheckBox = (index: number) => {
    // 선택한 값 체크 박스
    const copiedProductItems: Product[] = [...this.state.productItems];
    if (copiedProductItems[index].isSelected) copiedProductItems[index].isSelected = false;
    else copiedProductItems[index].isSelected = true;
    // 전체 체크 박스 선택 확인
    const productLength: number = copiedProductItems.length;
    let sumSelectedCheckboxNumber: number = 0;
    for (let idx = 0; idx < copiedProductItems.length; idx++) {
      if (copiedProductItems[idx].isSelected === true) sumSelectedCheckboxNumber += 1;
    }
    let allSelected: boolean = true;
    if (sumSelectedCheckboxNumber !== productLength) {
      allSelected = false;
    }
    this.setState({ allSelected, productItems: copiedProductItems });
  }

  clickAllCheckbox = () => {
    const allSelected = !this.state.allSelected;
    const copiedProductItems: Product[] = [...this.state.productItems];
    // 전체 선택
    if (allSelected) {
      for (let idx = 0; idx < copiedProductItems.length; idx++) {
        copiedProductItems[idx].isSelected = true;
      }
    } else {
      for (let idx = 0; idx < copiedProductItems.length; idx++) {
        copiedProductItems[idx].isSelected = false;
      }
    }
    this.setState({ allSelected, productItems: copiedProductItems });
  }

  getAllPrice = () => {
    const copiedProductItems: Product[] = [...this.state.productItems];
    let allPrice: number = 0;
    if (copiedProductItems && copiedProductItems.length > 0) {
      for (let idx = 0; idx < copiedProductItems.length; idx++) {
        if (copiedProductItems[idx].isSelected) {
          const item = copiedProductItems[idx];
          const amount = item?.amount ? item.amount : 0;
          const price = item.price * amount;
          allPrice = allPrice + price;
        }
      }
    }
    return allPrice;
  }

  componentDidMount = () => {
    const cartList: string[] = getCartList();
    const productItems: Product[] = getCartProductList(cartList);
    for (let idx = 0; idx < productItems.length; idx++) {
      productItems[idx].isSelected = true;
      productItems[idx].amount = 1;
    }
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
                  <Hidden smDown>
                    <TableCell align="center">삭제</TableCell>
                  </Hidden>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.productItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      <Checkbox checked={item.isSelected} onClick={() => this.clickCheckBox(index)}></Checkbox>
                    </TableCell>
                    <TableCell align="center">
                      <Hidden smDown>
                        <img src={item.coverImage} alt='' width='160'></img>
                      </Hidden>
                      <div>{item.title}</div>
                    </TableCell>
                    <TableCell align="center">{item?.availableCoupon !== false && <div className={classes.saleCoupon}>쿠폰 적용 가능</div>}</TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        variant="outlined"
                        value={item.amount}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => {
                          const amount: number = Number(e.target.value)
                          if (amount < 1) {
                            alert('최소 1개의 수량은 포함되어야 합니다.');
                            return;
                          }
                          const copiedProductItems: Product[] = [...this.state.productItems];
                          copiedProductItems[index].amount = Number(e.target.value);
                          this.setState({ productItems: copiedProductItems });
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">{numberWithCommas(item.price.toString())}</TableCell>
                    <Hidden smDown>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => this.deleteShoppingCart(item.id)}>
                          삭제
                      </Button>
                      </TableCell>
                    </Hidden>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container direction="row" justify="flex-start" alignItems="center">
            <Grid item xs={3}>
              <Checkbox checked={this.state.allSelected} onClick={() => this.clickAllCheckbox()}></Checkbox>전체 선택
            </Grid>
            <Grid item xs={9}>
              <Button variant="contained" color="secondary" onClick={() => this.selecedDeleteShoppingCart()}>선택 삭제</Button>
            </Grid>
          </Grid>
          <Typography className={classes.title} variant="body2" color="textSecondary">
            결제 금액
          </Typography>
          <Grid container direction="row" justify="flex-start" alignItems="center">
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">제품금액</TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">할인금액</TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">주문합계</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">{`${numberWithCommas(String(this.getAllPrice()))} 원`}</TableCell>
                    <TableCell>
                      {`-`}
                    </TableCell>
                    <TableCell>
                    </TableCell>
                    <TableCell>
                      {`=`}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CartList);