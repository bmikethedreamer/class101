import { productItems } from '../data/productItems';

const getProductItems = (start: number, page: number) => {
  const copiedItems: Product[] = [...productItems];
  // 소팅
  const sortedItems: Product[] = copiedItems.sort((a, b) => {
    return a.score > b.score ? -1 : a.score < b.score ? 1 : 0;
  });

  const _productItems: Product[] = sortedItems.slice((start - 1), (start + page) - 1);
  const next:any = (start + page) < copiedItems.length ? start + page : null;

  return {
    _productItems,
    next,
  };
}

export {
  getProductItems
}