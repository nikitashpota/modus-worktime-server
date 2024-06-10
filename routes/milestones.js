// routes/milestones.js
const express = require("express");
const Milestone = require("../models/Milestone");
const Building = require("../models/Building");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const iconv = require("iconv-lite");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const decodedName = iconv.decode(
      Buffer.from(file.originalname, "binary"),
      "utf-8"
    );
    cb(null, Date.now() + path.extname(decodedName));
  },
});

const upload = multer({ storage });

router.post(
  "/:id/attach-documents",
  upload.array("documents", 10),
  async (req, res) => {
    const { id } = req.params;
    const files = req.files;
    let existingDocuments = JSON.parse(req.body.existingDocuments || "[]");

    try {
      const milestone = await Milestone.findByPk(id);
      if (!milestone) {
        return res.status(404).send("Milestone not found");
      }

      const newDocuments = files.map((file) => ({
        name: iconv.decode(Buffer.from(file.originalname, "binary"), "utf-8"),
        url: file.path.replace(/\\/g, "/"),
      }));

      const documentUrls = existingDocuments.concat(newDocuments);
      milestone.documentUrls = JSON.stringify(documentUrls);
      await milestone.save();

      res.send({ documentUrls: milestone.documentUrls });
    } catch (error) {
      console.error("Error updating documents:", error);
      res.status(500).send("Server error");
    }
  }
);

router.post("/:id/remove-document", async (req, res) => {
  const { id } = req.params;
  const { fileName } = req.body;

  try {
    const milestone = await Milestone.findByPk(id);
    if (!milestone) {
      return res.status(404).send("Milestone not found");
    }

    const documentUrls = JSON.parse(milestone.documentUrls || "[]");
    const filePathIndex = documentUrls.findIndex(
      (doc) => doc.name === fileName
    );

    if (filePathIndex > -1) {
      const filePath = documentUrls[filePathIndex].url;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      documentUrls.splice(filePathIndex, 1);
      milestone.documentUrls = JSON.stringify(documentUrls);
      await milestone.save();
    }

    res.send({ documentUrls: milestone.documentUrls });
  } catch (error) {
    console.error("Error removing document:", error);
    res.status(500).send("Server error");
  }
});
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
