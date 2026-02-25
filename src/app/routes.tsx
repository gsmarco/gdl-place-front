import { createBrowserRouter } from 'react-router';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/buyer/Home';
import { Catalog } from './pages/buyer/Catalog';
import { Cart } from './pages/buyer/Cart';
import { Checkout } from './pages/buyer/Checkout';
import { OrderSuccess } from './pages/buyer/OrderSuccess';
import { BuyerLogin } from './pages/buyer/BuyerLogin';
import { BuyerRegister } from './pages/buyer/BuyerRegister';
import { ProfileLayout } from './pages/buyer/profile/ProfileLayout';
import { ProfileInfo } from './pages/buyer/profile/ProfileInfo';
import { Addresses } from './pages/buyer/profile/Addresses';
import { PaymentMethods } from './pages/buyer/profile/PaymentMethods';
import { Orders } from './pages/buyer/profile/Orders';
import { SellerLogin } from './pages/seller/Login';
import { SellerRegister } from './pages/seller/Register';
import { SellerDashboard } from './pages/seller/Dashboard';
import { SellerProducts } from './pages/seller/Products';
import { SellerSales } from './pages/seller/Sales';
import { MyStore } from './pages/seller/MyStore';
import { EnConstruccion } from './components/EnConstruccion';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      // Buyer Routes
      { index: true, Component: Home },
      { path: 'catalog', Component: Catalog },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'order-success', Component: OrderSuccess },
      
      // Buyer Auth Routes
      { path: 'buyer/login', Component: BuyerLogin },
      { path: 'buyer/register', Component: BuyerRegister },
      
      // Buyer Profile Routes
      {
        path: 'profile',
        Component: ProfileLayout,
        children: [
          { path: 'info', Component: ProfileInfo },
          { path: 'addresses', Component: Addresses },
          { path: 'payment-methods', Component: PaymentMethods },
          { path: 'orders', Component: Orders },
        ],
      },
      
      // Seller Routes
      { path: 'seller/login', Component: SellerLogin },
      { path: 'seller/register', Component: SellerRegister },
      { path: 'seller/dashboard', Component: SellerDashboard },
      { path: 'seller/products', Component: SellerProducts },
      { path: 'seller/sales', Component: SellerSales },
      { path: 'seller/my-store', Component: MyStore },
    ],
  },
]);