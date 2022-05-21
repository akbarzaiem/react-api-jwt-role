import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import DataTable from 'react-data-table-component';

const ListCustomer = () => {
  const [role, setRole] = useState('');
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const [customers, setCustomers] = useState([]);
  const history = useNavigate();

  const axiosJwt = axios.create();

  useEffect(() => {
    refreshToken();
    getCustomers();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decode = jwt_decode(response.data.accessToken);
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

  const getCustomers = async () => {
    const response = await axiosJwt.get('http://localhost:5000/customers', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCustomers(response.data);
  };

  function addCustomer() {
    history('/add-customer/_add');
  }

  function editCustomer(id) {
    history(`/add-customer/${id}`);
  }

  function viewCustomer(id) {
    history(`/view-customer/${id}`);
  }

  const deleteCustomer = async id => {
    var proceed = window.confirm('Apakah anda yakin hapus?');
    if (proceed) {
      const response = await axiosJwt.delete(
        'http://localhost:5000/customer/' + id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      swal(response.data.msg);
      const NewCustomers = customers.filter(Customer => Customer.id !== id);
      setCustomers(NewCustomers);
    } else {
      // swal('batal hapus');
    }
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
      selector: row => row.nama_customer,
      width: '200px',
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      width: '200px',
      sortable: true,
    },
    {
      name: 'Action',
      width: '400px',
      cell: row => (
        <div>
          <button
            onClick={() => editCustomer(row.id)}
            className='button is-default mr-2'
          >
            Edit
          </button>
          <button
            onClick={() => deleteCustomer(row.id)}
            className='button is-danger mr-2'
          >
            Delete
          </button>
          <button
            onClick={() => viewCustomer(row.id)}
            className='button is-success mr-2'
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

  const data = customers;

  // const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

  function MyComponent() {
    return (
      <div>
        <h3>Data Customer</h3>
        <button onClick={addCustomer} className='button is-info'>
          Add Customer
        </button>
        <DataTable columns={columns} data={data} pagination />
      </div>
    );
  }

  return (
    <div className='container mt-5'>
      <h1>Customer</h1>
      <hr></hr>
      {MyComponent()}
    </div>
  );
};

export default ListCustomer;
