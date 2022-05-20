import { DataTypes,Sequelize } from "sequelize";
import db from "../config/Database.js";

const Produk=db.define('produk',{
    nama:{
        type: DataTypes.STRING
    },
    harga:{
        type: DataTypes.FLOAT
    }
},{
    freezeTableName:true
});

export default Produk;