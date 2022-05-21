import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import swal from 'sweetalert';

const CreateCustomer = () => {
  let params = useParams();
  const [id, setId] = useState(params.id);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState('');
  const [roleToken, setRoleToken] = useState('');
  const history = useNavigate();
  const axiosJwt = axios.create();

  useEffect(() => {
    refreshToken();
    getRoles();
    cekId();
    // eslint-disable-next-line
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decode = jwt_decode(response.data.accessToken);

      setRoleToken(decode.role);
      setExpired(decode.exp);
      if (decode.role !== 'admin') {
        if (id != decode.customerId) {
          history('/home');
        }
      }
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
        setRoleToken(decode.role);
        setExpired(decode.exp);
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  const cekId = async () => {
    if (id === '_add') {
      return;
    } else {
      const res = await axiosJwt.get('http://localhost:5000/customer/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let Customer = res.data;
      console.log(Customer);
      setId(Customer.id);
      setName(Customer.nama_customer);
      setEmail(Customer.email);
      setRole(Customer.role);
    }
  };

  const getRoles = async () => {
    const response = await axios.get('http://localhost:5000/customers');
    setRoles(response.data);
    setRole(response.data[0].role);
  };

  const saveOrUpdateCustomer = async e => {
    e.preventDefault();

    if (id === '_add') {
      let Customer = {
        nama_customer: name,
        email: email,
      };
      await axios
        .post('http://localhost:5000/customer', Customer, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          swal(res.data.msg);
          history('/customers');
        });
    } else {
      let Customer2 = {
        nama_customer: name,
        email: email,
      };
      await axios
        .put('http://localhost:5000/customers/' + id, Customer2, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          swal(res.data.msg);
          history('/customers');
        });
    }
  };

  function cancel() {
    history('/customers');
  }

  function getTitle() {
    if (id === '_add') {
      return <h3 className='text-center'>Add Customer</h3>;
    } else {
      return <h3 className='text-center'>Update Customer</h3>;
    }
  }

  return (
    <div>
      <br></br>
      <div className='container'>
        <div className='row'>
          <div className='card col-md-6 offset-md-3 offset-md-3'>
            {getTitle()}
          </div>
          <div className='card-body'>
            <form>
              <div className='form-group'>
                <label>Names</label>
                <input
                  placeholder='Name'
                  type='text'
                  name='name'
                  className='form-control'
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className='form-group'>
                <label>Email</label>
                <input
                  type='text'
                  placeholder='Email'
                  name='email'
                  className='form-control'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <br></br>
              <button
                className='btn btn-success'
                onClick={saveOrUpdateCustomer}
              >
                Save
              </button>
              <button className='btn btn-danger' onClick={cancel}>
                Batal
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomer;
