export type order = {
  id: number;
  userId: number;
  totalPrice: number;
  createdAt: string;
};

export type orderItem = {
  id: number;
  order: order;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
};

export type createOrderDTO = {
  userId: number;
};

export type getOrderDTO = {
  id: number;
  userId: number;
  totalPrice: number;
  items: orderItem[];
  createdAt: string;
};
