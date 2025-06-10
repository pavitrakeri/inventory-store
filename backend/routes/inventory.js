import express from 'express';
import pool from '../db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM inventory');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { item_id, quantity, min_stock_level, location, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO inventory (item_id, quantity, min_stock_level, location, status) VALUES (?, ?, ?, ?, ?)',
      [item_id, quantity, min_stock_level, location, status]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity, min_stock_level, location, status } = req.body;
  try {
    await pool.query(
      'UPDATE inventory SET quantity=?, min_stock_level=?, location=?, status=? WHERE id=?',
      [quantity, min_stock_level, location, status, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM inventory WHERE id = ?', [id]);
  res.json({ success: true });
});

export default router;