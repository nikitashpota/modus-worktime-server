const express = require("express");
const { Op } = require("sequelize");
const Task = require("../models/Task");
const User = require("../models/User");
const Section = require("../models/Section");
const Building = require("../models/Building");

const router = express.Router();

// 1. Получение всех задач
router.get("/all", async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: User,
          as: "receiver",
          attributes: ["id", "firstName", "lastName", "department"],
        },
        {
          model: User,
          as: "issuer",
          attributes: ["id", "firstName", "lastName", "department"],
        },
        {
          model: Section,
          as: "section",
          include: [
            {
              model: Building,
              as: "building",
              attributes: ["id", "name", "number"],
            },
          ],
        },
        {
          model: Building,
          as: "building",
          attributes: ["id", "name", "number"],
        },
      ],
    });
    res.json(tasks);
  } catch (error) {
    console.error("Ошибка при получении всех задач:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Получение задач по ID пользователя
router.get("/by-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.findAll({
      where: {
        [Op.or]: [{ receiverId: userId }, { issuerId: userId }],
      },
      include: [
        {
          model: User,
          as: "receiver",
          attributes: ["id", "firstName", "lastName", "department"],
        },
        {
          model: User,
          as: "issuer",
          attributes: ["id", "firstName", "lastName", "department"],
        },
        {
          model: Section,
          as: "section",
          include: [
            {
              model: Building,
              as: "building",
              attributes: ["id", "name", "number"],
            },
          ],
        },
        {
          model: Building,
          as: "building",
          attributes: ["id", "name", "number"],
        },
      ],
    });
    res.json(tasks);
  } catch (error) {
    console.error("Ошибка при получении задач:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Создание новой задачи
router.post("/", async (req, res) => {
  try {
    const taskData = req.body;
    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    console.error("Ошибка при создании задачи:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Удаление задачи по ID
router.delete("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const deleted = await Task.destroy({ where: { id: taskId } });
    if (deleted) {
      res.status(204).send(); // Успешное удаление
    } else {
      res.status(404).json({ message: "Задача не найдена" });
    }
  } catch (error) {
    console.error("Ошибка при удалении задачи:", error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Обновление задачи по ID (только автор может редактировать)
router.put("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body; // ID текущего пользователя, который пытается отредактировать задачу

    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: "Задача не найдена" });
    }

    // Проверка, что текущий пользователь является автором задачи (issuerId)
    if (task.issuerId !== userId) {
      return res.status(403).json({ message: "Вы не можете редактировать эту задачу, так как вы не являетесь ее автором" });
    }

    const [updated] = await Task.update(req.body, { where: { id: taskId } });
    if (updated) {
      const updatedTask = await Task.findOne({ where: { id: taskId } });
      res.status(200).json(updatedTask);
    } else {
      res.status(404).json({ message: "Задача не найдена" });
    }
  } catch (error) {
    console.error("Ошибка при обновлении задачи:", error);
    res.status(500).json({ error: error.message });
  }
});

// 6. Изменение статуса задачи с записью даты и пользователя
router.put("/update-status/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, userId } = req.body; // Получаем новый статус и ID пользователя

    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: "Задача не найдена" });
    }

    // Устанавливаем новый статус и дату изменения
    task.status = status;

    // Устанавливаем дату и ID пользователя в зависимости от статуса
    if (status === "Принято в работу") {
      task.acceptedAt = new Date();
      task.acceptedBy = userId;
    } else if (status === "Выполнено") {
      task.completedAt = new Date();
      task.completedBy = userId;
    } else if (status === "Закрыто") {
      task.closedAt = new Date();
      task.closedBy = userId;
    }

    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Ошибка при обновлении статуса задачи:", error);
    res.status(500).json({ error: error.message });
  }
});

// 7. Переадресация задачи
router.put("/reassign/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { newReceiverId } = req.body;

    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: "Задача не найдена" });
    }

    task.receiverId = newReceiverId;
    await task.save();

    res.json(task);
  } catch (error) {
    console.error("Ошибка при переадресации задачи:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
