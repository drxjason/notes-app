import app from "./app"
import env from "./util/validateEnv"
import mongoose from "mongoose"

const port = env.PORT

mongoose.connect(env.MONGO_PASS)
	.then(() => {
		console.log("Sucksess")
		// start the server
		app.listen(port, () => {
			console.log("Server running on port: " + port)
		})
	})
	.catch(console.error)
