import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors(), express.json());

// exemplo de rota
app.get('/api/ping', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API na porta ${PORT}`));
