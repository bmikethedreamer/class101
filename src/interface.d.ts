interface Product {
  id: string
  title: string,
  coverImage: string,
  price: number,
  score: number,
  availableCoupon?: boolean 
}

interface Coupon {
  type: string,
  title: string,
  discountRate: number,
}