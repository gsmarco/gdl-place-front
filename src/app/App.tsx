import { RouterProvider } from "react-router";
import { router } from "./routes";
import { BuyerAuthProvider } from "./contexts/BuyerAuthContext";

export default function App() {
  return (
    <BuyerAuthProvider>
      <RouterProvider router={router} />
    </BuyerAuthProvider>
  );
}
