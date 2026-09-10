const { DataTypes, Sequelize } = require('sequelize')

module.exports = {
  up: async ({context: queryInterface}) => {
    await queryInterface.addColumn('blogs', 'created_at', {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW')
    });
    await queryInterface.addColumn('blogs', 'updated_at', {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW')
    });
  },

  down: async ({context: queryInterface}) => {
    await queryInterface.removeColumn('blogs', 'created_at');
    await queryInterface.removeColumn('blogs', 'updated_at');
  }
};