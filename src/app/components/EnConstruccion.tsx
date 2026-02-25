import { Link } from "react-router";

export function EnConstruccion({ ruta = "/", texto = "Ir al Homepage" }) {
  return (
    <div className="flex flex-col items-center mt-[100px]">
      {/* Div con bordes */}
      <div className="text-4xl font-bold  border-4 p-4 border-blue-500">
        Página en construcción
      </div>
      {/* Link debajo */}
      <Link to={ruta} className="mt-4 text-4xl hover:text-blue-800 font-semibold border-4 p-4 border-green-500" >
        {texto}
      </Link>
    </div>
  );
}