import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Users=db.define('users',{
    name:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    refresh_token:{
        type :DataTypes.TEXT
    },
    role:{
        type :DataTypes.STRING
    },

},{
    freezeTableName:true
});

export default Users;