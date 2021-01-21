import React, { Component } from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Typography, IconButton } from '@material-ui/core';
import { productItems } from '../../data/productItems';
import { numberWithCommas } from '../../Common/common';
import { withStyles } from '@material-ui/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Header from '../Header/Header'

type ProductListProps = {
  classes: any
}

const styles = {
  root: {
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
    }
  }
}

class ProductList extends Component<ProductListProps, {}> {
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Header />
        <Grid className={classes.root} container spacing={0} direction="column" justify="center" alignItems="center">
          {
            productItems.map((item: Product, index: number) => {
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
                      <IconButton aria-label="장바구니에 넣기">
                        <AddShoppingCartIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              )
            })
          }
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProductList);