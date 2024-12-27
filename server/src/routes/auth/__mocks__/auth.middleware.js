// __mocks__/auth.middleware.js
const checkAuth = (req, res, next) => {
	req.isAuthenticated = () => true; // Mock isAuthenticated to always return true
	next();
};

export { checkAuth };
