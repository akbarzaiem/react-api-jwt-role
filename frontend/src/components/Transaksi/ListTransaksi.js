import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import DataTable from "react-data-table-component";

const ListTransaksi = () => {
  // const [name, setName] = useState('');
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");
  const [expired, setExpired] = useState("");
  const [transaksi, setTransaksi] = useState([]);
  const history = useNavigate();

  const axiosJwt = axios.create();

  useEffect(() => {
    refreshToken();
    getTranasaksis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");
      setToken(response.data.accessToken);
      const decode = jwt_decode(response.data.accessToken);
      // setName(decode.name);
      setRole(decode.role);
      setExpired(decode.exp);
    } catch (error) {
      if (error.response) {
        history("/");
      }
    }
  };

  axiosJwt.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expired * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decode = jwt_decode(response.data.accessToken);
        // setName(decode.name);
        setRole(decode.role);
        setExpired(decode.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getTransaksis = async () => {
    const response = await axiosJwt.get("http://localhost:5000/transaksis", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTranasaksis(response.data);
  };

  function addTransaksi() {
    history("/add-Transaksi/_add");
  }

  function editCustomer(id) {
    history(`/add-Customer/${id}`);
  }

  function viewCustomer(id) {
    history(`/view-Customer/${id}`);
  }

  const deleteTransaksi = async (id) => {
    var proceed = window.confirm("Apakah anda yakin hapus?");
    if (proceed) {
      const response = await axiosJwt.delete("http://localhost:5000/transaksi/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      swal(response.data.msg);
      const NewTransaksis = transaksis.filter((Transaksi) => Transaksi.id !== id);
      setTransaksis(NewTransaksis);
    } else {
      // swal('batal hapus');
    }
  };

  const columns = [
    {
      name: "Id",
      width: "50px",
      cell: (row) => {
        return <div>{row.id}</div>;
      },
      shortable: true,
    },
    {
      name: "Tgl",
      selector: (row) => row.tgl,
      width: "200px",
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.nama_customer,
      width: "200px",
      sortable: true,
    },
    {
      name: "Produk",
      selector: (row) => row.produk,
      width: "200px",
      sortable: true,
    },
    {
      name: "Harga",
      selector: (row) => row.harga,
      width: "200px",
      sortable: true,
    },
    {
      name: "Qty",
      selector: (row) => row.qty,
      width: "200px",
      sortable: true,
    },
    {
      name: "Action",
      width: "400px",
      cell: (row) => (
        <div>
          <button onClick={() => editTransaksi(row.id)} className="button is-default mr-2">
            Edit
          </button>
          <button onClick={() => deleteTransaksi(row.id)} className="button is-danger mr-2">
            Delete
          </button>
          <button onClick={() => viewTransaksi(row.id)} className="button is-success mr-2">
            View
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const data = transaksis;

  // const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

  function MyComponent() {
    return (
      <div>
        <h3>Data Transaksi</h3>
        <button onClick={addTransaksi} className="button is-info">
          Add Transaksi
        </button>
        <DataTable columns={columns} data={data} pagination />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1>Transaksi</h1>
      <hr></hr>
      {MyComponent()}
    </div>
  );
};

export default ListTransaksi;
