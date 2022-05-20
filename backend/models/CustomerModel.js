import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Customer = db.define('customer', {
    nama_customer: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },

}, {
    freezeTableName: true
});

export default Customer;