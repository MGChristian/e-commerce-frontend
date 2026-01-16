import { ShoppingCart } from "lucide-react";
import type { getProductDTO } from "../types/productType";
import { formatCurrency } from "../utils/fileUtils";

type ProductCardProps = {
  product: getProductDTO;
  onAddToCart: (productId: number) => void;
  isLoading?: boolean;
};

function ProductCard({ product, onAddToCart, isLoading }: ProductCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
      {/* Product Image */}
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
        {product.imageBase64 ? (
          <img
            src={product.imageBase64}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-800">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-sky-500">
          {formatCurrency(Number(product.price))}
        </p>
        {Number(product.stock) > 0 ? (
          <p className="text-xs text-slate-500">In Stock: {Number(product.stock)}</p>
        ) : (
          <p className="text-xs font-medium text-red-500">Out of Stock</p>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => onAddToCart(product.id)}
        disabled={isLoading || Number(product.stock) === 0}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-sky-400 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ShoppingCart size={18} />
        <span>Add to Cart</span>
      </button>
    </div>
  );
}

export default ProductCard;
