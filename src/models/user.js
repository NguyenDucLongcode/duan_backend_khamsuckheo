"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.AllCode, {
        foreignKey: "positionId",
        targetKey: "key",
        as: "positionData",
      });

      User.belongsTo(models.AllCode, {
        foreignKey: "roleId",
        targetKey: "key",
        as: "roleData",
      });

      User.belongsTo(models.Markdown, {
        foreignKey: "id",
        targetKey: "doctorId",
        as: "MarkdownData",
      });
      User.belongsTo(models.Doctor_infor, {
        foreignKey: "id",
        targetKey: "doctorId",
        as: "infoSpecialistData",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      gender: DataTypes.STRING,
      image: DataTypes.STRING,
      roleId: DataTypes.STRING,
      positionId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
