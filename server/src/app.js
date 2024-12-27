import api from './routes/api.js';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import { dirname } from 'path';
import passport from './services/passport.js';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth/auth.router.js';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const keys = [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2];

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

app.use(cookieSession({ // cookie-session is used to store the session in the cookie, data of the session is what came back from google 
    name: 'auth-session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: keys,
}));

app.use((req, res, next) => { // workaround for cookie-session potential bug
		if (req.session && !req.session.regenerate) {
			req.session.regenerate = (cb) => {
				cb();
			};
		}
		if (req.session && !req.session.save) {
			req.session.save = (cb) => {
				cb();
			};
		}
	next();
});

app.use(passport.initialize());

app.use(passport.session()); // this is needed for passport to work with cookie-session, it authenticates the session

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

// Auth routes (before API routes)
app.use('/auth', authRouter);

// API routes
app.use('/v1', api);

app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/*', (req, res) => {
	// match all routes that are not matched above, so we can get also /history
	res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;
