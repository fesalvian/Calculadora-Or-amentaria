
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import itemsRoutes from './routes/items';
import budgetsRoutes from './routes/budgets';
import exportRoutes from './routes/export';
import { authenticate } from './middleware/auth';
import path from 'path';
import { resolve } from 'path';
import { existsSync } from 'fs';


const app = express();
app.use(cors());
app.use(express.json());

// servir logos estaticamente
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/auth', authRoutes);
app.use('/items', authenticate, itemsRoutes);
app.use('/budgets', authenticate, budgetsRoutes);
app.use('/export', authenticate, exportRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));