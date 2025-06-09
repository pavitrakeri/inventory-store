
# QuickShop Management Database Schema

This MySQL database schema provides a complete foundation for the QuickShop Management system.

## Database Structure

### Core Tables

1. **items** - Product catalog
   - Stores product information (name, description, category, price, barcode)
   - Links to inventory and purchase items

2. **inventory** - Stock management
   - Tracks quantity, minimum stock levels, and locations
   - Links to items table

3. **customers** - Customer information
   - Stores customer details for sales tracking

4. **purchases** - Sales transactions
   - Records purchase headers with totals and payment methods

5. **purchase_items** - Individual items in sales
   - Line items for each purchase transaction

6. **stock_movements** - Inventory tracking
   - Audit trail for all stock changes

### Supporting Tables

7. **categories** - Product categories
8. **suppliers** - Supplier information
9. **item_suppliers** - Item-supplier relationships

### Views

- **low_stock_items** - Items below minimum stock level
- **sales_summary** - Daily sales aggregation

### Triggers

- Automatic stock movement tracking
- Inventory quantity updates on sales

## Setup Instructions

1. **Create the database:**
   ```sql
   mysql -u your_username -p < database/schema.sql
   ```

2. **Configure connection in your application:**
   - Host: your_mysql_host
   - Database: quickshop_management
   - Username: your_mysql_username
   - Password: your_mysql_password

3. **Test the setup:**
   ```sql
   USE quickshop_management;
   SELECT * FROM items;
   SELECT * FROM low_stock_items;
   ```

## Key Features

- **Referential Integrity** - Foreign keys maintain data consistency
- **Indexing** - Optimized queries for common operations
- **Triggers** - Automatic stock tracking and inventory updates
- **Sample Data** - Ready-to-use test data included
- **Audit Trail** - Complete tracking of inventory movements

## API Integration

This schema is designed to work with your React frontend through:
- REST API endpoints
- Supabase integration (if migrating to PostgreSQL)
- Direct MySQL connections

## Security Considerations

- Use environment variables for database credentials
- Implement proper user permissions
- Consider connection pooling for production
- Regular backups recommended
