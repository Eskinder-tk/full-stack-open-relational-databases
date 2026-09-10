const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({context: queryInterface}) => {
    await queryInterface.addColumn('blogs', 'year', {
      allowNull: false,
      type: DataTypes.INTEGER,
    });
  },

  down: async ({context: queryInterface}) => {
    await queryInterface.removeColumn('blogs', 'year');
  }
};