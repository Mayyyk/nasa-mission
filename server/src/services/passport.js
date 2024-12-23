import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

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



function verifyCallback(accessToken, refreshToken, profile, done) {
	console.log(profile);
	return done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

export default passport;
