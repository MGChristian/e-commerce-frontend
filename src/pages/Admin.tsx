import { useEffect, useState } from "react";
import { TextInput, Textarea, NumberInput, FileInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import PageHeader from "../components/PageHeader";
import ProductService from "../services/productService";
import publicAxios from "../api/axios";
import type { createProductDTO, getProductDTO } from "../types/productType";
import { formatCurrency, fileToBase64 } from "../utils/fileUtils";
import {
  Edit,
  ImagePlus,
  Loader2,
  Package,
  Plus,
  Trash2,
  X,
} from "lucide-react";

const productService = new ProductService(publicAxios);

type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageBase64: string;
};

function Admin() {
  const [products, setProducts] = useState<getProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<getProductDTO | null>(
    null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const form = useForm<ProductFormValues>({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      imageBase64: "",
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Name is required"),
      price: (value) => (value > 0 ? null : "Price must be greater than 0"),
      stock: (value) => (value >= 0 ? null : "Stock cannot be negative"),
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

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

  function openAddModal() {
    setEditingProduct(null);
    form.reset();
    setShowModal(true);
  }

  function openEditModal(product: getProductDTO) {
    setEditingProduct(product);
    form.setValues({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      imageBase64: product.imageBase64 || "",
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingProduct(null);
    form.reset();
  }

  async function handleImageChange(file: File | null) {
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        form.setFieldValue("imageBase64", base64);
      } catch (error) {
        console.error("Failed to convert image:", error);
        alert("Failed to process image. Please try again.");
      }
    } else {
      form.setFieldValue("imageBase64", "");
    }
  }

  async function handleSubmit(values: ProductFormValues) {
    try {
      setSubmitting(true);
      const productData: createProductDTO = {
        name: values.name,
        description: values.description,
        price: values.price,
        stock: values.stock,
        imageBase64: values.imageBase64,
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        alert("Product updated successfully!");
      } else {
        await productService.createProduct(productData);
        alert("Product created successfully!");
      }

      closeModal();
      fetchProducts();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(productId: number) {
    try {
      await productService.deleteProduct(productId);
      alert("Product deleted successfully!");
      setDeleteConfirm(null);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
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
        title="Product Management"
        subtitle="Manage your product catalog"
        action={
          <button
            onClick={openAddModal}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-500"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        }
      />

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white py-16 shadow-sm">
          <Package size={48} className="text-slate-300" />
          <p className="text-slate-500">No products yet. Add your first one!</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-50 transition-colors hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-sm text-slate-600">
                    #{product.id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100">
                      {product.imageBase64 ? (
                        <img
                          src={product.imageBase64}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <Package size={16} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">
                    {product.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.stock > 10
                          ? "bg-green-100 text-green-700"
                          : product.stock > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-sky-600">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-sky-50 hover:text-sky-500"
                        title="Edit product"
                      >
                        <Edit size={16} />
                      </button>
                      {deleteConfirm === product.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="cursor-pointer rounded-lg bg-red-500 px-2 py-1 text-xs text-white transition-colors hover:bg-red-600"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="cursor-pointer rounded-lg bg-slate-200 px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500"
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-800">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={closeModal}
                className="cursor-pointer rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={form.onSubmit(handleSubmit)}
              className="flex flex-col gap-4 p-6"
            >
              <TextInput
                label="Name"
                placeholder="Enter product name"
                {...form.getInputProps("name")}
              />

              <Textarea
                label="Description"
                placeholder="Enter product description"
                rows={3}
                {...form.getInputProps("description")}
              />

              <div className="flex gap-4">
                <div className="flex-1">
                  <NumberInput
                    label="Price (₱)"
                    placeholder="0.00"
                    min={0}
                    decimalScale={2}
                    prefix="₱"
                    {...form.getInputProps("price")}
                  />
                </div>
                <div className="flex-1">
                  <NumberInput
                    label="Stock"
                    placeholder="0"
                    min={0}
                    {...form.getInputProps("stock")}
                  />
                </div>
              </div>

              <FileInput
                label="Product Image"
                placeholder="Click to upload image"
                accept="image/*"
                leftSection={<ImagePlus size={16} />}
                onChange={handleImageChange}
              />

              {form.values.imageBase64 && (
                <div className="flex items-center gap-2">
                  <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={form.values.imageBase64}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-green-600">
                    Image uploaded successfully
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? "Update" : "Create"} Product</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
