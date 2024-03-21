const express = require("express");
const WorkTimeLog = require("../models/WorkTimeLog"); // Предполагается, что модель уже модифицирована

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

router.get("/logs", async (req, res) => {
  try {
    // Извлекаем параметры из строки запроса
    const { userId, buildingId, date } = req.query;

    // Создаем объект, в котором будем хранить условия для поиска
    let whereClause = {};

    if (userId) {
      whereClause.userId = userId;
    }

    if (buildingId) {
      whereClause.buildingId = buildingId;
    }

    if (date) {
      whereClause.date = date;
    }

    const workTimeLogs = await WorkTimeLog.findAll({
      where: whereClause,
    });

    res.json(workTimeLogs);
  } catch (error) {
    console.error("Ошибка при получении логов работы:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
