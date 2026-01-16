import { Minus, Plus, Trash2 } from "lucide-react";
import type { cartItemDto } from "../types/cartType";
import { formatCurrency } from "../utils/fileUtils";

type CartItemProps = {
  item: cartItemDto;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  isUpdating?: boolean;
};

function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating,
}: CartItemProps) {
  console.log("Rendering CartItem:", item);
  const handleIncrement = () => {
    onUpdateQuantity(item.product.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.product.id, item.quantity - 1);
    }
  };

  return (
    <div className="flex gap-4 rounded-xl bg-white p-4 shadow-sm">
      {/* Product Image */}
      <div className="h-26 w-26 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {item.product.imageBase64 ? (
          <img
            src={item.product.imageBase64}
            alt={item.product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            No Image
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-800">
            {item.product.name}
          </h3>
          <button
            onClick={() => onRemove(item.product.id)}
            disabled={isUpdating}
            className="cursor-pointer rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            title="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <p className="text-sm font-medium text-sky-500">
          {formatCurrency(Number(item.product.price))}
        </p>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              disabled={isUpdating || Number(item.quantity) <= 1}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Minus size={16} />
            </button>
            <span className="min-w-8 text-center text-sm font-medium text-slate-800">
              {Number(item.quantity)}
            </span>
            <button
              onClick={handleIncrement}
              disabled={isUpdating}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Subtotal */}
          <p className="text-sm font-bold text-slate-800">
            {formatCurrency(Number(item.product.price) * Number(item.quantity))}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
