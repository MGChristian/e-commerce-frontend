import type { product } from "./productType";

export type cart = {
  id: number;
  userId: number;
  createdAt: string;
};

export type cartItem = {
  id: number;
  cart: cart;
  product: product;
  quantity: number;
};

export type addToCartDTO = {
  userId: number;
  productId: number;
  quantity: number;
};

export type updateCartItemDTO = Partial<addToCartDTO>;

export type cartItemDto = {
  id: number;
  product: product;
  quantity: number;
  subtotal: number;
};

export type getCartDTO = {
  id: number;
  userId: number;
  items: cartItemDto[];
  total: number;
};
