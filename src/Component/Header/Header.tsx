import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Typography, IconButton, Badge } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

type HeaderProps = {
  classes: any,
  cartList?: string[],
}

const styles = {
  grow: {
    flexGrow: 1,
    '&& a': {
      textDecoration: 'none',
      color: '#ffffff',
    }
  },
  toolbar: {
    backgroundColor: '#000000',
  },
  title: {
    display: 'block',
    fontWeight: 600,
    color: '#ffffff',
    flexGrow: 1,
  },
}

class Header extends Component<HeaderProps, {}> {
  render() {
    const { classes, cartList } = this.props;
    return (
      <div className={classes.grow}>
        <AppBar position="fixed">
          <Toolbar className={classes.toolbar} variant="dense">
            <Typography className={classes.title} variant="h6" noWrap>
              <Link to='/products'>CLASS 101</Link>
            </Typography>
            <Link to='/cart'>
              <IconButton color="inherit">
                <Badge badgeContent={cartList ? cartList?.length : 0} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Link>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(styles)(Header)