import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
// import { aP } from 'react-router/dist/development/instrumentation-DvHY1sgY';

export interface BuyerUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  isGuest: boolean;
}

interface BuyerAuthContextType {
  user: BuyerUser | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; user?: BuyerUser }>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string,
  ) => Promise<void>;
  register_seller: (
    businessName: string,
    ownerName: string,
    email: string,
    address: string,
    phone: string,
    city: string,
    category: string,
    description: string,
    password: string,
  ) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
}

// Adecuar las variables de entorno de .env para apuntar al servidor de rende
const BuyerAuthContext = createContext<BuyerAuthContextType | undefined>(
  undefined,
);

let apiUrlBase = "https://gdl-place-backend.onrender.com";
apiUrlBase = import.meta.env.VITE_API_URL;

export function BuyerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BuyerUser | null>(() => {
    // Restore user from localStorage on mount
    const savedUser = localStorage.getItem("buyerUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  async function login(email: string, password: string) {
    const apiUrl = apiUrlBase + "/api/login";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Verificamos si la respuesta fue exitosa
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false }; // 👈 devolver explícitamente
        // throw new Error(errorData.message || 'Error inesperado al iniciar sesión');
      }

      // Si todo salió bien, procesamos la respuesta
      const data = await response.json();
      console.log("Login exitoso:", data);

      // Guardar token para futuras peticiones
      localStorage.setItem("token", data.access_token);

      // Guardar datos del usuario en el contexto
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        password: data.user.password,
        role: data.user.role,
        phone: "",
        isGuest: false,
      });

      return { success: true, user: data.user };
    } catch (error: unknown) {
      console.error("Error en login:", error);
      return { success: false }; // 👈 devolver explícitamente
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string,
  ) => {
    try {
      const apiUrl = apiUrlBase + "/api/register";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error:", data.message);
        alert("Error: " + data.message);
        return;
      }

      console.log("Registro exitoso:", data);
      // Simulación de registro - en producción conectar con backend
      // await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      throw error;
    }
  };

  const register_seller = async (
    businessName: string,
    ownerName: string,
    email: string,
    address: string,
    phone: string,
    city: string,
    category: string,
    description: string,
    password: string,
  ) => {
    try {
      const apiUrl = apiUrlBase + "/api/sellers";
      alert(apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName,
          ownerName,
          email,
          address,
          phone,
          city,
          category,
          description,
          password,
        }),
      });

      // Simulación de registro - en producción conectar con backend
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (error) {
      throw error;
    }
  };

  const continueAsGuest = () => {
    setUser({
      id: "guest-" + Date.now(),
      name: "Invitado",
      email: "",
      password: "",
      role: "buyer",
      phone: "",
      isGuest: true,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <BuyerAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        register_seller,
        continueAsGuest,
        logout,
      }}
    >
      {children}
    </BuyerAuthContext.Provider>
  );
}

export function useBuyerAuth() {
  const context = useContext(BuyerAuthContext);
  if (context === undefined) {
    throw new Error("useBuyerAuth must be used within a BuyerAuthProvider");
  }
  return context;
}
