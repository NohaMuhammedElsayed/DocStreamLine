// Protect middleware compatible with @clerk/express
// This middleware expects `clerkMiddleware()` from @clerk/express to have run
// earlier and to have attached either `req.auth()` (function) or `req.auth` (object).
export const protect = async (req, res, next) => {
  try {
    // Support both shapes: async helper function or plain object
    let userId;
    try {
      if (typeof req.auth === 'function') {
        const auth = await req.auth();
        userId = auth?.userId;
      } else if (req.auth && typeof req.auth === 'object') {
        userId = req.auth.userId;
      }
    } catch (e) {
      console.warn('Error resolving req.auth():', e && e.message ? e.message : e);
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    req.userId = userId;
    next();
  } catch (error) {
    console.error('Protect middleware error:', error && error.message ? error.message : error);
    return res.status(500).json({ success: false, message: error.message || 'Auth error' });
  }
};
