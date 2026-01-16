import type { Axios, AxiosResponse } from "axios";
import type { createProductDTO, getProductDTO } from "../types/productType";

class ProductService {
  private axios: Axios;
  constructor(axios: Axios) {
    this.axios = axios;
  }

  async createProduct(productData: createProductDTO): Promise<getProductDTO> {
    const payload = {
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
    };
    const response = await this.axios.post("/products", payload);
    return response.data;
  }

  async getAllProducts(): Promise<getProductDTO[]> {
    const response = await this.axios.get("/products");
    return response.data;
  }

  async getProductById(productId: number): Promise<getProductDTO> {
    const response = await this.axios.get(`/products/${productId}`);
    return response.data;
  }

  async updateProduct(
    productId: number,
    productData: Partial<createProductDTO>,
  ): Promise<getProductDTO> {
    const payload = {
      ...productData,
      ...(productData.price !== undefined && { price: Number(productData.price) }),
      ...(productData.stock !== undefined && { stock: Number(productData.stock) }),
    };
    const response = await this.axios.patch(
      `/products/${productId}`,
      payload,
    );
    return response.data;
  }

  async deleteProduct(productId: number): Promise<AxiosResponse> {
    return await this.axios.delete(`/products/${productId}`);
  }
}

export default ProductService;
