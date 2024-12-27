import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
// import checkAuth from '../routes/auth/auth.middleware.js';

dotenv.config();

const config = {
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
};

const AUTH_OPTIONS = {
	clientID: config.clientId,
	clientSecret: config.clientSecret,
	callbackURL: '/auth/google/callback',
};


passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	done(null, id);
});

function checkAuth(req, res, next) {
    console.log(req.user);
	const isLoggedIn = req.isAuthenticated() && req.user;
    
    if (isLoggedIn) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

function verifyCallback(accessToken, refreshToken, profile, done) {
	console.log(profile);
	return done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

export default passport;
