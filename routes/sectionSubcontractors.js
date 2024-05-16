// server/routes/sectionSubcontractors.js
const express = require("express");
const router = express.Router();
const SectionSubcontractor = require("../models/SectionSubcontractor");

// Назначить субподрядчика разделу
router.post("/assign", async (req, res) => {
  try {
    const { sectionId, subcontractorId } = req.body;
    const newAssignment = await SectionSubcontractor.create({
      sectionId,
      subcontractorId,
    });
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Удалить субподрядчика из раздела
router.delete("/unassign", async (req, res) => {
  try {
    const { sectionId, subcontractorId } = req.body;
    await SectionSubcontractor.destroy({
      where: { sectionId, subcontractorId },
    });
    res.status(200).send("Subcontractor unassigned successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
