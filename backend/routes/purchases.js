import express from 'express';
import pool from '../db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM purchases');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { customer_id, total, payment_method, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO purchases (customer_id, total, payment_method, status) VALUES (?, ?, ?, ?)',
      [customer_id, total, payment_method, status]
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { total, payment_method, status } = req.body;
  try {
    await pool.query(
      'UPDATE purchases SET total=?, payment_method=?, status=? WHERE id=?',
      [total, payment_method, status, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM purchases WHERE id = ?', [id]);
  res.json({ success: true });
});

export default router;