// const { Building, WorkTimeLog } = require('../models'); // Убедитесь, что путь правильный
const WorkTimeLog = require("../models/WorkTimeLog");
const Building = require("../models/Building");
const { Op } = require("sequelize");
const schedule = require("node-schedule");

const checkAndSetPendingStatus = async () => {
  try {
    const buildings = await Building.findAll();
    const now = new Date();
    const fourDaysAgo = new Date(now.setDate(now.getDate() - 7));

    for (const building of buildings) {
      const logs = await WorkTimeLog.findAll({
        where: {
          buildingId: building.id,
          date: {
            [Op.gte]: fourDaysAgo, // Проверяем, есть ли записи за последние 4 дня
          },
        },
      });

      if (logs.length === 0) {
        if (building.status === "active") {
          building.status = "pending";
          await building.save();
        }
      } else {
        if (building.status !== "completed") {
          building.status = "active";
          await building.save();
        }
      }
    }
  } catch (error) {
    console.error("Ошибка при проверке и обновлении статуса зданий:", error);
  }
};

// Запускать каждые 10 секунд
schedule.scheduleJob("* */30 * * * *", checkAndSetPendingStatus);
