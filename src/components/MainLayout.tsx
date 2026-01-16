import { Link, Outlet, useLocation } from "react-router";
import { ShoppingBag, Settings, Store } from "lucide-react";
import { NumberInput } from "@mantine/core";
import useUser from "../hooks/useUser";
import { useEffect, useState } from "react";
import CartService from "../services/cartService";
import publicAxios from "../api/axios";

const cartService = new CartService(publicAxios);

function MainLayout() {
  const { userId, setUserId } = useUser();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count when userId changes or location changes
  useEffect(() => {
    async function fetchCartCount() {
      try {
        const cart = await cartService.getCartByUserId(userId);
        const totalItems = cart.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        setCartCount(totalItems);
      } catch {
        setCartCount(0);
      }
    }
    fetchCartCount();
  }, [userId, location]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-sky-500"
          >
            <Store size={28} />
            <span>EasyCart</span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* User ID Switcher */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600">
                User ID
              </label>
              <NumberInput
                value={userId}
                onChange={(value) => setUserId(Number(value) || 1)}
                min={1}
                max={100}
                size="xs"
                className="w-20"
                styles={{
                  input: {
                    borderRadius: "0.75rem",
                  },
                }}
              />
            </div>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1 rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-sky-500"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-400 px-1 text-xs font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Admin Link */}
            <Link
              to="/admin"
              className="flex items-center gap-1 rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-sky-500"
            >
              <Settings size={20} />
              <span className="hidden text-sm font-medium sm:inline">
                Admin
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500">
        © 2026 EasyCart. All rights reserved.
      </footer>
    </div>
  );
}

export default MainLayout;
