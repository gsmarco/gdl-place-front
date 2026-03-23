import { useState } from "react";

export default function ProductForm() {
  const [productImages, setProductImages] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);

    setProductImages((prev) => {
      const updated = [...prev, ...newFiles];

      // limitar a máximo 5
      if (updated.length > 5) {
        alert("Máximo 5 imágenes");
        return prev;
      }

      return updated;
    });
  };

  //=========================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: "Cafe Capuchino late",
      description: "Vaso de café capuchino con escencia de late 355 ml",
      price: 60.0,
      category: "category",
      stock: "Otros",
      image: "60.00",
      sellerId: 2,
      sellerName: "LECTRONICA STEREN",
      shipping_time: "1",
      shipping_unit: "Dias",
      images: productImages, // aquí debe ser un arreglo de strings (URLs) o base64
    };

    // const data = new FormData();

    // data.append("name", "Cafe Capuchino late");
    // data.append(
    //   "description",
    //   "Vaso de café capuchino con escencia de late 355 ml",
    // );
    // data.append("price", "60.00");
    // data.append("category", "category");
    // data.append("stock", "Otros");
    // data.append("image", "60.00");
    // data.append("sellerId", "2");
    // data.append("sellerName", "LECTRONICA STEREN");
    // data.append("shipping_time", "1");
    // data.append("shipping_unit", "Dias");

    productImages.forEach((img) => {
      data.append("images", img);
    });

    // 👇 DEBUG REAL
    console.log(data);

    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbi5nZGwtcGxhY2VAZ2RscGxhY2UuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzc0MjQ5MDAyLCJleHAiOjE3NzQyNTYyMDJ9.3Xns3Y-D2xaCXIGK9jJPzN-XssKzZIZs8HwF3Tthjcw";
    const reponse = await fetch("http://localhost:3000/api/Products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error("Error al crear producto");
    }
  };
  //=========================================================================
  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input
        type="text"
        placeholder="Nombre"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full"
      />

      <input type="file" multiple onChange={handleImageChange} />

      <button className="bg-blue-500 text-white px-4 py-2">Guardar</button>
    </form>
  );
}
