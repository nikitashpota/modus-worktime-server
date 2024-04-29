// routes/milestones.js
const express = require("express");
const Milestone = require("../models/Milestone");
const router = express.Router();

// Получение вех для здания
router.get("/:buildingId", async (req, res) => {
  try {
    const { buildingId } = req.params;
    const milestones = await Milestone.findAll({ where: { buildingId } });
    res.json(milestones);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { buildingId, name, code, date } = req.body;
    if (!buildingId) {
      return res.status(400).send("Building ID is required");
    }
    const milestone = await Milestone.create({ buildingId, name, code, date });
    res.status(201).json(milestone);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Обновление вехи
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findByPk(id);
    if (!milestone) {
      return res.status(404).send("Milestone not found");
    }
    await milestone.update(req.body);
    res.json(milestone);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Удаление вехи
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findByPk(id);
    if (!milestone) {
      return res.status(404).send("Milestone not found");
    }
    await milestone.destroy();
    res.status(204).end(); // Отправляем статус 204 No Content после успешного удаления
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
