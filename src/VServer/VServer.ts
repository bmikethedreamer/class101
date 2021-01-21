import { productItems } from '../data/productItems';

const cartList: string[] = [];

const getProductItems = (start: number, page: number) => {
  const copiedItems: Product[] = [...productItems];
  // 정렬
  const sortedItems: Product[] = copiedItems.sort((a, b) => {
    return a.score > b.score ? -1 : a.score < b.score ? 1 : 0;
  });

  const _productItems: Product[] = sortedItems.slice((start - 1), (start + page) - 1);
  const next: any = (start + page) < copiedItems.length ? start + page : null;

  return {
    _productItems,
    next,
  };
}

const addCartList = (id: string) => {
  cartList.push(id);
}

const deleteCartList = (id: string) => {
  cartList.splice(cartList.indexOf(id), 1);
}

const getCartList = () => {
  return cartList;
}

const getCartProductList = (cartList: string[]) => {
  const _productItems: Product[] = [];
  console.log("#getCartProductList : ", cartList);
  for (let i = 0; i < cartList.length; i++) {
    for (let j = 0; j < productItems.length; j++) {
      if (cartList[i] === productItems[j].id) _productItems.push(productItems[j]);
    }
  }
  return _productItems;
}

export {
  getProductItems,
  addCartList,
  deleteCartList,
  getCartList,
  getCartProductList,
}