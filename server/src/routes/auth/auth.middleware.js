function checkAuth(req, res, next) {
    // For API requests, check if the request came from an authenticated session
    const isLoggedIn = req.isAuthenticated && req.isAuthenticated();
    
    if (isLoggedIn) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

export { checkAuth };