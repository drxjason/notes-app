import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

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
interface CreateNoteBody {
	title?: string,
	text?: string,
}

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
	const title = req.body.title;
	const text = req.body.text;


	try {
		if (!title) {
			throw createHttpError(400, "Note must have a title"); // 400 bad request
		}
	
		const newNote = await NoteModel.create({
			title: title,
			text: text
		});

		res.status(201).json(newNote);
	} catch (error) {
		next(error);
	}
}