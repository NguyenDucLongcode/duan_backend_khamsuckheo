module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users", "image", {
      type: Sequelize.BLOB,
      allowNull: true, // Thay đổi nếu cần
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users", "image", {
      type: Sequelize.STRING,
      allowNull: true, // Thay đổi nếu cần
    });
  },
};
