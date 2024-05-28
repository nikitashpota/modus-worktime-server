const express = require("express");
const Building = require("../models/Building");
const Milestone = require("../models/Milestone");
const Section = require("../models/Section");
const WorkTimeLog = require("../models/WorkTimeLog");
const UserBuilding = require("../models/UserBuilding");
const UserSection = require("../models/UserSection");
const Subcontractor = require("../models/Subcontractor");
const User = require("../models/User");
const sequelize = require("../config/database");
const router = express.Router();
const { Op } = require("sequelize");

// Маршрут для создания ОКС
router.post("/", async (req, res) => {
  console.log(req.body);

  try {
    const { name, description, number } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const building = await Building.create({ name, description, number });
    res.status(201).json(building);
  } catch (error) {
    console.error("Ошибка при создании объекта:", error);
    res.status(400).json({ error: error.message });
  }
});

// Маршрут для получения всех ОКС
router.get("/", async (req, res) => {
  try {
    const buildings = await Building.findAll();
    res.json(buildings);
  } catch (error) {
    console.error("Ошибка при получении списка зданий:", error);
    res.status(500).json({ error: error.message });
  }
});

// Маршрут для обновления данных по ОКС
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId;
  const updates = req.body;

  try {
    const building = await Building.findByPk(id);
    if (building) {
      Object.keys(updates).forEach((key) => {
        if (key !== "userId") {
          building[key] = updates[key];
        }
      });
      await building.save();
      res.json({
        success: true,
        message: "Здание успешно обновлено",
        building: building,
      });
    } else {
      res.status(404).send({ success: false, message: "Здание не найдено" });
    }
  } catch (error) {
    console.error("Ошибка при обновлении здания:", error);
    res.status(500).send({ success: false, message: "Ошибка на сервере" });
  }
});

// Получение данных по buildingId включая пользователей, разделы, вехи и субподрядчиков
router.get("/:buildingId/complete-info", async (req, res) => {
  const { buildingId } = req.params;

  if (!buildingId) {
    return res.status(400).json({ error: "Building ID is required" });
  }

  try {
    const data = await sequelize.transaction(async (t) => {
      // Извлечение секций и назначенных на них пользователей
      const sections = await Section.findAll({
        where: { buildingId },
        include: [
          {
            model: User,
            through: {
              attributes: [], // Не возвращаем атрибуты из промежуточной таблицы
            },
            attributes: ["id", "salary", "department"], // Ограничиваем поля, которые возвращаются для пользователя
          },
        ],
        attributes: ["id", "sectionName"], // Возвращаем только ID и имя секции
        transaction: t,
      });

      // Извлечение вех, связанных с зданием
      const milestones = await Milestone.findAll({
        where: { buildingId },
        transaction: t,
      });

      // Извлечение субподрядчиков, связанных с зданием
      const subcontractors = await Subcontractor.findAll({
        where: { buildingId },
        transaction: t,
      });

      return { sections, milestones, subcontractors };
    });

    res.json({
      message: "Complete building information retrieved successfully.",
      data: data,
    });
  } catch (error) {
    console.error("Failed to fetch complete building information:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch complete building information" });
  }
});

// Маршрут для удаления ОКС и всех связанных данных
router.delete("/:buildingId", async (req, res) => {
  const { buildingId } = req.params;

  if (!buildingId) {
    return res.status(400).json({ error: "Building ID is required" });
  }

  try {
    await sequelize.transaction(async (t) => {
      // Удаление зависимых данных, порядок важен!
      await UserSection.destroy({
        where: {
          sectionId: {
            [Op.in]: sequelize.literal(
              `(SELECT id FROM Sections WHERE buildingId = ${buildingId})`
            ),
          },
        },
        transaction: t,
      });
      await UserBuilding.destroy({ where: { buildingId }, transaction: t });
      await WorkTimeLog.destroy({ where: { buildingId }, transaction: t });
      await Section.destroy({ where: { buildingId }, transaction: t });
      await Milestone.destroy({ where: { buildingId }, transaction: t });
      await Building.destroy({ where: { id: buildingId }, transaction: t });

      res.json({
        message: "Building and related records have been deleted successfully.",
      });
    });
  } catch (error) {
    console.error("Failed to delete building and related records:", error);
    res
      .status(500)
      .json({ error: "Failed to delete building and related records" });
  }
});

// Маршрут для получения данных о конкретном ОКС
router.get("/:buildingId", async (req, res) => {
  try {
    const { buildingId } = req.params;
    const building = await Building.findByPk(buildingId);

    if (!building) {
      return res.status(404).json({ message: "Здание не найдено" });
    }
    res.json(building);
  } catch (error) {
    console.error("Ошибка при получении данных о здании:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при получении данных о здании" });
  }
});

module.exports = router;
