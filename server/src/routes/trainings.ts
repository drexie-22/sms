// server/src/routes/trainings.ts
import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// ✅ Get all trainings
router.get("/", async (req, res) => {
  try {
    const trainings = await prisma.training.findMany();
    res.json(trainings);
  } catch (error) {
    console.error("GET /trainings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add new training
router.post("/", async (req, res) => {
  try {
    const {
      institution,
      province,
      municipality,
      date,
      type,
      mode,
      trainer,
      participants,
      gadRemarks,
      totalParticipants,
    } = req.body;

    const training = await prisma.training.create({
      data: {
        institution,
        province,
        municipality,
        date: new Date(date),
        type,
        mode,
        trainer,
        male: participants.male,
        female: participants.female,
        others: participants.others,
        remarks: gadRemarks,
        total: totalParticipants,
      },
    });

    res.status(201).json(training);
  } catch (error) {
    console.error("POST /trainings error:", error);
    res.status(500).json({ message: "Failed to add training" });
  }
});

// ✅ GAD-focused institutions count
router.get("/gad-count", async (req, res) => {
  try {
    const trainings = await prisma.training.findMany();

    const gadInstitutions = new Set();
    trainings.forEach((t) => {
      if (t.female > 0 || t.others > 0) {
        gadInstitutions.add(t.institution.trim().toLowerCase());
      }
    });

    res.json({ gadCount: gadInstitutions.size });
  } catch (error) {
    console.error("GET /gad-count error:", error);
    res.status(500).json({ message: "Failed to count GAD-focused institutions" });
  }
});

export default router;
