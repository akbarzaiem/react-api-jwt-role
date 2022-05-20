import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Roles=db.define('roles',{
    role:{
        type: DataTypes.STRING
    }

},{
    freezeTableName:true
});

export default Roles;