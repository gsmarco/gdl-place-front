import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { aP } from 'react-router/dist/development/instrumentation-DvHY1sgY';

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
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  register_seller: (businessName:string, ownerName:string, email:string, address:string, phone:string, city:string, category:string, description:string, password:string) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
}

const BuyerAuthContext = createContext<BuyerAuthContextType | undefined>(undefined);

export function BuyerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BuyerUser | null>(() => {
    // Restore user from localStorage on mount
    const savedUser = localStorage.getItem('buyerUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('buyerUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('buyerUser');
    }
  }, [user]);

const login = async (email: string, password: string) => {
  try {
    // Adecuar las variables de entorno de .env para apuntar al servidor de rende
    // https://gdl-place-backend.onrender.com
    const apiUrl = import.meta.env.VITE_APP_API_URL;      

    const response = await fetch(`${apiUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json(); throw new Error(errorData.message || 'Error incrospido al iniciar sesión');
    }

    // El backend devuelve algo como { access_token, user: { id, email, name } }
    const data = await response.json();

    // Guardar token para futuras peticiones
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', data.user);

    // Guardar datos del usuario en el contexto
    setUser({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      password: data.user.password,
      role: data.user.role,
      phone: '',
      isGuest: false,
    });
  } catch (error) {
    throw error;
  }
};

  const register = async (name: string, email: string, password: string, role:string) => {
    try {
      const apiUrl = import.meta.env.VITE_APP_API_URL;      

      // Adecuar las variables de entorno de .env para apuntar al servidor de rende
      // https://gdl-place-backend.onrender.com

      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error:", data.message);
        alert("Error: " +  data.message);
        return;
      }

  console.log("Registro exitoso:", data);
      // Simulación de registro - en producción conectar con backend
      // await new Promise(resolve => setTimeout(resolve, 800));
      
    } catch (error) {
      throw error;
    }
  };

  const register_seller = async (businessName: string, ownerName: string, email: string, address: string, phone:string, city: string, category: string, description: string, password: string) => {
    try {
      const apiUrl = import.meta.env.VITE_APP_API_URL;      

      // Adecuar las variables de entorno de .env para apuntar al servidor de rende
      // https://gdl-place-backend.onrender.com

      const response = await fetch(`${apiUrl}/api/sellers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({businessName, ownerName, email, address, phone, city, category, description, password }),
      });

      // Simulación de registro - en producción conectar con backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
    } catch (error) {
      throw error;
    }
  };

  const continueAsGuest = () => {
    setUser({
      id: 'guest-' + Date.now(),
      name: 'Invitado',
      email: '',
      password: '',
      role: 'BUYER',
      phone: '',
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
    throw new Error('useBuyerAuth must be used within a BuyerAuthProvider');
  }
  return context;
}