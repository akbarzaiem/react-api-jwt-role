import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import DataTable from 'react-data-table-component';

const Home = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const [users, setUsers] = useState([]);
  const history = useNavigate();

  const axiosJwt = axios.create();

  useEffect(() => {
    refreshToken();
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decode = jwt_decode(response.data.accessToken);
      setName(decode.name);
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
      setName(decode.name);
      setRole(decode.role);
      setExpired(decode.exp);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  }
  );

  const getUsers = async () => {
    const response = await axiosJwt.get('http://localhost:5000/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setUsers(response.data);
  }

  function addUser() {
    history('/add-User/_add');
  }

  function editUser(id) {
    history(`/add-User/${id}`);
  }

  function viewUser(id) {
    history(`/view-User/${id}`);
  }

  const deleteUser = async (id) => {


    var proceed = window.confirm('Apakah anda yakin hapus?');
    if (proceed) {
      const response = await axiosJwt.delete('http://localhost:5000/users/' + id, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      swal(response.data.msg);
      const NewUsers = users.filter(user => user.id !== id);
      setUsers(NewUsers);
    } else {
      // swal('batal hapus');
    }
  }

  function gantiPassword(id) {
    history(`/gantiPassword/${id}`);
  }


  const columns = [
    {
      name: 'No',
      width: '50px',
      id:'row',
      cell: (row,index) => {
        return <div>{index+1}</div>;
      },
      shortable: false
    },
    {
      name: 'Name',
      selector: row => row.name,
      width: '200px',
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email,
      width: '200px',
      sortable: true
    },
    {
      name: 'Role',
      selector: row => row.role,
      width: '100px',
      sortable: true
    },
    {
      name: 'Action',
      width: '400px',
      cell: (row) =>
        <div>
          <button onClick={() => editUser(row.id)}
            className='button is-default'>Edit</button>
          <button style={{ marginleft: "10px" }}
            onClick={() => deleteUser(row.id)}
            className='button is-danger'>Delete</button>
          <button style={{ marginleft: "10px" }}
            onClick={() => viewUser(row.id)}
            className='button is-success'>View</button>
          <button style={{ marginleft: "10px" }}
            onClick={() => gantiPassword(row.id)}
            className='button is-warning'>Ganti Password</button>

        </div>
      ,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const data = users;

  // const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

  function MyComponent() {
    if (role === 'admin') {
      return (
        <div>
          <h3>Data User</h3>
          <button onClick={addUser} className='button is-info'>Add User</button>
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
      <h1>Selamat datang {name} di Bootcamp</h1>
      <h3>Anda login sebagai {role}</h3>
      <hr></hr>
      {MyComponent()}

      {/* <table className='table is-striped is-fullwidth'>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => editUser(user.id)}
                  className='button is-default'>Edit</button>
                <button style={{ marginleft: "10px" }}
                  onClick={() => deleteUser(user.id)}
                  className='button is-danger'>Delete</button>
                <button style={{ marginleft: "10px" }}
                  onClick={() => viewUser(user.id)}
                  className='button is-success'>View</button>
                <button style={{ marginleft: "10px" }}
                  onClick={() => gantiPassword(user.id)}
                  className='button is-warning'>Ganti Password</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  )
}

export default Home
