import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface BuyerUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isGuest: boolean;
}

interface BuyerAuthContextType {
  user: BuyerUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
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
    const response = await fetch('https://gdl-place-backend.onrender.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // if (!response.ok) {
    //   throw new Error(response.)
    //   throw new Error('Credenciales inválidas');
    // }

    if (!response.ok) {
      const errorData = await response.json(); throw new Error(errorData.message || 'Error incrospido al iniciar sesión');
    }

    // El backend devuelve algo como { access_token, user: { id, email, name, phone } }
    const data = await response.json();

    // Guardar token para futuras peticiones
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('role', data.role);
    console.log(data.role);

    // Guardar datos del usuario en el contexto
    setUser({
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      phone: data.user.phone,
      isGuest: false,
    });
  } catch (error) {
    throw error;
  }
};

  const register = async (name: string, email: string, password: string) => {
    // Simulación de registro - en producción conectar con backend
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setUser({
      id: Date.now().toString(),
      email,
      name,
      isGuest: false,
    });
  };

  const continueAsGuest = () => {
    setUser({
      id: 'guest-' + Date.now(),
      email: '',
      name: 'Invitado',
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