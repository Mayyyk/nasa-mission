import express from 'express';
import cors from 'cors';
import planetsRouter from './routes/planets/planets.router.js';

const app = express();

app.use(
	cors({
		origin: 'http://localhost:3000',
	})
);
app.use(express.json());
app.get('/planets', planetsRouter);

export default app;
