import express from "express";
import db from "./config/Database.js";
import router from "./routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import Transaksi from "./models/TransaksiModel.js";
// import Customer from "./models/CustomerModel.js";
// import Roles from './models/RolesModel.js';
// import Users from "./models/UserModel.js";
// import Produk from "./models/ProdukModel.js";

dotenv.config();
const app = express();

try {
    await db.authenticate();
    // console.log('Database Connected');
    // await Users.sync();
    // await Roles.sync()
    // await Produk.sync();
    // await Customer.sync();
    // await Transaksi.sync();
} catch (error) {
    console.log(error);
}

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5000, () => console.log("Server running at port 5000"));
