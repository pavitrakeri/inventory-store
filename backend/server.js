import express from 'express';
import cors from 'cors';
import itemsRouter from './routes/items.js';
import inventoryRouter from './routes/inventory.js';
import purchasesRouter from './routes/purchases.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/items', itemsRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/purchases', purchasesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});