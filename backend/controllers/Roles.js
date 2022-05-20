import {Op} from 'sequelize';
import Roles from '../models/RolesModel.js';

export const getRoles = async (req, res) => {
    try {
        const dataRoles = await Roles.findAll({
            attributes: ['id', 'role']
        });
        res.json(dataRoles);
    } catch (error) {
        console.log(error);
    }
}

export const getRolesbyid = async (req, res) => {
    const id = req.params.id;
    try {
        const dataRoles = await Roles.findByPk(id);
        res.json(dataRoles);
    } catch (error) {
        console.log(error);
    }
}

export const getRolesbyname = async (req, res) => {
    const role = req.body.role;
    var condition = role ? { role: { [Op.like]: `%${role}%` } } : null;
    try {
        const dataRoles = await Roles.findAll({ where: condition });
        res.json(dataRoles);
    } catch (error) {
        console.log(error);
    }
}

export const AddRoles = async (req, res) => {
    const { role } = req.body;
    try {
        await Roles.create({
            role: role,
        });
        res.json({ msg: "Tambah Role Berhasil" });
    } catch (error) {
        console.log(error);
    }
}

export const UpdateRoles = async (req, res) => {
    const id = req.params.id;
    const { role} = req.body;
    const data = {
        role: role
    }
    try {
        await Roles.update(
            data, {
            where: {
                id: id
            }
        }
        );
        res.json({ msg: "Update Role Berhasil" });
    } catch (error) {
        console.log(error);
    }
}

export const DeleteRoles = async (req, res) => {
    const id = req.params.id;
    try {
        await Roles.destroy({
            where: {
                id: id
            }
        });
        res.json({ msg: "Berhasil Hapus Role" });
    } catch (error) {
        console.log(error);
    }
}

