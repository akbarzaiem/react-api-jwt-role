import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from 'sequelize';

export const getusers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email', 'role']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const getuserbyid = async (req, res) => {
    const id = req.params.id;
    try {
        const users = await Users.findByPk(id);
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const getuserbyname = async (req, res) => {
    const name = req.body.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    try {
        const users = await Users.findAll({ where: condition });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.json({ msg: "Register Berhasil" });
    } catch (error) {
        console.log(error);
    }
}

export const AddUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.json({ msg: "Tambah User Berhasil" });
    } catch (error) {
        console.log(error);
    }
}

export const UpdateUser = async (req, res) => {
    const id = req.params.id;
    const { name, email, role } = req.body;
    // const salt = await bcrypt.genSalt();
    // const hashPassword = await bcrypt.hash(password, salt);
    const data = {
        name: name,
        email: email,
        role: role
    }
    try {
        await Users.update(
            data, {
            where: {
                id: id
            }
        }
        );
        res.json({ msg: "Update Berhasil" });
    } catch (error) {
        console.log(error);
    }
}

export const UpdatePassword = async (req, res) => {
    const id = req.params.id;
    const { password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const data = {
        password: hashPassword
    }
    try {
        await Users.update(
            data, {
            where: {
                id: id
            }
        }
        );
        res.json({ msg: "Update Password Berhasil" });
    } catch (error) {
        console.log(error);
    }
}

export const DeleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        await Users.destroy({
            where: {
                id: id
            }
        });
        res.json({ msg: "Berhasil Hapus User" });
    } catch (error) {
        console.log(error);
    }
}

export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.status(400).json({ msg: "Wrong Password" });
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const role = user[0].role;
        const accessToken = jwt.sign({ userId, name, email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
        const refreshToken = jwt.sign({ userId, name, email, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });

    } catch (error) {
        res.status(404).json({ msg: "Email tidak diketemukan" });
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}