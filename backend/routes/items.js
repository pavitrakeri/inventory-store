import express from 'express';
import pool from '../db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM items');
  res.json(rows);
});

// Add new item
router.post('/', async (req, res) => {
  const { name, description, category, price, barcode } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO items (name, description, category, price, barcode) VALUES (?, ?, ?, ?, ?)',
      [name, description, category, price, barcode]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update an item
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, barcode } = req.body;
  try {
    await pool.query(
      'UPDATE items SET name=?, description=?, category=?, price=?, barcode=? WHERE id=?',
      [name, description, category, price, barcode, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM items WHERE id = ?', [id]);
  res.json({ success: true });
});

export default router;