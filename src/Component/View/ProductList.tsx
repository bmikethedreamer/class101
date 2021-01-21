import React, { Component } from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Typography, Button } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import { numberWithCommas } from '../../Common/common';
import { withStyles } from '@material-ui/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Header from '../Header/Header';

import { getProductItems, addCartList, deleteCartList, getCartList } from '../../VServer/VServer';

type ProductListProps = {
  classes: any
}

type ProductListState = {
  cartList: string[],
  productItems: Product[],
  start: number,
  page: number,
  next: any,
}

const styles = {
  root: {
    width: '100%',
    maxWidth: 1920,
    marginTop: 60,
  },
  cardRoot: {
    minWidth: 450,
    margin: 10,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  score: {
    marginLeft: 10,
    paddingBottom: -10,
  },
  title: {
    marginBottom: -30,
  },
  saleCoupon: {
    width: 140,
    background: 'red',
    '&& div': {
      marginLeft: 10,
      color: 'white',
    },
  },
}

class ProductList extends Component<ProductListProps, ProductListState> {
  constructor(props: any) {
    super(props);
    this.state = {
      cartList: [],
      productItems: [],
      start: 1,
      page: 5,
      next: null,
    }
  }

  moreGetData = (start: any) => {
    const resultData: resultData = getProductItems(start, this.state.page);
    const { _productItems, next } = resultData;
    // 새로 들어온 값 장바구니값 초기화
    _productItems.map(item => item.isAddCart = false);
    const productItems: Product[] = [...this.state.productItems, ..._productItems];
    // 만약 이전에 선택 했을 경우
    const cartList: string[] = getCartList();
    console.log("#cartList : ", cartList);
    for (let i = 0; i < cartList.length; i++) {
      for (let j = 0; j < productItems.length; j++) {
        if (cartList[i] === productItems[j].id) productItems[j].isAddCart = true;
      }
    }
    console.log("#productItems : ", productItems);
    this.setState({ next, productItems, cartList });
  }

  addShoppingCart = (index: number) => {
    const copiedProductItems = [...this.state.productItems];
    copiedProductItems[index].isAddCart = true;
    const copiedCardList = [...this.state.cartList];
    // 장바구니에 최대 3개만 담을 수 있다.
    if (copiedCardList && copiedCardList.length > 2) {
      alert('장바구니에 더 이상 상품을 담을 수 없습니다.');
      return;
    }
    copiedCardList.push(copiedProductItems[index].id);
    addCartList(copiedProductItems[index].id);
    this.setState({ productItems: copiedProductItems, cartList: copiedCardList });
  }

  deleteShoppingCart = (index: number) => {
    const copiedProductItems = [...this.state.productItems];
    copiedProductItems[index].isAddCart = false;
    const copiedCardList = [...this.state.cartList];
    copiedCardList.splice(copiedCardList.indexOf(copiedProductItems[index].id), 1);
    deleteCartList(copiedProductItems[index].id);
    this.setState({ productItems: copiedProductItems, cartList: copiedCardList });
  }

  componentDidMount = () => {
    this.moreGetData(this.state.start);
  }

  render() {
    const { classes } = this.props;
    // 더 보기 
    let moreButton = null;
    const next = (this.state.next !== null) && this.state.next;
    if (next) {
      moreButton = (
        <Button variant="contained" color="primary" onClick={() => this.moreGetData(this.state.next)}>+ 결과 더보기</Button>
      )
    }
    return (
      <React.Fragment>
        <Header cartList={this.state.cartList} />
        <Grid className={classes.root} container spacing={0} direction="column" justify="center" alignItems="center">
          {
            this.state.productItems.map((item: Product, index: number) => {
              return (
                <Grid item xs={12} sm={4} key={index}>
                  <Card className={classes.cardRoot}>
                    <CardMedia
                      className={classes.media}
                      image={item.coverImage}
                      title={item.title}
                    />
                    <CardContent>
                      <Typography className={classes.title} variant="body2" color="textSecondary" component="p">
                        {item.title}
                      </Typography>
                    </CardContent>
                    <CardContent>
                      <FavoriteIcon color="error" style={{ fontSize: 15 }} /><span className={classes.score}>{item.score}</span>
                    </CardContent>
                    <CardContent>
                      <Grid component="div">
                        {item?.availableCoupon !== false && <div className={classes.saleCoupon}><div>할인 쿠폰 적용 가능</div></div>}
                        {`가격: ${numberWithCommas(item.price.toString())} 원`}
                      </Grid>
                    </CardContent>
                    <CardActions disableSpacing>
                      <ToggleButton
                        value="check"
                        selected={item.isAddCart}
                        onChange={() => {
                          if (!item.isAddCart) /*카트에서 뺴기*/ this.addShoppingCart(index);
                          else /*카트에 넣기*/ this.deleteShoppingCart(index);
                        }}
                      >
                        <AddShoppingCartIcon />
                      </ToggleButton>
                    </CardActions>
                  </Card>
                </Grid>
              )
            })
          }
          {moreButton}
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProductList);