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
    // Simulación de login - en producción conectar con backend
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setUser({
      id: '1',
      email,
      name: 'Usuario Demo',
      phone: '123-456-7890',
      isGuest: false,
    });
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