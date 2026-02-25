// Mock data para el marketplace


export interface buyerUser {
  id: string;
  email: string;
  name: string;
  isGuest: boolean
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  sellerId: string;
  sellerName: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  total: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  date: string;
  status: 'pending' | 'completed' | 'cancelled' | 'shipped';
  trackingNumber?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Gaming Pro',
    description: 'Laptop de alto rendimiento con RTX 4060',
    price: 1299.99,
    category: 'Electrónica',
    stock: 15,
    image: 'laptop gaming workspace',
    sellerId: 'seller1',
    sellerName: 'Tech Store'
  },
  {
    id: '2',
    name: 'Auriculares Bluetooth Premium',
    description: 'Cancelación de ruido activa, batería 30hrs',
    price: 249.99,
    category: 'Accesorios',
    stock: 42,
    image: 'premium headphones black',
    sellerId: 'seller1',
    sellerName: 'Tech Store'
  },
  {
    id: '3',
    name: 'Cámara Mirrorless 4K',
    description: 'Sensor full frame, grabación 4K 60fps',
    price: 1899.99,
    category: 'Fotografía',
    stock: 8,
    image: 'professional camera mirrorless',
    sellerId: 'seller2',
    sellerName: 'Photo Pro'
  },
  {
    id: '4',
    name: 'Smartphone Pro Max',
    description: 'Pantalla OLED 6.7", cámara triple 108MP',
    price: 999.99,
    category: 'Electrónica',
    stock: 25,
    image: 'modern smartphone screen',
    sellerId: 'seller1',
    sellerName: 'Tech Store'
  },
  {
    id: '5',
    name: 'Smartwatch Elite',
    description: 'Monitoreo de salud 24/7, GPS integrado',
    price: 349.99,
    category: 'Accesorios',
    stock: 31,
    image: 'luxury smartwatch fitness',
    sellerId: 'seller2',
    sellerName: 'Photo Pro'
  },
  {
    id: '6',
    name: 'Tablet Pro 12.9"',
    description: 'Pantalla Liquid Retina, chip M2',
    price: 1099.99,
    category: 'Electrónica',
    stock: 12,
    image: 'modern tablet workspace',
    sellerId: 'seller1',
    sellerName: 'Tech Store'
  },
  {
    id: '7',
    name: 'Teclado Mecánico RGB',
    description: 'Switches Cherry MX, iluminación personalizable',
    price: 159.99,
    category: 'Accesorios',
    stock: 28,
    image: 'mechanical keyboard rgb',
    sellerId: 'seller1',
    sellerName: 'Tech Store'
  },
  {
    id: '8',
    name: 'Mouse Gaming Inalámbrico',
    description: 'Sensor óptico 25000 DPI, batería 90 horas',
    price: 89.99,
    category: 'Accesorios',
    stock: 35,
    image: 'gaming mouse wireless',
    sellerId: 'seller1',
    sellerName: 'Tech Store'
  },
  {
    id: '9',
    name: 'Monitor 4K UHD 32"',
    description: 'Panel IPS, 144Hz, HDR10',
    price: 599.99,
    category: 'Electrónica',
    stock: 10,
    image: 'ultra wide monitor 4k',
    sellerId: 'seller2',
    sellerName: 'Photo Pro'
  },
  {
    id: '10',
    name: 'Webcam Full HD Pro',
    description: '1080p 60fps, autofocus, micrófono integrado',
    price: 129.99,
    category: 'Accesorios',
    stock: 22,
    image: 'professional webcam streaming',
    sellerId: 'seller1',
    sellerName: 'Tech Store'
  },
  {
    id: '11',
    name: 'Disco SSD NVMe 1TB',
    description: 'Velocidad de lectura 7000 MB/s',
    price: 149.99,
    category: 'Computación',
    stock: 45,
    image: 'nvme ssd storage',
    sellerId: 'seller2',
    sellerName: 'Photo Pro'
  },
  {
    id: '12',
    name: 'Bocinas Bluetooth Portátiles',
    description: 'Sonido 360°, resistentes al agua IPX7',
    price: 179.99,
    category: 'Audio',
    stock: 18,
    image: 'portable bluetooth speaker',
    sellerId: 'seller1',
    sellerName: 'Tech Store'
  },
  {
    id: '13',
    name: 'Micrófono USB Condensador',
    description: 'Ideal para streaming y podcasts',
    price: 109.99,
    category: 'Audio',
    stock: 14,
    image: 'studio microphone podcasting',
    sellerId: 'seller2',
    sellerName: 'Photo Pro'
  },
  {
    id: '14',
    name: 'Drone con Cámara 4K',
    description: 'Estabilización gimbal, alcance 5km',
    price: 799.99,
    category: 'Fotografía',
    stock: 6,
    image: 'professional drone camera',
    sellerId: 'seller2',
    sellerName: 'Photo Pro'
  },
  {
    id: '15',
    name: 'Trípode Profesional',
    description: 'Aluminio, altura máxima 180cm',
    price: 89.99,
    category: 'Fotografía',
    stock: 20,
    image: 'camera tripod professional',
    sellerId: 'seller2',
    sellerName: 'Photo Pro'
  },
  {
    id: '16',
    name: 'Lentes Objetivo 50mm f/1.8',
    description: 'Gran apertura para retratos profesionales',
    price: 449.99,
    category: 'Fotografía',
    stock: 9,
    image: 'camera lens portrait',
    sellerId: 'seller2',
    sellerName: 'Photo Pro'
  },
  {
    id: '17',
    name: 'Router WiFi 6 Mesh',
    description: 'Cobertura completa, velocidad AX6000',
    price: 299.99,
    category: 'Electrónica',
    stock: 16,
    image: 'wifi router modern',
    sellerId: 'seller1',
    sellerName: 'Tech Store'
  },
  {
    id: '18',
    name: 'Power Bank 20000mAh',
    description: 'Carga rápida 65W, USB-C PD',
    price: 69.99,
    category: 'Accesorios',
    stock: 50,
    image: 'portable charger powerbank',
    sellerId: 'seller1',
    sellerName: 'Tech Store'
  },
  {
    id: '19',
    name: 'Hub USB-C 7 en 1',
    description: 'HDMI 4K, USB 3.0, lector SD',
    price: 54.99,
    category: 'Accesorios',
    stock: 33,
    image: 'usb hub multiport',
    sellerId: 'seller1',
    sellerName: 'Tech Store'
  },
  {
    id: '20',
    name: 'Soporte para Laptop Ajustable',
    description: 'Aluminio, ergonómico, ventilación mejorada',
    price: 39.99,
    category: 'Accesorios',
    stock: 27,
    image: 'laptop stand aluminum',
    sellerId: 'seller1',
    sellerName: 'Tech Store'
  },
  {
    id: '21',
    name: 'Silla Gamer Ergonómica',
    description: 'Soporte lumbar, reposabrazos 4D',
    price: 329.99,
    category: 'Otros',
    stock: 11,
    image: 'gaming chair ergonomic',
    sellerId: 'seller1',
    sellerName: 'Tech Store'
  },
  {
    id: '22',
    name: 'Escritorio Gaming RGB',
    description: 'Superficie grande, gestión de cables integrada',
    price: 249.99,
    category: 'Otros',
    stock: 8,
    image: 'gaming desk modern',
    sellerId: 'seller1',
    sellerName: 'Tech Store'
  },
  {
    id: '23',
    name: 'Lampara LED Inteligente',
    description: 'Control por app, 16 millones de colores',
    price: 44.99,
    category: 'Otros',
    stock: 30,
    image: 'smart led light bulb',
    sellerId: 'seller2',
    sellerName: 'Photo Pro'
  },
  {
    id: '24',
    name: 'Tarjeta Gráfica RTX 4070',
    description: '12GB GDDR6X, ray tracing avanzado',
    price: 649.99,
    category: 'Computación',
    stock: 7,
    image: 'graphics card nvidia',
    sellerId: 'seller1',
    sellerName: 'Tech Store'
  }
];

export const mockSales: Sale[] = [
  {
    id: 's1',
    productId: '1',
    productName: 'Laptop Gaming Pro',
    quantity: 2,
    total: 2599.98,
    buyerName: 'Juan Pérez',
    buyerEmail: 'juan.perez@example.com',
    buyerPhone: '123-456-7890',
    shippingAddress: {
      street: '123 Calle Principal',
      city: 'Ciudad Ejemplo',
      state: 'Estado Ejemplo',
      zipCode: '12345',
      country: 'País Ejemplo'
    },
    products: [
      {
        id: '1',
        name: 'Laptop Gaming Pro',
        price: 1299.99,
        quantity: 2,
        image: 'laptop gaming workspace'
      }
    ],
    date: '2026-02-17',
    status: 'completed'
  },
  {
    id: 's2',
    productId: '2',
    productName: 'Auriculares Bluetooth Premium',
    quantity: 5,
    total: 1249.95,
    buyerName: 'María García',
    buyerEmail: 'maria.garcia@example.com',
    buyerPhone: '098-765-4321',
    shippingAddress: {
      street: '456 Avenida Secundaria',
      city: 'Ciudad Ejemplo',
      state: 'Estado Ejemplo',
      zipCode: '67890',
      country: 'País Ejemplo'
    },
    products: [
      {
        id: '2',
        name: 'Auriculares Bluetooth Premium',
        price: 249.99,
        quantity: 5,
        image: 'premium headphones black'
      }
    ],
    date: '2026-02-17',
    status: 'completed'
  },
  {
    id: 's3',
    productId: '4',
    productName: 'Smartphone Pro Max',
    quantity: 1,
    total: 999.99,
    buyerName: 'Carlos López',
    buyerEmail: 'carlos.lopez@example.com',
    buyerPhone: '555-123-4567',
    shippingAddress: {
      street: '789 Calle Terciaria',
      city: 'Ciudad Ejemplo',
      state: 'Estado Ejemplo',
      zipCode: '11223',
      country: 'País Ejemplo'
    },
    products: [
      {
        id: '4',
        name: 'Smartphone Pro Max',
        price: 999.99,
        quantity: 1,
        image: 'modern smartphone screen'
      }
    ],
    date: '2026-02-16',
    status: 'pending'
  },
  {
    id: 's4',
    productId: '6',
    productName: 'Tablet Pro 12.9"',
    quantity: 3,
    total: 3299.97,
    buyerName: 'Ana Martínez',
    buyerEmail: 'ana.martinez@example.com',
    buyerPhone: '555-987-6543',
    shippingAddress: {
      street: '101 Calle Cuarta',
      city: 'Ciudad Ejemplo',
      state: 'Estado Ejemplo',
      zipCode: '44556',
      country: 'País Ejemplo'
    },
    products: [
      {
        id: '6',
        name: 'Tablet Pro 12.9"',
        price: 1099.99,
        quantity: 3,
        image: 'modern tablet workspace'
      }
    ],
    date: '2026-02-15',
    status: 'completed'
  },
  {
    id: 's5',
    productId: '1',
    productName: 'Laptop Gaming Pro',
    quantity: 1,
    total: 1299.99,
    buyerName: 'Luis Rodríguez',
    buyerEmail: 'luis.rodriguez@example.com',
    buyerPhone: '555-555-5555',
    shippingAddress: {
      street: '202 Calle Quinta',
      city: 'Ciudad Ejemplo',
      state: 'Estado Ejemplo',
      zipCode: '77889',
      country: 'País Ejemplo'
    },
    products: [
      {
        id: '1',
        name: 'Laptop Gaming Pro',
        price: 1299.99,
        quantity: 1,
        image: 'laptop gaming workspace'
      }
    ],
    date: '2026-02-14',
    status: 'completed'
  }
];

export const categories = [
  'Electrónica',
  'Accesorios',
  'Fotografía',
  'Computación',
  'Audio',
  'Otros'
];