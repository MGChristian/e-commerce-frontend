import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import CartItem from "../components/CartItem";
import PageHeader from "../components/PageHeader";
import CartService from "../services/cartService";
import OrderService from "../services/orderService";
import publicAxios from "../api/axios";
import type { getCartDTO } from "../types/cartType";
import useUser from "../hooks/useUser";
import { formatCurrency } from "../utils/fileUtils";
import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react";

const cartService = new CartService(publicAxios);
const orderService = new OrderService(publicAxios);

function Cart() {
  const { userId } = useUser();
  const navigate = useNavigate();
  const [cart, setCart] = useState<getCartDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [userId]);

  async function fetchCart() {
    try {
      setLoading(true);
      const data = await cartService.getCartByUserId(userId);
      setCart(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateQuantity(productId: number, quantity: number) {
    try {
      setUpdating(true);
      const updatedCart = await cartService.updateCartItem(
        userId,
        productId,
        quantity
      );
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert("Failed to update quantity. Please try again.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleRemoveItem(productId: number) {
    try {
      setUpdating(true);
      const updatedCart = await cartService.deleteProductFromCart(
        userId,
        productId
      );
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Failed to remove item. Please try again.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleCheckout() {
    try {
      setCheckingOut(true);
      await orderService.createOrder(userId);
      alert("Order Placed! Thank you for your purchase.");
      setCart(null);
      navigate("/");
    } catch (error: unknown) {
      console.error("Failed to checkout:", error);
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 400) {
        alert("Insufficient Stock! Please update your cart.");
      } else {
        alert("Failed to checkout. Please try again.");
      }
    } finally {
      setCheckingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Shopping Cart"
        subtitle={
          isEmpty
            ? "Your cart is empty"
            : `${cart.items.length} item(s) in your cart`
        }
      />

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white py-16 shadow-sm">
          <ShoppingCart size={48} className="text-slate-300" />
          <p className="text-slate-500">Your cart is empty.</p>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl bg-sky-400 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-500"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Cart Items */}
          <div className="flex flex-1 flex-col gap-4">
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                isUpdating={updating}
              />
            ))}
          </div>

          {/* Summary Panel */}
          <div className="lg:w-80">
            <div className="sticky top-24 flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800">Order Summary</h2>

              <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Subtotal</span>
                  <span className="text-sm font-medium text-slate-800">
                    {formatCurrency(Number(cart.total) || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Shipping</span>
                  <span className="text-sm font-medium text-green-600">
                    Free
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-base font-bold text-slate-800">
                  Total
                </span>
                <span className="text-xl font-bold text-sky-500">
                  {formatCurrency(Number(cart.total) || 0)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-sky-400 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkingOut ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Checkout</span>
                )}
              </button>

              <Link
                to="/"
                className="flex items-center justify-center gap-2 text-sm text-slate-500 transition-colors hover:text-sky-500"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
