"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor_infor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor_infor.belongsTo(models.AllCode, {
        foreignKey: "priceId",
        targetKey: "key",
        as: "pricedData",
      });
      Doctor_infor.belongsTo(models.AllCode, {
        foreignKey: "provinceId",
        targetKey: "key",
        as: "provinceData",
      });
      Doctor_infor.belongsTo(models.AllCode, {
        foreignKey: "paymentId",
        targetKey: "key",
        as: "paymentData",
      });
      Doctor_infor.belongsTo(models.Specialist, {
        foreignKey: "specialistId",
        targetKey: "id",
        as: "specialistData",
      });
    }
  }
  Doctor_infor.init(
    {
      doctorId: DataTypes.INTEGER,
      specialistId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      priceId: DataTypes.STRING,
      provinceId: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      addressClinic: DataTypes.STRING,
      nameClinic: DataTypes.STRING,
      note: DataTypes.STRING,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Doctor_infor",
    }
  );
  return Doctor_infor;
};
