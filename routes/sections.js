// server/routes/sections.js
const express = require("express");
const router = express.Router();
const Section = require("../models/Section");
const UserSection = require("../models/UserSection");
const UserBuilding = require("../models/UserBuilding");
const User = require("../models/User");
const Building = require("../models/Building");

// Получение разделов по стадии и зданию
router.get("/by-stage-building", async (req, res) => {
  try {
    const { stage, buildingId } = req.query;
    const sections = await Section.findAll({
      where: { stage, buildingId },
    });
    res.json(sections);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

router.get("/", async (req, res) => {
  try {
    const sections = await Section.findAll();
    res.json(sections);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Получение разделов по ID пользователя
router.get("/by-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userSections = await UserSection.findAll({
      where: { userId },
      include: [
        {
          model: Section,
          as: "section",
          include: [
            {
              model: Building,
              as: "building",
            },
          ],
        },
      ],
    });
    res.json(userSections);
  } catch (error) {
    console.error("Ошибка при получении разделов по пользователю:", error);
    res.status(500).send("Внутренняя ошибка сервера");
  }
});

// Добавление нового раздела
router.post("/", async (req, res) => {
  try {
    const { sectionCode, sectionName, startDate, endDate, stage, buildingId } =
      req.body;
    const section = await Section.create({
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
    await Section.destroy({ where: { stage, buildingId } });
    for (let section of sections) {
      await Section.create({ ...section, stage, buildingId });
    }

    res.send("Шаблон успешно загружен и разделы обновлены");
  } catch (error) {
    res.status(500).send("Ошибка при загрузке шаблона: " + error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const section = await Section.findByPk(req.params.id);
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

// Получение пользователей, назначенных на раздел
router.get("/:sectionId/assigned-users", async (req, res) => {
  try {
    const { sectionId } = req.params;
    const assignedUsers = await UserSection.findAll({
      where: { sectionId },
      include: [{ model: User, as: "user" }],
    });
    res.json(assignedUsers.map((au) => au.user));
  } catch (error) {
    console.error("Ошибка при получении назначенных пользователей:", error);
    res
      .status(500)
      .send("Ошибка сервера при получении назначенных пользователей");
  }
});

// Назначение пользователя к разделу
router.post("/assign-user", async (req, res) => {
  const { userId, sectionId } = req.body;

  try {
    const existingAssignment = await UserSection.findOne({
      where: { userId, sectionId },
    });

    if (existingAssignment) {
      return res
        .status(400)
        .json({ message: "Пользователь уже назначен этому разделу" });
    }

    // Получение buildingId из Section
    const section = await Section.findByPk(sectionId);
    if (!section) {
      return res.status(404).json({ message: "Раздел не найден" });
    }
    const { buildingId } = section;

    // Назначение пользователя разделу
    const assignment = await UserSection.create({ userId, sectionId });

    // Проверка и создание связи с зданием, если нужно
    const existingBuildingAssignment = await UserBuilding.findOne({
      where: { userId, buildingId },
    });

    if (!existingBuildingAssignment) {
      await UserBuilding.create({ userId, buildingId });
    }

    res
      .status(201)
      .json({ message: "Пользователь успешно назначен разделу", assignment });
  } catch (error) {
    console.error("Ошибка при назначении пользователя разделу:", error);
    res.status(500).send("Ошибка сервера при назначении пользователя разделу");
  }
});

// Отмена назначения пользователя от раздела
router.post("/unassign-user", async (req, res) => {
  const { userId, sectionId } = req.body;

  try {
    const existingAssignment = await UserSection.findOne({
      where: { userId, sectionId },
    });

    if (!existingAssignment) {
      return res
        .status(404)
        .json({ message: "Назначение пользователя на раздел не найдено" });
    }

    await existingAssignment.destroy();
    res.json({ message: "Назначение пользователя на раздел удалено" });
  } catch (error) {
    console.error(
      "Ошибка при удалении назначения пользователя на раздел:",
      error
    );
    res.status(500).json({
      message: "Ошибка сервера при удалении назначения пользователя на раздел",
    });
  }
});

// Удаление раздела
router.delete("/:id", async (req, res) => {
  try {
    const result = await Section.destroy({
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
