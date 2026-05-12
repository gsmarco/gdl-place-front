export const usuarioEsVendendor = (lista: string[]) => {
  // Comprobamos el rol del usuario:
  const usuario = localStorage.getItem("user");
  const user = JSON.parse(usuario || "");

  //   if (!["seller", "admin"].includes(user.role)) {
  if (lista.includes(user.role)) {
    return true;
  }

  alert("El usuario no tiene rol de vendedor");
  return false;
};
