const User = require("./models/User");
const Building = require("./models/Building");
const UserBuilding = require("./models/UserBuilding");
const UserSection = require("./models/UserSection");
const ProjectSection = require("./models/ProjectSection");
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
  UserSection.belongsTo(ProjectSection, {
    foreignKey: "sectionId",
    as: "section",
  });

  User.hasMany(UserSection, { foreignKey: "userId", as: "userSections" });
  ProjectSection.hasMany(UserSection, {
    foreignKey: "sectionId",
    as: "sectionUsers",
  });

  User.belongsToMany(ProjectSection, {
    through: UserSection,
    foreignKey: "userId",
    otherKey: "sectionId",
  });
  ProjectSection.belongsToMany(User, {
    through: UserSection,
    foreignKey: "sectionId",
    otherKey: "userId",
  });

  ProjectSection.hasMany(WorkTimeLog, { foreignKey: "sectionId" });
  WorkTimeLog.belongsTo(ProjectSection, { foreignKey: "sectionId" });

  // Ассоциируем ProjectSection с Building для доступа из UserSection
  ProjectSection.belongsTo(Building, {
    foreignKey: "buildingId",
    as: "building",
  });

  Building.hasMany(Milestone, { foreignKey: "buildingId" });
  Milestone.belongsTo(Building, { foreignKey: "buildingId" });
};
