import express from "express"
import * as NotesController from "../controllers/notes"

// router instantiation
const router = express.Router()

// endpoint for http get request
router.get("/", NotesController.getNotes)

router.get("/:noteId", NotesController.getNote)

// endpoint for http post request
router.post("/", NotesController.createNote)

export default router