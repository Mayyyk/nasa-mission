import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import morgan from 'morgan';
import api from './routes/api.js';
import helmet from 'helmet';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
				styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
				fontSrc: ["'self'", 'fonts.gstatic.com'],
				imgSrc: ["'self'", 'data:', 'blob:'],
				connectSrc: [
					"'self'",
					'http://localhost:5000',
					'https://localhost:5000',
					'http://localhost:3000',
					'https://localhost:3000',
				],
			},
		},
		crossOriginEmbedderPolicy: false,
		crossOriginResourcePolicy: {
			policy: 'cross-origin',
		},
	})
);

app.use(
	cors({
		origin: [
			'https://localhost:3000',
			'http://localhost:3000',
			'https://localhost:5000',
			'http://localhost:5000',
		],
		methods: ['GET', 'POST', 'DELETE'],
		credentials: true,
	})
);

app.use(morgan('combined'));

app.use(express.json());

app.use('/v1', api);

app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/*', (req, res) => {
	// match all routes that are not matched above, so we can get also /history
	res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;
