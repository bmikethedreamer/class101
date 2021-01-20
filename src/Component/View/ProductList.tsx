import React, { Component } from 'react';
import { Grid, Card, CardMedia } from '@material-ui/core';
import { productItems } from '../../data/productItems';
import { withStyles } from '@material-ui/styles';

class ProductList extends Component {
  render() {
    console.log(productItems, typeof productItems);
    return (
      <Grid container spacing={3}>
        {
          productItems.map((item: Product) => {
            return (
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardMedia
                    style={{height: 0, paddingTop: '56.25%'}}
                    image={item.coverImage}
                    title={item.title}
                  />
                </Card>
              </Grid>
            )
          })
        }
      </Grid>
    );
  }
}

export default ProductList;