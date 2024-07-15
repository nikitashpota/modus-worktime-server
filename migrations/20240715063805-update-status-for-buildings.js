'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Обновить уже существующие записи, установить status в 'active'
    await queryInterface.sequelize.query(`
      UPDATE \`Buildings\`
      SET \`status\` = 'active'
      WHERE \`status\` IS NULL OR \`status\` = '';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Откатить изменения, если это необходимо
    // Например, можно сбросить значение статуса в NULL или оставить пустым
    await queryInterface.sequelize.query(`
      UPDATE \`Buildings\`
      SET \`status\` = ''
      WHERE \`status\` = 'active';
    `);
  }
};
