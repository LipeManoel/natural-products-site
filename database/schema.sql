-- DROP DATABASE natural_products_db;

CREATE DATABASE IF NOT EXISTS natural_products_db;

USE natural_products_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image VARCHAR(255),
  stock INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_cart (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY, -- fav_id
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


INSERT INTO products (name, description, price, image, stock) VALUES
("Chá Verde", "Ajuda na digestão e acelera o metabolismo.", 15.90, "cha-verde.jpg", 50),
("Mel Orgânico", "100% natural, direto do apicultor.", 25.00, "mel.jpg", 30),
("Castanhas do Pará", "Ricas em selênio e nutrientes.", 35.50, "castanhas.jpg", 20),
("Óleo de Coco", "Ideal para cabelo, pele e culinária saudável.", 20.00, "oleo-coco.jpg", 40),
("Gengibre Fresco", "Aumenta a imunidade e ajuda na digestão.", 8.50, "gengibre.jpg", 60),
("Açúcar Mascavo", "Alternativa natural ao açúcar refinado.", 12.00, "acucar-mascavo.jpg", 70),
("Aveia em Flocos", "Excelente fonte de fibras e energia.", 10.50, "aveia.jpg", 100),
("Linhaça Dourada", "Rica em ômega-3 e fibras.", 14.00, "linhaca.jpg", 80),
("Chá de Camomila", "Ajuda no sono e relaxamento.", 9.00, "cha-camomila.jpg", 50),
("Frutas Secas Sortidas", "Mix saudável e nutritivo.", 30.00, "frutas-secas.jpg", 25);
