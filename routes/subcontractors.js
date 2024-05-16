// routes/subcontractors.js
const express = require("express");
const Subcontractor = require("../models/Subcontractor");
const SectionSubcontractor = require("../models/SectionSubcontractor");
const router = express.Router();

// Получение всех субподрядчиков для здания
router.get("/by-building/:buildingId", async (req, res) => {
  try {
    const subcontractors = await Subcontractor.findAll({
      where: { buildingId: req.params.buildingId },
    });
    res.json(subcontractors);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Получение всех субподрядчиков для здания с информацией о назначении на раздел
router.get("/by-building/:buildingId/section/:sectionId", async (req, res) => {
  try {
    const { buildingId, sectionId } = req.params;
    const subcontractors = await Subcontractor.findAll({
      where: { buildingId },
      include: [
        {
          model: SectionSubcontractor,
          as: "SectionSubcontractors", // Используем alias, определенный в ассоциациях
          where: { sectionId },
          required: false,
        },
      ],
    });

    const result = subcontractors.map((sub) => ({
      ...sub.toJSON(),
      isAssigned:
        sub.SectionSubcontractors && sub.SectionSubcontractors.length > 0,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Добавление субподрядчика
router.post("/", async (req, res) => {
  try {
    const newSubcontractor = await Subcontractor.create(req.body);
    res.status(201).json(newSubcontractor);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Обновление субподрядчика
router.put("/:id", async (req, res) => {
  try {
    const subcontractor = await Subcontractor.findByPk(req.params.id);
    if (!subcontractor) {
      return res.status(404).send("Subcontractor not found");
    }
    await subcontractor.update(req.body);
    res.json(subcontractor);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Удаление субподрядчика
router.delete("/:id", async (req, res) => {
  try {
    const subcontractor = await Subcontractor.findByPk(req.params.id);
    if (!subcontractor) {
      return res.status(404).send("Subcontractor not found");
    }
    await subcontractor.destroy();
    res.send("Subcontractor deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST - Назначение субподрядчика разделу
router.post("/assign", async (req, res) => {
  try {
    const { subcontractorId, sectionId } = req.body;
    const assignment = await SectionSubcontractor.create({
      subcontractorId,
      sectionId,
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE - Удаление субподрядчика из раздела
router.post("/unassign", async (req, res) => {
  try {
    const { subcontractorId, sectionId } = req.body; 
    await SectionSubcontractor.destroy({
      where: { subcontractorId, sectionId },
    });
    res.status(200).send("Subcontractor unassigned successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
