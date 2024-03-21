const express = require("express");
const Building = require("../models/Building");
const UserBuilding = require("../models/UserBuilding");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
  console.log(req.body); // Добавьте это для логирования тела запроса

  try {
    const { name, description, number } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" }); // Убедитесь, что это условие не приводит к ошибке
    }

    const building = await Building.create({ name, description, number });
    res.status(201).json(building);
  } catch (error) {
    console.error("Ошибка при создании объекта:", error); // Убедитесь, что логируете ошибку
    res.status(400).json({ error: error.message });
  }
});

router.post("/assign-user", async (req, res) => {
  const { userId, buildingId } = req.body;

  try {
    // Проверяем, не назначен ли уже пользователь этому зданию
    const existingAssignment = await UserBuilding.findOne({
      where: { userId, buildingId },
    });

    if (existingAssignment) {
      return res
        .status(400)
        .json({ message: "Пользователь уже назначен этому зданию" });
    }

    // Создаем новую связь между пользователем и зданием
    const assignment = await UserBuilding.create({ userId, buildingId });
    res
      .status(201)
      .json({ message: "Пользователь успешно назначен зданию", assignment });
  } catch (error) {
    console.error("Ошибка при назначении пользователя зданию:", error);
    res.status(500).send("Ошибка сервера при назначении пользователя зданию");
  }
});

router.post("/unassign-user", async (req, res) => {
  const { userId, buildingId } = req.body;

  try {
    // Проверяем, существует ли назначение пользователя на это здание
    const existingAssignment = await UserBuilding.findOne({
      where: { userId, buildingId },
    });

    if (!existingAssignment) {
      return res
        .status(404)
        .json({ message: "Назначение пользователя на здание не найдено" });
    }

    // Удаляем связь между пользователем и зданием
    await existingAssignment.destroy();
    res.json({ message: "Назначение пользователя на здание удалено" });
  } catch (error) {
    console.error(
      "Ошибка при удалении назначения пользователя на здание:",
      error
    );
    res.status(500).json({
      message: "Ошибка сервера при удалении назначения пользователя на здание",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const buildings = await Building.findAll();
    res.json(buildings);
  } catch (error) {
    console.error("Ошибка при получении списка зданий:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:buildingId/assigned-users", async (req, res) => {
  const { buildingId } = req.params;

  try {
    const assignedUsers = await UserBuilding.findAll({
      where: { buildingId },
      include: [{ model: User, as: "user" }],
    });

    res.json(assignedUsers.map((assignment) => assignment.user));
  } catch (error) {
    console.error("Ошибка при получении назначенных пользователей:", error);
    res.status(500).json({
      message: "Ошибка сервера при получении списка назначенных пользователей",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Удаляем все связанные записи из UserBuildings
    await UserBuilding.destroy({
      where: { buildingId: id },
    });

    // Теперь, когда связанные записи удалены, можно безопасно удалить здание
    const building = await Building.findByPk(id);
    if (!building) {
      return res.status(404).json({ message: "Здание не найдено." });
    }

    await building.destroy();
    res.status(200).json({ message: "Здание удалено." });
  } catch (error) {
    console.error("Ошибка при удалении здания:", error);
    res.status(500).json({ message: "Ошибка при удалении здания." });
  }
});

// Маршрут для получения данных о конкретном здании
router.get("/:buildingId", async (req, res) => {
  try {
    const { buildingId } = req.params; // Получаем ID здания из параметров маршрута
    const building = await Building.findByPk(buildingId); // Ищем здание в базе данных по его первичному ключу

    if (!building) {
      // Если здание с таким ID не найдено, отправляем статус 404
      return res.status(404).json({ message: "Здание не найдено" });
    }

    // Если здание найдено, отправляем его данные клиенту
    res.json(building);
  } catch (error) {
    console.error("Ошибка при получении данных о здании:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при получении данных о здании" });
  }
});

module.exports = router;
