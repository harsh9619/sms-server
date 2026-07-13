import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load env variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });
const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);
// Register routes
app.use(routes);
// Error handler
app.use(errorHandler);
const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
