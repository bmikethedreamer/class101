interface Product {
  id: string;
  title: string;
  coverImage: string;
  price: number;
  score: number;
  availableCoupon?: boolean;
  isAddCart?: boolean;
  isSelected?: boolean;
  amount?: number;
}

interface Coupon {
  type: string;
  title: string;
  discountRate: number;
}

interface resultData {
  _productItems: Product[];
  next: any;
}