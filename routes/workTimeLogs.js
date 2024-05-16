const express = require("express");
const WorkTimeLog = require("../models/WorkTimeLog"); // Предполагается, что модель уже модифицирована
const User = require("../models/User"); // Предполагается, что модель уже модифицирована

const router = express.Router();

// Добавление записи о рабочем времени
router.post("/", async (req, res) => {
  try {
    const workTimeLog = await WorkTimeLog.create(req.body);
    res.status(201).json(workTimeLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Получение всех записей
router.get("/", async (req, res) => {
  try {
    const workTimeLogs = await WorkTimeLog.findAll();
    res.json(workTimeLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получение всех записей
router.get("/get-building-logs/:buildingId", async (req, res) => {
  try {
    const { buildingId } = req.params;
    const whereClause = {
      buildingId: buildingId,
    };
    const workTimeLogs = await WorkTimeLog.findAll({
      where: whereClause,
    });
    res.json(workTimeLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/building/:buildingId", async (req, res) => {
  try {
    const { buildingId } = req.params;
    const userIds = req.query.users
      ? req.query.users.split(",").map((id) => parseInt(id))
      : [];

    const whereClause = {
      buildingId: buildingId,
    };
    if (userIds.length > 0) {
      whereClause.userId = userIds;
    }

    const workTimeLogs = await WorkTimeLog.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });
    res.json(workTimeLogs);
  } catch (error) {
    console.error("Ошибка при получении журналов времени:", error);
    res.status(500).json({ error: error.message });
  }
});

// Получение списка зданий для пользователя
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const workTimeLogs = await WorkTimeLog.findAll({
      where: { userId: userId },
    });
    res.json(workTimeLogs);
  } catch (error) {
    console.error("Ошибка при получении зданий для пользователя:", error);
    res.status(500).send("Внутренняя ошибка сервера");
  }
});

// Обновление записи
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const workTimeLog = await WorkTimeLog.findByPk(id);
    if (!workTimeLog) {
      return res.status(404).json({ error: "WorkTimeLog not found" });
    }
    await workTimeLog.update(req.body);
    res.json(workTimeLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Удаление записи
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const workTimeLog = await WorkTimeLog.findByPk(id);
    if (!workTimeLog) {
      return res.status(404).json({ error: "WorkTimeLog not found" });
    }
    await workTimeLog.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получение логов работы по пользователю и разделу
router.get("/logs", async (req, res) => {
  const { userId, sectionId, date } = req.query;
  let whereClause = { userId, sectionId };
  if (date) whereClause.date = date;

  try {
    const workTimeLogs = await WorkTimeLog.findAll({ where: whereClause });
    res.json(workTimeLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
