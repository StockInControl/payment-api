"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        static associate({ Payment }) {
            this.hasMany(Payment, {
                foreignKey: "Customer_id",
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
                as: "customer",
            });
        }
    }
    Customer.init(
        {
            Customer_id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            Name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "customer",
            modelName: "Customer",
        }
    );
    return Customer;
};
