import express from "express";
import cors from "cors";
import db from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import habitLogRoutes from "./routes/habitLogRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import accountRoutes from "./routes/accountRoutes.js"

// Middlewares
import loggerHandling from "./middlewares/loggerHandling.js";
import errorHandling from "./middlewares/errorHandling.js";
import notFoundHandling from "./middlewares/notFoundHandling.js";
import authenticate from "./middlewares/authenticate.js";

const app = express();
const PORT = 3000;

// Global Middlewares
app.use(cors({
    origin: "http://localhost:5173",
}));

app.use(express.json());
app.use(loggerHandling);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", authenticate, habitRoutes);
app.use("/api/habit-logs", authenticate, habitLogRoutes);
app.use("/api/tasks", authenticate, taskRoutes);
app.use("/api/account", authenticate, accountRoutes);

// 404 Handler (must come after routes)
app.use(notFoundHandling);

// Error Handler (must be last)
app.use(errorHandling);

async function testDbConnection() {
    try {
        console.log("Testing database connection...");
        const result = await db.query("SELECT NOW()");
        console.log("PostgreSQL connection successful!");
        console.log(result.rows[0]);
    } catch (err) {
        console.error("Database connection failed!");
        console.error(err);
        process.exit(1);
    }
}

app.listen(PORT, async () => {
    await testDbConnection();
    console.log(`Server is running on http://localhost:${PORT}`);
});



