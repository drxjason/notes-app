import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import note from "../models/note";

// asynchronos database operation
export const getNotes: RequestHandler = async (req, res, next) => { // Asynchronos model
	// handle exceptions
	try {
		// throw Error("NOOO!")
		const notes = await NoteModel.find().exec()  
		// http 200
		res.status(200).json(notes)
	} catch(error) {
		next(error);
	}
};

// get one note instead of all
export const getNote: RequestHandler = async (req, res, next) => {
	// use the paramer from the request body - MongoDB note ID
	const noteId = req.params.noteId;

	try {
		if (!mongoose.isValidObjectId(noteId)) {
			throw createHttpError(400, "Invalid Note ID");
		}

		// fetch the note from the database
		const note = await NoteModel.findById(noteId).exec();

		if (!note) {
			throw createHttpError(404, "Note not found");
		}
		res.status(200).json(note);
	} catch (error) {
		next(error);
	}
};

// structure for our notes
interface NoteBody {
	title?: string,
	text?: string,
}

export const createNote: RequestHandler<unknown, unknown, NoteBody, unknown> = async (req, res, next) => {
	const title = req.body.title;
	const text = req.body.text;

	try {
		if (!title) {
			throw createHttpError(400, "Note must have a title"); // 400 bad request
		}
		
		// create a new entry set in the database - see ../models/notes.ts
		const newNote = await NoteModel.create({
			title: title,
			text: text
		});

		// respond with a 201 along with the body;
		res.status(201).json(newNote);

	} catch (error) {
		next(error);
	}
}

// structure for the note Id for patch request
interface NoteParams {
	noteId: string,
}

export const updateNote: RequestHandler<NoteParams, unknown, NoteBody, unknown> = async (req, res, next) => {
	const noteId = req.params.noteId;
	const title = req.body.title;
	const text = req.body.text;

	try {
		// check in the database if the note id even exists
		if (!mongoose.isValidObjectId(noteId)) {
			throw createHttpError(400, "Invalid Note ID");
		}

		// check if a required argument is missing - title
		if (!title) {
			throw createHttpError(400, "Note must have a title")
		}

		// get the note in the database
		const note = await NoteModel.findById(noteId).exec();

		// handle the error if the note is not found
		if (!note) {
			throw createHttpError(404, "Note is not found");
		}

		// update the note
		note.title = title;
		note.text = text;

		// save and update the note from the database
		const updatedNote = await note.save();

		res.status(200).json(updatedNote);

	} catch (error) {
		next(error);
	}
};

export const deleteNote: RequestHandler = async (req, res, next) => {
	const noteId = req.params.noteId;

	try {
		if (!mongoose.isValidObjectId(noteId)) {
			throw createHttpError(400, "Invalid Note ID");
		}

		// get the note
		const note = await NoteModel.findById(noteId).exec();

		if (!note) {
			throw createHttpError(404, "Note not found");
		}

		// delete the note
		await NoteModel.findByIdAndDelete(noteId).exec()	

		res.sendStatus(204); // DELETE
		
	} catch (error) {
		next(error);
	}
}