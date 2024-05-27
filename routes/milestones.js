// routes/milestones.js
const express = require("express");
const Milestone = require("../models/Milestone");
const Building = require("../models/Building");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const milestone = await Milestone.findByPk(req.params.id);
    const building = await Building.findByPk(milestone.buildingId);

    const dir = `./uploads/${building.name}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.post(
  "/:id/attach-document",
  upload.single("document"),
  async (req, res) => {
    const { id } = req.params;
    const file = req.file;

    try {
      const milestone = await Milestone.findByPk(id);
      if (!milestone) {
        return res.status(404).send("Milestone not found");
      }

      // Удаление старого файла, если он существует
      if (milestone.documentUrl && fs.existsSync(milestone.documentUrl)) {
        fs.unlinkSync(milestone.documentUrl);
      }

      // Сохранение нового URL документа
      milestone.documentUrl = file.path;
      await milestone.save();

      res.send({ documentUrl: milestone.documentUrl });
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).send("Server error");
    }
  }
);

// Получение вех для здания
router.get("/:buildingId", async (req, res) => {
  try {
    const { buildingId } = req.params;
    const milestones = await Milestone.findAll({ where: { buildingId } });
    res.json(milestones);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Маршрут для обновления статуса актирования вехи
router.patch("/:id/certify", async (req, res) => {
  const { id } = req.params;
  const { isCertified } = req.body;

  try {
    const milestone = await Milestone.findByPk(id);
    if (!milestone) {
      return res.status(404).send("Веха не найдена");
    }

    milestone.isCertified = isCertified;
    await milestone.save();
    res.json({ message: "Статус актирования обновлен", milestone });
  } catch (error) {
    console.error("Ошибка при обновлении вехи:", error);
    res.status(500).send("Ошибка сервера: " + error.message);
  }
});

// // Маршрут для обновления только статуса вехи
// router.post("/:id/update-status", async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     const milestone = await Milestone.findByPk(id);
//     if (!milestone) {
//       return res.status(404).send("Веха не найдена");
//     }
//     milestone.status = status;

//     await milestone.save();
//     res.send("Статус вехи успешно обновлен");
//   } catch (error) {
//     console.error("Ошибка при обновлении статуса вехи:", error);
//     res.status(500).send("Ошибка сервера: " + error.message);
//   }
// });

router.post("/", async (req, res) => {
  try {
    const { buildingId, name, code, date, updatedDate, initialDate, status } =
      req.body;
    if (!buildingId) {
      return res.status(400).send("Building ID is required");
    }
    const milestone = await Milestone.create({
      buildingId,
      name,
      code,
      date,
      updatedDate,
      initialDate,
      status,
    });
    res.status(201).json(milestone);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    const milestone = await Milestone.findByPk(id);
    if (!milestone) {
      return res.status(404).send("Milestone not found");
    }

    await milestone.update(updateFields);
    res.json(milestone);
  } catch (error) {
    console.error("Error updating milestone:", error);
    res.status(400).send(error.message);
  }
});

// Удаление вехи
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const milestone = await Milestone.findByPk(id);
    if (!milestone) {
      return res.status(404).send("Milestone not found");
    }
    await milestone.destroy();
    res.status(204).end(); // Отправляем статус 204 No Content после успешного удаления
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
