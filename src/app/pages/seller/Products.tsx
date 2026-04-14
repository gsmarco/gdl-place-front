import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Clock,
  Truck,
  AlertTriangle,
} from "lucide-react";
import { mockProducts, Product, categories } from "../../data/mockData";
import { ProductCard } from "../../components/ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, Link } from "react-router";
import { getEndPoint, getVars } from "../../components/global";
import { useSeller } from "../../components/getDatosVend";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

// import { stringify } from "querystring";
// import { Navigate } from "react-router";

export function SellerProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image: string[];
    sellerId: number;
    sellerName: string;
    shipping_time: string;
    shipping_unit: string;
  }

  interface FormData {
    name: string;
    description: string;
    price: string;
    category: string;
    stock: string;
    image: string[];
    shipping_time: string;
    shipping_unit: string;
  }

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: [],
    shipping_time: "",
    shipping_unit: "days",
  });

  let data: typeof products = [];
  // const [productImages, setProductImages] = useState<File[]>([]);
  // const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<(File | string)[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Estado para el diálogo de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const Variables = getVars("/");
  const userId = Variables.userId;
  const auth = Variables.auth;
  const token = Variables.token;
  const email = Variables.email;
  const baseUrl = getEndPoint("");

  //==========================================================
  const { seller, loading, error } = useSeller(email, auth);
  let business_name = seller?.bussines_name;
  if (!loading && !error) {
    business_name = seller?.bussines_name ?? "";
    Variables.userName = business_name;
    console.log(business_name);
  }
  //===========================================================================
  async function leeProductos() {
    useEffect(() => {
      if (!token) {
        alert(Variables.message);
        navigate("/");
        return;
      }

      const apiUrl = baseUrl + "/api/ProductsBySeller/" + userId;
      const fetchProducts = async () => {
        try {
          const response = await fetch(apiUrl, {
            method: "GET", // 👈 aquí, no dentro de headers
            headers: {
              Authorization: auth ?? "",
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            // Si la respuesta es error, intento leer el cuerpo
            const errorText = await response.text();
            throw new Error(
              `Error ${response.status} (${response.statusText}): ${errorText}`,
            );
          }

          const data = await response.json();
          setProducts(data);
          console.log("Productos cargados:", data);
        } catch (error) {
          alert("*** ERROR AL CARGAR LOS PRODUCTOS ***");
          console.error("Detalles del error:", error);
        }
      };

      fetchProducts();
    }, []);
  }

  function cargaImagenes(producto: Product) {
    const urlImage = baseUrl + "/uploads";

    const allImages = (producto.image || []).map(
      (img: string) => `${urlImage}/${img}`,
    );

    setImagePreviewUrls(allImages);
  }

  //===========================================================================
  const updateProduct = async (
    productId: number,
    updatedData: any,
    token: string,
  ) => {
    //
    // 1. Creamos un FormData en lugar de un objeto plano
    const formDataToSend = new FormData();
    // Filtramos las imágenes que ya existían (son strings)
    const existingImages = productImages.filter(
      (img) => typeof img === "string",
    );

    // Filtramos las nuevas (son objetos File)
    const newFiles = productImages.filter((img) => img instanceof File);
    // Enviamos los nombres de las que se quedan
    formDataToSend.append("images", JSON.stringify(existingImages));
    // Enviamos los archivos físicos de las nuevas
    newFiles.forEach((file) => {
      formDataToSend.append("images", file);
    });

    // 2. Agregamos los campos de texto
    formDataToSend.append("name", updatedData.name);
    formDataToSend.append("description", updatedData.description);
    formDataToSend.append("price", updatedData.price.toString());
    formDataToSend.append("category", updatedData.category);
    formDataToSend.append("stock", updatedData.stock.toString());
    formDataToSend.append("shipping_time", updatedData.shipping_time);
    formDataToSend.append("shipping_unit", updatedData.shipping_unit);
    // 3. Agregamos las imágenes reales del estado 'productImages'

    // productImages.forEach((file) => {
    //   formDataToSend.append("images", file); // El nombre "images" debe coincidir con tu backend
    // });

    console.log("existing images: ", existingImages);
    console.log("new files: ", newFiles);
    console.log("productImages: ", productImages);

    try {
      const apiUrl = getEndPoint("/api/Products/" + productId);
      const response = await fetch(apiUrl, {
        method: "PUT", // o "PATCH" según tu backend
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Error al actualizar producto");
      }

      const data = await response.json();
      console.log("Producto actualizado en API:", data);

      // Actualiza el estado local con la respuesta del servidor
      setProducts(products.map((p) => (p.id === productId ? data : p)));
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el producto");
    }
  };

  //===========================================================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      const updatedProduct = {
        ...editingProduct,
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      console.log(editingProduct);

      // 2. Enviar al backend
      updateProduct(editingProduct.id, updatedProduct, token);
    } else {
      // Crear nuevo producto
      const newProduct: Product = {
        id: 0,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        image: formData.image || ["product placeholder"],
        sellerId: Variables.userId,
        sellerName: Variables.userName,
        shipping_time: formData.shipping_time,
        shipping_unit: formData.shipping_unit,
      };

      setProducts([newProduct, ...products]);

      createProduct(newProduct);
    }

    closeModal();
  };

  const createProduct = async (newProduct: Product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debe iniciar sesión");
        return;
      }

      // 1. Creamos un FormData en lugar de un objeto plano
      const formDataToSend = new FormData();

      // 2. Agregamos los campos de texto
      formDataToSend.append("name", newProduct.name);
      formDataToSend.append("description", newProduct.description);
      formDataToSend.append("price", newProduct.price.toString());
      formDataToSend.append("category", newProduct.category);
      formDataToSend.append("stock", newProduct.stock.toString());
      formDataToSend.append("sellerId", newProduct.sellerId.toString());
      formDataToSend.append("shipping_time", newProduct.shipping_time);
      formDataToSend.append("shipping_unit", newProduct.shipping_unit);
      // haordcee esto porque no se de donde se tomaria el sellerName, nomas seria que lo obtengas del lugar correcto, tal vez el sesionstorage
      formDataToSend.append("sellerName", newProduct.sellerName);
      // 3. Agregamos las imágenes reales del estado 'productImages'
      productImages.forEach((file) => {
        formDataToSend.append("images", file); // El nombre "images" debe coincidir con tu backend
      });

      const apiUrl = getEndPoint("/api/Products/");

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          // IMPORTANTE: Al enviar FormData, NO debes poner "Content-Type": "application/json"
          // El navegador lo configurará automáticamente con el "boundary" correcto.
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Error al crear producto");

      const data: Product = await response.json();
      setProducts((prev) => [data, ...prev]);
      alert("Producto creado con éxito");
    } catch (error) {
      console.error(error);
      alert("No se pudo crear el producto");
    }
  };
  //=================================================================================

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      cargaImagenes(product);
      //
      setProductImages(product.image);
      // Las URLs de preview para imágenes existentes suelen ser la URL de tu backend
      const existingUrls = product.image.map(
        (imgName) => `http://127.0.0.1:3000/uploads/${imgName}`,
      );
      setImagePreviewUrls(existingUrls);
      //

      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        image: product.image || ["product-placeholder"], // siempre arreglo,
        shipping_time: product.shipping_time || "",
        shipping_unit: product.shipping_unit || "days",
      });
      console.log("image on 336: ", formData.image);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: [],
        shipping_time: "",
        shipping_unit: "days",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);

    // Limpiar imágenes y previsualizaciones
    imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    setProductImages([]);
    setImagePreviewUrls([]);
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  //===========================================================================
  const deleteProduct = async (productId: number, token: string) => {
    try {
      const apiUrl = getEndPoint("/api/Products/" + productId);
      const response = await fetch(apiUrl, {
        method: "DELETE", // o "PATCH" según tu backend
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al actualizar producto");
      }

      const data = await response.json();
      console.log("Producto eliminado en API:", data);

      // Actualiza el estado local con la respuesta del servidor
      setProducts(products.filter((p) => p.id !== productId));
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el producto");
    }
  };
  //===========================================================================

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id, token);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);

      setProductImages((prevImages) => {
        // Si el usuario selecciona fotos nuevas, actualizamos el estado
        const total = prevImages.length + newFiles.length;

        if (total > 5) {
          alert("Máximo 5 imágenes permitidas");
          // Opcional: solo tomamos las que quepan hasta llegar a 5
          const spaceLeft = 5 - prevImages.length;
          return [...prevImages, ...newFiles.slice(0, spaceLeft)];
        }

        return [...prevImages, ...newFiles];
      });

      // Generar las URLs para las miniaturas (previews)
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls((prev) => [...prev, ...newUrls].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = productImages.filter((_, i) => i !== index);
    const updatedUrls = imagePreviewUrls.filter((_, i) => i !== index);

    // Revocar URL del objeto eliminado
    URL.revokeObjectURL(imagePreviewUrls[index]);

    setProductImages(updatedImages);
    setImagePreviewUrls(updatedUrls);
  };

  leeProductos();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mis Productos
            </h1>
            <p className="text-gray-600">Gestiona tu inventario y productos</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="size-5" />
            Añadir Producto
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl border p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos por nombre o categoría..."
              className="w-full pl-12 pr-4 py-2 border-0 focus:ring-0 text-gray-700"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-600 mb-1">Total de Productos</p>
            <p className="text-2xl font-bold text-gray-900">
              {products.length}
            </p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-600 mb-1">Stock Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {products.reduce((sum, p) => sum + p.stock, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-600 mb-1">Valor del Inventario</p>
            <p className="text-2xl font-bold text-gray-900">
              $
              {products
                .reduce((sum, p) => sum + p.price * p.stock, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {/* ${product.price.toFixed(2)} */}${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {product.stock} unidades
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.stock > 10
                            ? "bg-green-100 text-green-800"
                            : product.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock > 10
                          ? "En Stock"
                          : product.stock > 0
                            ? "Bajo Stock"
                            : "Agotado"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="size-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(product)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-semibold">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Laptop Gaming Pro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe tu producto..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Imágenes del Producto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="size-4" />
                  Imágenes del Producto (Máx. 5)
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  {productImages.length}/5 imágenes cargadas
                </p>

                {/* Grid de previsualizaciones */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <AnimatePresence>
                    {imagePreviewUrls.map((url, index) => (
                      <motion.div
                        key={url}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative aspect-square group"
                      >
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                        />
                        {/* Badge de orden */}
                        <div className="absolute top-1 left-1 size-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        {/* Botón de eliminar */}
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 size-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="size-3" />
                        </motion.button>
                        {/* Indicador de imagen principal */}
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 right-1 bg-blue-600 text-white text-xs py-0.5 px-1 rounded text-center">
                            Principal
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Botón de añadir más imágenes */}
                  {productImages.length < 5 && (
                    <motion.label
                      htmlFor="product-images"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Upload className="size-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500 text-center px-1">
                        Añadir
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        id="product-images"
                      />
                    </motion.label>
                  )}
                </div>

                {/* Información adicional */}
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <ImageIcon className="size-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">
                      Consejos para mejores fotos:
                    </p>
                    <ul className="text-xs space-y-0.5 text-blue-700">
                      <li>
                        • La primera imagen será la imagen principal del
                        producto
                      </li>
                      <li>• Usa imágenes de alta calidad (JPG, PNG)</li>
                      <li>• Muestra el producto desde diferentes ángulos</li>
                      <li>• Máximo 5 imágenes por producto</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tiempo de Envío */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Truck className="size-4" />
                  Tiempo de Envío *
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.shipping_time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping_time: e.target.value,
                        })
                      }
                      className="w-24 pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <select
                    value={formData.shipping_unit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping_unit: e.target.value,
                      })
                    }
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hours">Horas</option>
                    <option value="days">Días</option>
                    <option value="weeks">Semanas</option>
                  </select>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Tiempo estimado desde la compra hasta la entrega
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProduct ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diálogo de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="size-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              ¿Eliminar Producto?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-3">
              {productToDelete && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900 text-sm">
                        {productToDelete.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${productToDelete.price} • {productToDelete.stock}{" "}
                        unidades
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-sm text-gray-600">
                Esta acción no se puede deshacer. El producto será eliminado
                permanentemente de tu inventario.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row sm:justify-center gap-2">
            <AlertDialogCancel
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Sí, Eliminar Producto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
