import Customer from "../models/CustomerModel.js";
import { Op } from 'sequelize';

export const getCustomer = async (req, res) => {
    try {
        const dataCustomer = await Customer.findAll({
            attributes: ['id', 'nama_customer', 'email']
        });
        res.json(dataCustomer);
    } catch (error) {
        console.log(error);
    }
}

export const getCustomerById = async (req, res) => {
    const id = req.params.id;
    try {
        const dataCustomer = await Customer.findByPk(id);
        res.json(dataCustomer);
    } catch (error) {
        console.log(error);
    }
}

export const addCustomer = async (req, res) => {
    const { nama_customer, email } = req.body;
    try {
        await Customer.create({
            nama_customer: nama_customer,
            email: email
        });
        res.json({ msg: "Tambah Customer Berhasil" });
    } catch (error) {
        console.log(error);
    }
}

export const updateCustomer = async (req, res) => {
    const id = req.params.id;
    const { nama_customer, email } = req.body;
    const data = {
        nama_customer: nama_customer,
        email: email
    }
    try {
        await Customer.update(
            data, {
            where: {
                id: id
            }
        }
        );
        res.json({ msg: "Update Customer Berhasil" });
    } catch (error) {
        console.log(error);
    }
}

export const deleteCustomer = async (req, res) => {
    const id = req.params.id;
    try {
        await Customer.destroy({
            where: {
                id: id
            }
        });
        res.json({ msg: "Berhasil Hapus Customer" });
    } catch (error) {
        console.log(error);
    }
}

