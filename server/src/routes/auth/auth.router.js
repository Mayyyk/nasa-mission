import express from 'express';
import passport from 'passport';

const authRouter = express.Router();

authRouter.get(
	'/google',
	passport.authenticate('google', {
		scope: ['email'],
	})
);

authRouter.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/failure',
		successRedirect: '/launch?auth=success',
		session: false,
	})
);

authRouter.get('/failure', (req, res) => {
	res.send('Failed to authenticate');
});

authRouter.get('/logout', (req, res) => {
	res.send('Goodbye!');
});

export default authRouter;
