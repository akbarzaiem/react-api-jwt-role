import Transaksi from "../models/TransaksiModel.js";
import { Op } from 'sequelize';

export const getTransaksi = async (req, res) => {
    try {
        const dataTransaksi = await Transaksi.findAll({
            attributes: ['id', 'tgl', 'nama_customer', 'produk', 'harga', 'qty']
        });
        res.json(dataTransaksi);
    } catch (error) {
        console.log(error);
    }
}

export const getTransaksiById = async (req, res) => {
    const id = req.params.id;
    try {
        const dataTransaksi = await Transaksi.findByPk(id);
        res.json(dataTransaksi);
    } catch (error) {
        console.log(error);
    }
}

export const addTransaksi = async (req, res) => {
    const { tgl, nama_customer, produk, harga, qty } = req.body;
    try {
        await Transaksi.create({
            tgl: tgl,
            nama_customer: nama_customer,
            produk: produk,
            harga: harga,
            qty: qty
        });
        res.json({ msg: "Tambah Transaksi Berhasil" });
    } catch (error) {
        console.log(error);
    }
}

export const updateTransaksi = async (req, res) => {
    const id = req.params.id;
    const { tgl, nama_customer, produk, harga, qty } = req.body;
    const data = {
        tgl: tgl,
        nama_customer: nama_customer,
        produk: produk,
        harga: harga,
        qty: qty
    }
    try {
        await Transaksi.update(
            data, {
            where: {
                id: id
            }
        }
        );
        res.json({ msg: "Update Transaksi Berhasil" });
    } catch (error) {
        console.log(error);
    }
}

export const deleteTransaksi = async (req, res) => {
    const id = req.params.id;
    try {
        await Transaksi.destroy({
            where: {
                id: id
            }
        });
        res.json({ msg: "Berhasil Hapus Transaksi" });
    } catch (error) {
        console.log(error);
    }
}

