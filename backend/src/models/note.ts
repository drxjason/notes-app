import { InferSchemaType, model, Schema } from "mongoose";

// blueprint for the notes in the app (backend)
const noteSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String},
}, {timestamps: true})

// create the type for the note
type Note = InferSchemaType<typeof noteSchema>

// export the entire model
export default model<Note>("Note", noteSchema)