import express from "express"
import * as NotesController from "../controllers/notes"; // callback functions

// router instantiation
const router = express.Router();

// view all notes http get request
router.get("/", NotesController.getNotes);

// view a note http get request
router.get("/:noteId", NotesController.getNote);

// create a note http post request
router.post("/", NotesController.createNote);

// update a note http patch request
router.patch("/:noteId", NotesController.updateNote);

// delete a note http delete request
router.delete("/:noteId", NotesController.deleteNote);

export default router;