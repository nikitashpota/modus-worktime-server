const express = require("express");
const Building = require("../models/Building");
const Milestone = require("../models/Milestone");
const Section = require("../models/Section");
const WorkTimeLog = require("../models/WorkTimeLog");
const UserBuilding = require("../models/UserBuilding");
const UserSection = require("../models/UserSection");
const User = require("../models/User");
const sequelize = require("../config/database");
const router = express.Router();
const { Op } = require("sequelize");

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

// router.post("/assign-user", async (req, res) => {
//   const { userId, buildingId } = req.body;

//   try {
//     const existingAssignment = await UserBuilding.findOne({
//       where: { userId, buildingId },
//     });

//     if (existingAssignment) {
//       return res
//         .status(400)
//         .json({ message: "Пользователь уже назначен этому зданию" });
//     }

//     // Создаем новую связь между пользователем и зданием
//     const assignment = await UserBuilding.create({ userId, buildingId });
//     res
//       .status(201)
//       .json({ message: "Пользователь успешно назначен зданию", assignment });
//   } catch (error) {
//     console.error("Ошибка при назначении пользователя зданию:", error);
//     res.status(500).send("Ошибка сервера при назначении пользователя зданию");
//   }
// });

// router.post("/unassign-user", async (req, res) => {
//   const { userId, buildingId } = req.body;

//   try {
//     // Проверяем, существует ли назначение пользователя на это здание
//     const existingAssignment = await UserBuilding.findOne({
//       where: { userId, buildingId },
//     });

//     if (!existingAssignment) {
//       return res
//         .status(404)
//         .json({ message: "Назначение пользователя на здание не найдено" });
//     }

//     // Удаляем связь между пользователем и зданием
//     await existingAssignment.destroy();
//     res.json({ message: "Назначение пользователя на здание удалено" });
//   } catch (error) {
//     console.error(
//       "Ошибка при удалении назначения пользователя на здание:",
//       error
//     );
//     res.status(500).json({
//       message: "Ошибка сервера при удалении назначения пользователя на здание",
//     });
//   }
// });

router.get("/", async (req, res) => {
  try {
    const buildings = await Building.findAll();
    res.json(buildings);
  } catch (error) {
    console.error("Ошибка при получении списка зданий:", error);
    res.status(500).json({ error: error.message });
  }
});

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
          if (!["number", "name", "description"].includes(key)) {
            building[`${key}LastModifiedBy`] = userId;
          }
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

// Маршрут для удаления здания и всех связанных данных
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

      // Удаление самого здания
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

// Маршрут для получения данных о конкретном здании
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
