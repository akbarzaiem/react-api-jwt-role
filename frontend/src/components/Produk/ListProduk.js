import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import DataTable from 'react-data-table-component';

const ListProduk = () => {
  // const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const [produk, setProduk] = useState([]);
  const history = useNavigate();

  const axiosJwt = axios.create();

  useEffect(() => {
    refreshToken();
    getProduks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decode = jwt_decode(response.data.accessToken);
      // setName(decode.name);
      setRole(decode.role);
      setExpired(decode.exp);
    } catch (error) {
      if (error.response) {
        history('/');
      }
    }
  };

  axiosJwt.interceptors.request.use(
    async config => {
      const currentDate = new Date();
      if (expired * 1000 < currentDate.getTime()) {
        const response = await axios.get('http://localhost:5000/token');
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decode = jwt_decode(response.data.accessToken);
        // setName(decode.name);
        setRole(decode.role);
        setExpired(decode.exp);
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  const getProduks = async () => {
    const response = await axiosJwt.get('http://localhost:5000/produk', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setProduk(response.data);
  };

  function addProduk() {
    history('/add-Produk/_add');
  }

  function editProduk(id) {
    history(`/add-Produk/${id}`);
  }

  function viewProduk(id) {
    history(`/view-Produk/${id}`);
  }

  const deleteProduk = async id => {
    var proceed = window.confirm('Apakah anda yakin hapus?');
    if (proceed) {
      const response = await axiosJwt.delete(
        'http://localhost:5000/Produk/' + id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      swal(response.data.msg);
      const NewProduks = produk.filter(Produk => Produk.id !== id);
      setProduk(NewProduks);
    } else {
      // swal('batal hapus');
    }
  };

  const numberWithComas = harga => {
    return harga.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const columns = [
    {
      name: 'No',
      width: '50px',
      id: 'row',
      cell: (row, index) => {
        return <div>{index + 1}</div>;
      },
      shortable: true,
    },
    {
      name: 'Name',
      selector: row => row.nama,
      width: '200px',
      sortable: true,
    },
    {
      name: 'Harga',
      selector: row => numberWithComas(row.harga),
      width: '200px',
      sortable: true,
    },
    {
      name: 'Action',
      width: '400px',
      cell: row => (
        <div>
          <button
            onClick={() => editProduk(row.id)}
            className='button is-default'
          >
            Edit
          </button>
          <button
            style={{ marginleft: '10px' }}
            onClick={() => deleteProduk(row.id)}
            className='button is-danger'
          >
            Delete
          </button>
          <button
            style={{ marginleft: '10px' }}
            onClick={() => viewProduk(row.id)}
            className='button is-success'
          >
            View
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const data = produk;

  // const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

  function MyComponent() {
    return (
      <div>
        <h3>Data Produk</h3>
        <button onClick={addProduk} className='button is-info'>
          Add Produk
        </button>
        <DataTable columns={columns} data={data} pagination />
      </div>
    );
  }

  return (
    <div className='container mt-5'>
      <h1>Produk</h1>
      <hr></hr>
      {MyComponent()}
    </div>
  );
};

export default ListProduk;
