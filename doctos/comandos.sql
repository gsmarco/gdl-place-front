'{"Drone con camara 4K.jpg", "Escritorio Gaming RGB.jpg","Hub USB-C 7 en 1.jpg"}'
'{"Escritorio Gaming RGB.jpg", "Laptop HP Gaming Pro 5241.png", "Lentes Objetivo 50mm f_1-8.jpg"}'
'{"Micrófono USB Condensador.jpg", "Power Bank 20000mAh.jpg", "Router WiFi 6 Mesh.jpg"}'
'{"Silla Gamer Ergonómica.jpg", "shopping.jpg", "shopping.jpg"}'
'{"Soporte para Laptop Ajustable.jpg", "Tarjeta Gráfica RTX 4070.jpg", "Trípode Profesional.jpg"}'

Drone con camara 4K.jpg
Escritorio Gaming RGB.jpg
Hub USB-C 7 en 1.jpg
Lampara LED Inteligente.jpg
Laptop HP Gaming Pro 5241.png
Lentes Objetivo 50mm f_1-8.jpg
Micrófono USB Condensador.jpg
Power Bank 20000mAh.jpg
Router WiFi 6 Mesh.jpg
shopping.jpg
shopping.webp
Silla Gamer Ergonómica.jpg
Soporte para Laptop Ajustable.jpg
Tarjeta Gráfica RTX 4070.jpg
Trípode Profesional.jpg

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  seller_id INT NOT NULL,
  store_name VARCHAR(255),
  story_title VARCHAR(255),
  story_content TEXT,
  cover_image TEXT,
  gallery_images TEXT[], 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_seller FOREIGN KEY (seller_id) REFERENCES sellers(id)
);

alter table products drop column gallery_images;

ALTER TABLE products
ALTER COLUMN image TYPE text[]
USING ARRAY[image];

update products 
set image = '{"Micrófono USB Condensador.jpg", "Tarjeta Gráfica RTX 4070.jpg", "Escritorio Gaming RGB.jpg"}'
where id = 4;

update products 
set image = '{"Drone con camara 4K.jpg", "Escritorio Gaming RGB.jpg","Hub USB-C 7 en 1.jpg"}'
where id = 7;

update products 
set image = '{"Drone con camara 4K.jpg", "Escritorio Gaming RGB.jpg","Hub USB-C 7 en 1.jpg"}'
where id = 10;

update products 
set image = '{"Micrófono USB Condensador.jpg", "Power Bank 20000mAh.jpg", "Router WiFi 6 Mesh.jpg"}'
where id = 13;

update products 
set image = '{"Drone con camara 4K.jpg", "Escritorio Gaming RGB.jpg","Hub USB-C 7 en 1.jpg"}'
where id = 16;

update products 
set image = '{"Drone con camara 4K.jpg", "Escritorio Gaming RGB.jpg","Hub USB-C 7 en 1.jpg"}'
where id = 19;




'{"Soporte para Laptop Ajustable.jpg", "Tarjeta Gráfica RTX 4070.jpg", "Trípode Profesional.jpg"}'


'Drone con camara 4K.jpg',
'Escritorio Gaming RGB.jpg',
'Hub USB-C 7 en 1.jpg',
'Lampara LED Inteligente.jpg',
'Laptop HP Gaming Pro 5241.png',
'Lentes Objetivo 50mm f_1-8.jpg',
'Micrófono USB Condensador.jpg',
'Power Bank 20000mAh.jpg',
'Router WiFi 6 Mesh.jpg',
'shopping.jpg',
'shopping.webp',
'Silla Gamer Ergonómica.jpg',
'Soporte para Laptop Ajustable.jpg',
'Tarjeta Gráfica RTX 4070.jpg',
'Trípode Profesional.jpg'


alter table products add gallery_images TEXT[];

update products set seller_id = 300 where seller_id = 3 and id != 1

select * from products p where p.seller_id = 3 and id != 1

