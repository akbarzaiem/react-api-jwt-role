import Produk from "../models/ProdukModel.js";
import {Op} from 'sequelize';

export const getProduk = async (req, res) => {
    try {
        const dataProduk = await Produk.findAll({
            attributes: ['id', 'nama', 'harga']
        });
        res.json(dataProduk);
    } catch (error) {
        console.log(error);
    }
}

export const getProdukbyid = async (req, res) => {
    const id = req.params.id;
    try {
        const dataProduk = await Produk.findByPk(id);
        res.json(dataProduk);
    } catch (error) {
        console.log(error);
    }
}

export const getProdukbyname = async (req, res) => {
    const nama = req.body.name;
    var condition = nama ? { nama: { [Op.like]: `%${nama}%` } } : null;
    try {
        const dataProduk = await Produk.findAll({ where: condition });
        res.json(dataProduk);
    } catch (error) {
        console.log(error);
    }
}

export const AddProduk = async (req, res) => {
    const { nama, harga } = req.body;
    try {
        await Produk.create({
            nama: nama,
            harga: harga
        });
        res.json({ msg: "Tambah Produk Berhasil" });
    } catch (error) {
        console.log(error);
    }
}

export const UpdateProduk = async (req, res) => {
    const id = req.params.id;
    const { nama, harga} = req.body;
    const data = {
        nama: nama,
        harga: harga
    }
    try {
        await Produk.update(
            data, {
            where: {
                id: id
            }
        }
        );
        res.json({ msg: "Update Produk Berhasil" });
    } catch (error) {
        console.log(error);
    }
}

export const DeleteProduk = async (req, res) => {
    const id = req.params.id;
    try {
        await Produk.destroy({
            where: {
                id: id
            }
        });
        res.json({ msg: "Berhasil Hapus Produk" });
    } catch (error) {
        console.log(error);
    }
}

