const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "suraj@231044",
  database: "ECommerceSystem",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper function to get a connection from the pool
const getConnection = () => {
  return pool.promise();
};

// ROUTES

// Fetch all products
app.get("/products", async (req, res) => {
  try {
    const [results] = await getConnection().query("SELECT * FROM Products");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Fetch a specific product by ID
app.get("/product/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const [results] = await getConnection().query(
      "SELECT * FROM Products WHERE product_id = ?",
      [productId]
    );
    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

app.post("/product", async (req, res) => {
  const { name, price, stock, category_id } = req.body;
  try {
    const [result] = await getConnection().query(
      "INSERT INTO Products (name, price, stock, category_id) VALUES (?, ?, ?, ?)",
      [name, price, stock, category_id]
    );
    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Fetch all users
app.get("/users", async (req, res) => {
  try {
    const [results] = await getConnection().query(
      "SELECT user_id, nickname, password, email, phone, address, created_at FROM Users"
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const [results] = await getConnection().query(
      "SELECT user_id, nickname, password, email, phone, address, created_at FROM Users WHERE user_id = ?",
      [userId]
    );
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.post("/user", async (req, res) => {
  const { nickname, password, email, phone, address } = req.body;
  try {
    const [results] = await getConnection().query(
      "INSERT INTO Users (nickname, password, email, phone, address) VALUES (?, ?, ?, ?, ?)",
      [nickname, password, email, phone, address]
    );
    res.status(201).json({
      message: "User created successfully",
      user_id: results.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const [results] = await getConnection().query("SELECT * FROM Categories");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.post("/order", async (req, res) => {
  const { user_id, order_date, total_amount, products } = req.body;
  const connection = await getConnection().getConnection();

  try {
    await connection.beginTransaction();

    const [orderResults] = await connection.query(
      "INSERT INTO Orders (user_id, order_date, total_amount) VALUES (?, ?, ?)",
      [user_id, order_date, total_amount]
    );

    const orderId = orderResults.insertId;

    // Insert order details
    const orderDetailsPromises = products.map((product) => {
      return connection.query(
        "INSERT INTO OrderDetails (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, product.product_id, product.quantity, product.price]
      );
    });

    // Wait for all order details to be inserted
    await Promise.all(orderDetailsPromises);

    // Commit transaction
    await connection.commit();
    res
      .status(201)
      .json({ message: "Order created successfully", order_id: orderId });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    connection.release();
  }
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query =
    "SELECT EXISTS(SELECT 1 FROM Users WHERE email = ? AND password = ?) AS user_exists";
  getConnection()
    .query(query, [email, password])
    .then(([results]) => {
      if (results[0].user_exists) {
        // User exists
        res.json({ message: "Login successful" });
      } else {
        // Invalid email or password
        res.status(401).json({ error: "Invalid email or password" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error" });
    });
});

// DELIMITER $$

// CREATE TRIGGER check_stock_before_insert
// BEFORE INSERT ON OrderDetails
// FOR EACH ROW
// BEGIN
//     DECLARE available_stock INT;

//     SELECT stock INTO available_stock
//     FROM Products
//     WHERE product_id = NEW.product_id;

//     IF available_stock = 0 THEN
//         SIGNAL SQLSTATE '45000'
//         SET MESSAGE_TEXT = 'Cannot create order detail. Product is out of stock.';
//     END IF;
// END $$

// DELIMITER ;

app.post("/order-detail", async (req, res) => {
  const { product_id, quantity, price } = req.body;
  try {
    const [results] = await getConnection().query(
      "INSERT INTO OrderDetails (product_id, quantity, price) VALUES (?, ?, ?)",
      [product_id, quantity, price]
    );
    res.status(201).json({
      message: "Order detail created successfully",
      order_detail_id: results.insertId,
    });
  } catch (err) {
    console.error("Error creating order detail:", err);
    res.status(500).json({ error: "Product is out of stock." });
  }
});

app.get("/order-detail", async (req, res) => {
  try {
    const [results] = await getConnection().query(`
      SELECT 
        order_detail_id, 
        product_id, 
        quantity, 
        price, 
        created_at 
      FROM OrderDetails
    `);
    res.json(results);
  } catch (err) {
    console.error("Error fetching order details:", err);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

app.delete("/order-detail", async (req, res) => {
  try {
    const [results] = await getConnection().query("DELETE FROM OrderDetails");
    if (results.affectedRows > 0) {
      res
        .status(200)
        .json({ message: "All order details removed successfully" });
    } else {
      res.status(404).json({ error: "No order details found" });
    }
  } catch (err) {
    console.error("Error deleting order details:", err);
    res.status(500).json({ error: "Failed to delete order details" });
  }
});

// CREATE VIEW electronics_products AS
// SELECT * FROM Products WHERE category_id = 1;

// CREATE VIEW clothing_products AS
// SELECT * FROM Products WHERE category_id = 2;

// Endpoint to fetch products based on category (electronics or clothing)
app.get("/products/:category", async (req, res) => {
  const { category } = req.params;

  let query = "";
  if (category === "electronics") {
    query = "SELECT * FROM electronics_products";
  } else if (category === "clothing") {
    query = "SELECT * FROM clothing_products";
  } else {
    query = "SELECT * FROM products";
  }

  try {
    const [results] = await getConnection().query(query);
    res.status(200).json({ data: results });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
