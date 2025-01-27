-- Step 1: Create a new database
CREATE DATABASE ECommerceSystem;

-- Step 2: Use the newly created database
USE ECommerceSystem;

-- Step 3: Create the Users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Create the Categories table
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 5: Create the Products table
CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

-- Step 6: Create the Orders table
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Step 7: Create the OrderDetails table
CREATE TABLE OrderDetails (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Step 8: Create the 'electronics_products' view
CREATE VIEW electronics_products AS
SELECT * FROM Products WHERE category_id = 1;

-- Step 9: Create the 'clothing_products' view
CREATE VIEW clothing_products AS
SELECT * FROM Products WHERE category_id = 2;

-- Step 10: Create the trigger to check stock before inserting into OrderDetails
DELIMITER $$

CREATE TRIGGER check_stock_before_insert
BEFORE INSERT ON OrderDetails
FOR EACH ROW
BEGIN
    DECLARE available_stock INT;

    SELECT stock INTO available_stock
    FROM Products
    WHERE product_id = NEW.product_id;

    IF available_stock = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot create order detail. Product is out of stock.';
    END IF;
END $$

DELIMITER ;

-- Step 11: Example of fetching products by category (handled in API)
-- You can already use the 'electronics_products' and 'clothing_products' views created above.
-- Example query for electronics products:
SELECT * FROM electronics_products;

-- Example query for clothing products:
SELECT * FROM clothing_products;

-- Example query for all products:
SELECT * FROM Products;

-- Step 12: DELETE all records from the OrderDetails table (based on the DELETE endpoint)
DELETE FROM OrderDetails;
