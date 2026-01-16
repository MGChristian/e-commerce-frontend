import type { Axios } from "axios";
import type { getOrderDTO } from "../types/orderType";

class OrderService {
  private axios: Axios;
  constructor(axios: Axios) {
    this.axios = axios;
  }

  async createOrder(userId: number): Promise<getOrderDTO> {
    const response = await this.axios.post("/orders/checkout", {
      userId,
    });
    return response.data;
  }

  async getAllOrders(): Promise<getOrderDTO[]> {
    const response = await this.axios.get("/orders");
    return response.data;
  }

  async getOrderById(orderId: number): Promise<getOrderDTO> {
    const response = await this.axios.get(`/orders/${orderId}`);
    return response.data;
  }

  async getOrderByUserId(userId: number): Promise<getOrderDTO> {
    const response = await this.axios.get(`/orders/user/${userId}`);
    return response.data;
  }
}

export default OrderService;
