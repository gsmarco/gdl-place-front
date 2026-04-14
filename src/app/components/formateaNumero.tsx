import React from "react";

interface FormateadorProps {
  valor: number;
  tipo?: "moneda" | "entero"; // opcional, por defecto será "moneda"
  moneda?: string; // opcional, por defecto "MXN"
}

const Formateador: React.FC<FormateadorProps> = ({
  valor,
  tipo = "moneda",
  moneda = "MXN",
}) => {
  const opciones: Intl.NumberFormatOptions =
    tipo === "moneda"
      ? { style: "currency", currency: moneda }
      : { maximumFractionDigits: 0 };

  const valorFormateado = new Intl.NumberFormat("es-MX", opciones).format(
    valor,
  );

  return <span>{valorFormateado}</span>;
};

export default Formateador;

// import React from "react";

// interface Props {
//   valor: number; // aquí defines que 'valor' debe ser un número
// }

// const FormateadorMoneda: React.FC<Props> = ({ valor }) => {
//   const valorFormateado = new Intl.NumberFormat("es-MX", {
//     style: "currency",
//     currency: "MXN",
//   }).format(valor);

//   return <span>{valorFormateado}</span>;
// };

// export default FormateadorMoneda;
