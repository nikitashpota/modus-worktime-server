// server/routes/sections.js
const express = require("express");
const router = express.Router();
const ProjectSection = require("../models/ProjectSection");

// Получение разделов по стадии и зданию
router.get("/", async (req, res) => {
  try {
    const { stage, buildingId } = req.query;
    const sections = await ProjectSection.findAll({
      where: { stage, buildingId },
    });
    res.json(sections);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Добавление нового раздела
router.post("/", async (req, res) => {
  try {
    const { sectionCode, sectionName, startDate, endDate, stage, buildingId } =
      req.body;
    const section = await ProjectSection.create({
      sectionCode,
      sectionName,
      startDate,
      endDate,
      stage,
      buildingId,
    });
    res.json(section);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.post("/loadTemplate", async (req, res) => {
  const { stage, buildingId, sections } = req.body;
  try {
    // Удалить существующие разделы для данного здания и стадии
    await ProjectSection.destroy({ where: { stage, buildingId } });

    // Добавить новые разделы из шаблона
    for (let section of sections) {
      await ProjectSection.create({ ...section, stage, buildingId });
    }

    res.send("Шаблон успешно загружен и разделы обновлены");
  } catch (error) {
    res.status(500).send("Ошибка при загрузке шаблона: " + error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const section = await ProjectSection.findByPk(req.params.id);
    if (!section) {
      return res.status(404).send("Раздел не найден");
    }
    Object.assign(section, req.body);
    await section.save();
    res.json(section);
  } catch (error) {
    console.error("Ошибка сервера:", error);
    res.status(500).send("Ошибка сервера");
  }
});

// Удаление раздела
router.delete("/:id", async (req, res) => {
  try {
    const result = await ProjectSection.destroy({
      where: { id: req.params.id },
    });
    if (result) {
      res.send("Раздел удален");
    } else {
      res.status(404).send("Раздел не найден");
    }
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

module.exports = router;
