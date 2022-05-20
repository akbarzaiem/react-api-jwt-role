import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const ViewCustomer = () => {
  let params = useParams();
  const [id, setId] = useState(params.id);
  const [nama_customer, setNamaCustomer] = useState('');
  const [email, setEmail] = useState('');
  const history = useNavigate();
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const axiosJwt = axios.create();

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decode = jwt_decode(response.data.accessToken);
      //   setName(decode.name);
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
      setExpired(decode.exp);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  }
  );

  useEffect(() => {
    refreshToken();
    cekId();
    // eslint-disable-next-line
  }, []);

  const cekId = async () => {
    const res = await axiosJwt.get('http://localhost:5000/customer/' + id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let Customer = res.data;
    setId(Customer.id);
    setNamaCustomer(Customer.nama_customer);
    setEmail(Customer.email);
  }

  function cancel() {
    history('/customers');
  }

  function getTitle() {
    return <h3 className="text-center">View Customer</h3>
  }

  return (
    <div>
      <br></br>
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            {getTitle()}
          </div>
          <div className="card-body">
            <form>
              <div className="form-group">
                <label>Nama Customer: {nama_customer}</label>
              </div>
              <div className="form-group">
                <label>Email : {email}</label>
              </div>
              <br></br>
              <button className="btn btn-danger" onClick={cancel}>Batal</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewCustomer
