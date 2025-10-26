import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express';
import userRouter from "./routes/userRoutes.js";

const app = express();
await connectDB();

app.use(express.json());
app.use(cors());
// Sanitize Authorization header to avoid passing obviously-invalid values to
// Clerk's decoder which will throw a decode error and return an HTML stack.
app.use((req, res, next) => {
	try {
		const auth = req.headers.authorization || req.headers.Authorization;
		if (auth && typeof auth === 'string') {
			// Expect format: "Bearer <token>"; token should be a JWT with two dots.
			const parts = auth.split(' ');
			if (parts.length === 2) {
				const token = parts[1];
				if ((token.match(/\./g) || []).length !== 2) {
					// remove invalid Authorization so Clerk middleware won't attempt decode
					delete req.headers.authorization;
					delete req.headers.Authorization;
				}
			}
		}
	} catch (e) {
		// non-fatal — continue and let Clerk handle auth normally
		console.warn('Auth header sanitization error', e && e.message ? e.message : e);
	}
	next();
});
app.use(clerkMiddleware()); // attach req.auth()

app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", userRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
