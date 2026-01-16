import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import PageHeader from "../components/PageHeader";
import ProductService from "../services/productService";
import CartService from "../services/cartService";
import publicAxios from "../api/axios";
import type { getProductDTO } from "../types/productType";
import useUser from "../hooks/useUser";
import { Loader2, Package } from "lucide-react";

const productService = new ProductService(publicAxios);
const cartService = new CartService(publicAxios);

function Home() {
  const { userId } = useUser();
  const [products, setProducts] = useState<getProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  async function handleAddToCart(productId: number) {
    try {
      setAddingToCart(productId);
      await cartService.addToCart(userId, productId, 1);
      alert("Added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(null);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Shop Products"
        subtitle="Browse our collection of amazing products"
      />

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white py-16 shadow-sm">
          <Package size={48} className="text-slate-300" />
          <p className="text-slate-500">No products available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              isLoading={addingToCart === product.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
