import type { Axios } from "axios";
import type { getCartDTO } from "../types/cartType";

class CartService {
  private axios: Axios;
  constructor(axios: Axios) {
    this.axios = axios;
  }

  async addToCart(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<getCartDTO> {
    const response = await this.axios.post("/carts/add", {
      userId,
      productId,
      quantity,
    });
    return response.data;
  }

  async getCartByUserId(userId: number): Promise<getCartDTO> {
    const response = await this.axios.get(`/carts/user/${userId}`);
    return response.data;
  }

  async updateCartItem(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<getCartDTO> {
    const response = await this.axios.patch(
      `/carts/user/${userId}/product/${productId}`,
      {},
      {
        params: {
          quantity: quantity,
        },
      },
    );
    return response.data;
  }

  async deleteProductFromCart(
    userId: number,
    productId: number,
  ): Promise<getCartDTO> {
    const response = await this.axios.delete(
      `/carts/user/${userId}/product/${productId}`,
    );
    return response.data;
  }

  async getAllCarts(): Promise<getCartDTO[]> {
    const response = await this.axios.get("/carts");
    return response.data;
  }
}

export default CartService;
