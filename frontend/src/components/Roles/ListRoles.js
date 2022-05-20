import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import DataTable from 'react-data-table-component';

const ListRoles = () => {
    // const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [token, setToken] = useState('');
    const [expired, setExpired] = useState('');
    const [roles, setRoles] = useState([]);
    const history = useNavigate();
  
    const axiosJwt = axios.create();
  
    useEffect(() => {
      refreshToken();
      getRoles();
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
    }
  
    axiosJwt.interceptors.request.use(async (config) => {
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
    }, (error) => {
      return Promise.reject(error);
    }
    );
  
    const getRoles = async () => {
      const response = await axiosJwt.get('http://localhost:5000/Roles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRoles(response.data);
    }
  
    function addRoles() {
      history('/add-Roles/_add');
    }
  
    function editRoles(id) {
      history(`/add-Roles/${id}`);
    }
  
    function viewRoles(id) {
      history(`/view-Roles/${id}`);
    }
  
    const deleteRoles = async (id) => {
  
  
      var proceed = window.confirm('Apakah anda yakin hapus?');
      if (proceed) {
        const response = await axiosJwt.delete('http://localhost:5000/Roles/' + id, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        swal(response.data.msg);
        const NewRoles = roles.filter(Role => Role.id !== id);
        setRoles(NewRoles);
      } else {
        // swal('batal hapus');
      }
    }
  
    const columns = [
      {
        name: 'Id',
        width: '50px',
        cell: (row) => {
          return <div>{row.id}</div>;
        },
        shortable: true
      },
      {
        name: 'Role',
        selector: row => row.role,
        width: '200px',
        sortable: true
      },
      {
        name: 'Action',
        width: '400px',
        cell: (row) =>
          <div>
            <button onClick={() => editRoles(row.id)}
              className='button is-default'>Edit</button>
            <button style={{ marginleft: "10px" }}
              onClick={() => deleteRoles(row.id)}
              className='button is-danger'>Delete</button>
            <button style={{ marginleft: "10px" }}
              onClick={() => viewRoles(row.id)}
              className='button is-success'>View</button>
  
          </div>
        ,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ];
  
    const data = roles;
  
    // const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;
  
    function MyComponent() {
      if (role === 'admin') {
        return (
          <div>
            <h3>Data Role</h3>
            <button onClick={addRoles} className='button is-info'>Add Role</button>
            <DataTable
              columns={columns}
              data={data}
              pagination
            />
          </div>
        );
      }else{
        return(
          <div>
            <h3>Aplikasi React Js</h3>
          </div>
        )
      }
    };
  
    return (
      <div className='container mt-5'>
        <h1>Roles</h1>
        <hr></hr>
        {MyComponent()}
  
  
      </div>
    )
}

export default ListRoles
