
-- QuickShop Management Database Schema
-- MySQL Database Setup

-- Create database
CREATE DATABASE IF NOT EXISTS quickshop_management;
USE quickshop_management;

-- Items table - stores product information
CREATE TABLE items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_barcode (barcode)
);

-- Inventory table - tracks stock levels and locations
CREATE TABLE inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    min_stock_level INT NOT NULL DEFAULT 5,
    location VARCHAR(100) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    INDEX idx_item_id (item_id),
    INDEX idx_location (location),
    INDEX idx_quantity (quantity)
);

-- Customers table - stores customer information
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone)
);

-- Purchases table - stores purchase/sales transactions
CREATE TABLE purchases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'card', 'digital') NOT NULL DEFAULT 'cash',
    status ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'completed',
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    INDEX idx_customer_id (customer_id),
    INDEX idx_purchase_date (purchase_date),
    INDEX idx_status (status)
);

-- Purchase items table - stores individual items in each purchase
CREATE TABLE purchase_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    purchase_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    INDEX idx_purchase_id (purchase_id),
    INDEX idx_item_id (item_id)
);

-- Stock movements table - tracks inventory changes
CREATE TABLE stock_movements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL,
    movement_type ENUM('in', 'out', 'adjustment') NOT NULL,
    quantity INT NOT NULL,
    reference_type ENUM('purchase', 'sale', 'adjustment', 'initial') NOT NULL,
    reference_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    INDEX idx_item_id (item_id),
    INDEX idx_movement_type (movement_type),
    INDEX idx_created_at (created_at)
);

-- Categories table - predefined categories for items
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Apparel and fashion items'),
('Food', 'Food and beverage products'),
('Books', 'Books and educational materials'),
('Home & Garden', 'Home improvement and gardening supplies'),
('Sports', 'Sports equipment and accessories'),
('Other', 'Miscellaneous items');

-- Suppliers table - stores supplier information
CREATE TABLE suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_email (email)
);

-- Item suppliers table - many-to-many relationship between items and suppliers
CREATE TABLE item_suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL,
    supplier_id INT NOT NULL,
    supplier_price DECIMAL(10, 2),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_item_supplier (item_id, supplier_id),
    INDEX idx_item_id (item_id),
    INDEX idx_supplier_id (supplier_id)
);

-- Create views for common queries
CREATE VIEW low_stock_items AS
SELECT 
    i.id,
    i.name,
    i.category,
    inv.quantity,
    inv.min_stock_level,
    inv.location
FROM items i
JOIN inventory inv ON i.id = inv.item_id
WHERE inv.quantity <= inv.min_stock_level;

CREATE VIEW sales_summary AS
SELECT 
    DATE(p.purchase_date) as sale_date,
    COUNT(p.id) as total_transactions,
    SUM(p.total_amount) as total_revenue,
    AVG(p.total_amount) as avg_transaction_value
FROM purchases p
WHERE p.status = 'completed'
GROUP BY DATE(p.purchase_date)
ORDER BY sale_date DESC;

-- Create triggers for automatic stock movement tracking
DELIMITER //

CREATE TRIGGER after_purchase_item_insert
AFTER INSERT ON purchase_items
FOR EACH ROW
BEGIN
    -- Record stock movement for sale
    INSERT INTO stock_movements (item_id, movement_type, quantity, reference_type, reference_id)
    VALUES (NEW.item_id, 'out', NEW.quantity, 'sale', NEW.purchase_id);
    
    -- Update inventory quantity
    UPDATE inventory 
    SET quantity = quantity - NEW.quantity,
        last_updated = CURRENT_TIMESTAMP
    WHERE item_id = NEW.item_id;
END//

CREATE TRIGGER after_inventory_update
AFTER UPDATE ON inventory
FOR EACH ROW
BEGIN
    -- Record stock adjustment if quantity changed
    IF OLD.quantity != NEW.quantity THEN
        INSERT INTO stock_movements (item_id, movement_type, quantity, reference_type, reference_id, notes)
        VALUES (
            NEW.item_id, 
            CASE 
                WHEN NEW.quantity > OLD.quantity THEN 'in'
                ELSE 'out'
            END,
            ABS(NEW.quantity - OLD.quantity),
            'adjustment',
            NULL,
            CONCAT('Inventory adjustment: ', OLD.quantity, ' -> ', NEW.quantity)
        );
    END IF;
END//

DELIMITER ;

-- Insert sample data for testing
INSERT INTO items (name, description, category, price, barcode) VALUES
('iPhone 15', 'Latest Apple smartphone', 'Electronics', 999.99, '123456789012'),
('Samsung Galaxy S24', 'Android flagship phone', 'Electronics', 899.99, '123456789013'),
('Nike Air Max', 'Running shoes', 'Clothing', 129.99, '123456789014'),
('Coffee Beans 1kg', 'Premium arabica coffee', 'Food', 24.99, '123456789015'),
('JavaScript Book', 'Learn modern JavaScript', 'Books', 39.99, '123456789016');

INSERT INTO customers (name, email, phone, address) VALUES
('John Doe', 'john@example.com', '+1234567890', '123 Main St, City, State'),
('Jane Smith', 'jane@example.com', '+1234567891', '456 Oak Ave, City, State'),
('Bob Johnson', 'bob@example.com', '+1234567892', '789 Pine St, City, State');

INSERT INTO inventory (item_id, quantity, min_stock_level, location) VALUES
(1, 25, 5, 'Store Front'),
(2, 15, 5, 'Store Front'),
(3, 40, 10, 'Store Front'),
(4, 100, 20, 'Warehouse A'),
(5, 30, 5, 'Store Front');

INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES
('Apple Inc.', 'Sales Team', 'sales@apple.com', '+1-800-APL-CARE', 'Cupertino, CA'),
('Samsung Electronics', 'Business Sales', 'business@samsung.com', '+1-800-SAMSUNG', 'Seoul, South Korea'),
('Nike Inc.', 'Wholesale Team', 'wholesale@nike.com', '+1-800-NIKE', 'Beaverton, OR');
