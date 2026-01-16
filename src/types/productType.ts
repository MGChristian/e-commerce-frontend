export type product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageBase64: string;
  createdAt: string;
};

export type createProductDTO = {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageBase64: string;
};

export type updateProductDTO = Partial<createProductDTO>;

export type getProductDTO = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageBase64: string;
  createdAt: string;
};
