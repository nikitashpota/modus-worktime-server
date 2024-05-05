const User = require("./models/User");
const Building = require("./models/Building");
const UserBuilding = require("./models/UserBuilding");
const UserSection = require("./models/UserSection");
const Section = require("./models/Section");
const WorkTimeLog = require("./models/WorkTimeLog");
const Milestone = require("./models/Milestone");

module.exports = function setupModelAssociations() {
  User.belongsToMany(Building, {
    through: UserBuilding,
    foreignKey: "userId",
    otherKey: "buildingId",
  });
  Building.belongsToMany(User, {
    through: UserBuilding,
    foreignKey: "buildingId",
    otherKey: "userId",
  });

  WorkTimeLog.belongsTo(User, { foreignKey: "userId" });
  User.hasMany(WorkTimeLog, { foreignKey: "userId" });

  UserBuilding.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  UserBuilding.belongsTo(Building, {
    foreignKey: "buildingId",
    as: "building",
  });

  Building.hasMany(UserBuilding, {
    foreignKey: "buildingId",
    as: "userBuildings",
  });
  User.hasMany(UserBuilding, { foreignKey: "userId", as: "userBuildings" });

  UserSection.belongsTo(User, { foreignKey: "userId", as: "user" });
  UserSection.belongsTo(Section, {
    foreignKey: "sectionId",
    as: "section",
  });

  User.belongsToMany(Building, {
    through: UserBuilding,
    as: "buildings",
    foreignKey: "userId",
    otherKey: "buildingId",
  });
  Building.belongsToMany(User, {
    through: UserBuilding,
    as: "users",
    foreignKey: "buildingId",
    otherKey: "userId",
  });

  User.hasMany(UserSection, { foreignKey: "userId", as: "userSections" });
  Section.hasMany(UserSection, {
    foreignKey: "sectionId",
    as: "sectionUsers",
  });

  User.belongsToMany(Section, {
    through: UserSection,
    foreignKey: "userId",
    otherKey: "sectionId",
  });
  Section.belongsToMany(User, {
    through: UserSection,
    foreignKey: "sectionId",
    otherKey: "userId",
  });

  Section.hasMany(WorkTimeLog, { foreignKey: "sectionId" });
  WorkTimeLog.belongsTo(Section, { foreignKey: "sectionId" });

  // Ассоциируем Section с Building для доступа из UserSection
  Section.belongsTo(Building, {
    foreignKey: "buildingId",
    as: "building",
  });

  Building.hasMany(Milestone, { foreignKey: "buildingId" });
  Milestone.belongsTo(Building, { foreignKey: "buildingId" });

  // Настройка связи в Section
  Section.hasMany(UserSection, {
    foreignKey: "sectionId",
    onDelete: "CASCADE", // Добавить каскадное удаление
  });

  // Настройка связи в UserSection
  UserSection.belongsTo(Section, {
    foreignKey: "sectionId",
    onDelete: "CASCADE", // Указать каскадное удаление
  });
};
