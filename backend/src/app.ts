import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import NotesRoutes from "./routes/notes";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

// endpoint /api/notes
app.use("/api/notes", NotesRoutes);

// non existing endpoint error handling - Middleware
app.use((req, res, next) => {
	next(createHttpError(404, "Endpoint not found"));
});

// Exceptions from app.get - Middleware
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
	console.error(error)
	let errorMessage = "An Exception Occured!";
	let statusCode = 500;
	if (isHttpError(error)) {
		statusCode = error.status;
		errorMessage = error.message;
	}
	// http 500
	res.status(statusCode).json({ error: errorMessage });
});

export default app;