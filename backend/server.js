// server.js - placeholder
import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "151515",
  database: "natural_products_db"
});

const JWT_SECRET = "segredo_super_seguro";

// ---------- REGISTRO ----------
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashed]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Usuário já existe ou erro no registro." });
  }
});

// ---------- LOGIN ----------
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
  if (rows.length === 0) return res.status(400).json({ error: "Usuário não encontrado." });

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Senha incorreta." });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// ---------- MIDDLEWARE ----------
function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token necessário." });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "Token inválido." });
  }
}

// ---------- PRODUTOS ----------
app.get("/api/products", async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM products");
  res.json(rows);
});

// ---------- FAVORITOS ----------
app.post("/api/favorites", auth, async (req, res) => {
  const { productId, quantity } = req.body;

  const [rows] = await db.execute(
    "SELECT * FROM favorites WHERE user_id = ? AND product_id = ?",
    [req.user.id, productId]
  );

  if (rows.length > 0) {
    // Já está favoritado
    res.json({ success: false, message: "Produto já estava nos favoritos" });
  } else {
    // Insere novo favorito
    await db.execute(
      "INSERT INTO favorites (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [req.user.id, productId, quantity]
    );
    res.json({ success: true, message: "Adicionado aos favoritos!" });
  }
});

// listar favoritos incluindo fav_id
app.get("/api/favorites", auth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT f.id AS fav_id, p.id AS product_id, p.name, p.description,
              p.price, p.image, p.stock, f.quantity
       FROM favorites f
       JOIN products p ON f.product_id = p.id
       WHERE f.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /api/favorites error:", err);
    res.status(500).json({ error: "Erro ao listar favoritos" });
  }
});

// remover favorito por fav_id (apenas dono pode remover)
app.delete("/api/favorites/:id", auth, async (req, res) => {
  const favId = req.params.id;
  try {
    console.log("Remover fav:", favId, "user:", req.user.id);
    const [result] = await db.execute(
      "DELETE FROM favorites WHERE id = ? AND user_id = ?",
      [favId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Favorito não encontrado" });
    }

    res.json({ success: true, message: "Removido dos favoritos" });
  } catch (err) {
    console.error("DELETE /api/favorites/:id error:", err);
    res.status(500).json({ success: false, message: "Erro ao remover favorito" });
  }
});

// ---------- CARRINHO ----------
app.post("/api/cart", auth, async (req, res) => {
  const { productId, quantity } = req.body;

  // Verifica se já existe
  const [rows] = await db.execute(
    "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
    [req.user.id, productId]
  );

  if (rows.length > 0) {
    // Atualiza quantidade
    const newQuantity = rows[0].quantity + quantity;
    await db.execute(
      "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
      [newQuantity, req.user.id, productId]
    );
  } else {
    // Insere novo registro
    await db.execute(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [req.user.id, productId, quantity]
    );
  }

  res.json({ success: true });
});

app.get("/api/cart", auth, async (req, res) => {
  const [rows] = await db.execute(
    `SELECT c.id AS cart_id, p.*, c.quantity 
     FROM cart c 
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?`,
    [req.user.id]
  );
  res.json(rows);
});

app.delete("/api/cart/:id", auth, async (req, res) => {
  const cartId = req.params.id;
  await db.execute("DELETE FROM cart WHERE id = ? AND user_id = ?", [cartId, req.user.id]);
  res.json({ success: true });
});


app.get("/", (req, res) => {
  res.send("API rodando corretamente!");
});

app.listen(5000, () => console.log("Servidor rodando na porta 5000 🚀"));
