import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// GET /api/institutions
router.get("/", async (req, res) => {
  try {
    const institutions = await prisma.institution.findMany({
      orderBy: { deploymentDate: "desc" },
    });
    res.json(institutions);
  } catch (error) {
    console.error("❌ Failed to fetch institutions:", error);
    res.status(500).json({ error: "Failed to fetch institutions" });
  }
});

// POST /api/institutions
router.post("/", async (req, res) => {
  try {
    console.log("📥 Received data:", req.body);

    const {
      name,
      recipientName,
      completeAddress,
      province,
      municipality,
      deploymentDate,
      institutionType,
      institutionalCode,
      email,
      phone,
      yearDistributed,
      status,
    } = req.body;

    const newInstitution = await prisma.institution.create({
      data: {
        name,
        recipientName,
        completeAddress,
        province,
        municipality,
        deploymentDate: new Date(deploymentDate),
        institutionType,
        institutionalCode,
        email,
        phone,
        yearDistributed: Number(yearDistributed),
        status: status.toUpperCase(),
      },
    });

    res.status(201).json(newInstitution);
  } catch (err) {
    console.error("❌ Failed to create institution:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, province, recipientName } = req.body;

  try {
    const updatedInstitution = await prisma.institution.update({
      where: { id: Number(id) },
      data: { name, province, recipientName },
    });

    res.json(updatedInstitution);
  } catch (error) {
    console.error("❌ Failed to update institution:", error);
    res.status(500).json({ message: "Update failed" });
  }
});

// DELETE /api/institutions/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.institution.delete({ where: { id: Number(id) } });
    res.json({ message: "Institution permanently deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete institution." });
  }
});

// DELETE /api/institutions/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.institution.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Institution permanently deleted." });
  } catch (err) {
  console.error("❌ Delete error:", err);
  alert("Error deleting institution.");
}
});

// PUT /api/institutions/:id
router.put("/institutions/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated = await prisma.institution.update({
      where: { id: Number(id) },
      data,
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});





export default router;
