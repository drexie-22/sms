import express from "express";
import cors from "cors";
import institutionRoutes from "./routes/institutions";
import trainingRoutes from "./routes/trainings";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/institutions", institutionRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/trainings", trainingRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("✅ STARBOOKS backend is running!");
});

