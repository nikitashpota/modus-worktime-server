const express = require("express");
const Building = require("../models/Building");
const UserBuilding = require("../models/UserBuilding");
const User = require("../models/User");
const router = express.Router();

// Получение списка зданий для пользователя
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("userBuildings", userId);
  try {
    const userBuildings = await UserBuilding.findAll({
      where: { userId },
      include: [{ model: Building, as: "building" }],
    });

    const buildings = userBuildings.map((ub) => ub.building.dataValues);

    res.json(buildings);
  } catch (error) {
    console.error("Ошибка при получении зданий для пользователя:", error);
    res.status(500).send("Внутренняя ошибка сервера");
  }
});

module.exports = router;
