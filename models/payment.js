"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        static associate({ Customer }) {
            this.belongsTo(Customer, {
                foreignKey: "Customer_id",
                as: "customer",
            });
        }
    }
    Payment.init(
        {
            Payment_id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            Transaction_id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            Amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            Status: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Gateway: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "payment",
            modelName: "Payment",
        }
    );
    return Payment;
};
