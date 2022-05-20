import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import swal from 'sweetalert';

const CreateTransaksi = () => {
  let params = useParams();
  const [id, setId] = useState(params.id);
  const [tgl, setTgl] = useState('');
  const [name, setName] = useState('');
  const [produk, setProduk] = useState('');
  const [harga, setHarga] = useState('');
  const [qty, setQty] = useState();
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const axiosJwt = axios.create();
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState('');
  const [roleToken, setRoleToken] = useState('');
  const history = useNavigate();

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
      // setName(decode.name);
      // setUserId(decode.userId);
      setRoleToken(decode.role);
      setExpired(decode.exp);
      if (decode.role !== 'admin') {
        if (id != decode.userId) {
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
        // setName(decode.name);
        // setUserId(decode.userId);
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
      const res = await axiosJwt.get('http://localhost:5000/transaksi/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let Transaksi = res.data;
      setId(Transaksi.id);
      setName(Transaksi.name);
      setTgl(Transaksi.tgl);
      setProduk(Transaksi.Produk);
      setHarga(Transaksi.harga);
      setQty(Transaksi.qty);
      setRole(Transaksi.role);
    }
  };

  const getRoles = async () => {
    const response = await axios.get('http://localhost:5000/roles');
    setRoles(response.data);
    setRole(response.data[0].role);
  };

  const saveOrUpdateTransaksi = async e => {
    e.preventDefault();

    if (id === '_add') {
      let Transaksi = {
        tgl: tgl,
        nama_customer: name,
        produk: produk,
        harga: harga,
        qty: qty,
        role: role,
      };
      await axios
        .post('http://localhost:5000/transaksi', Transaksi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          swal(res.data.msg);
          history('/transactions');
        });
    } else {
      let Transaksi2 = {
        tgl: tgl,
        nama_customer: name,
        produk: produk,
        harga: harga,
        qty: qty,
        role: role,
      };
      await axios
        .put('http://localhost:5000/users/' + id, Transaksi2, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          swal(res.data.msg);
          history('/transactions');
        });
    }
  };

  function cancel() {
    history('/transactions');
  }

  function getTitle() {
    if (id === '_add') {
      return <h3 className='text-center'>Add Transaksi</h3>;
    } else {
      return <h3 className='text-center'>Update Transaksi</h3>;
    }
  }

  function editRole() {
    if (roleToken === 'admin') {
      return (
        <div className='form-group'>
          <label>Select Roles</label>
          <div className='controls'>
            <select
              className='form-control'
              name='roles'
              id='roles'
              onChange={e => setRole(e.target.value)}
              value={role}
            >
              {roles.map(role => (
                <option key={role.id}>{role.role}</option>
              ))}
            </select>
          </div>
        </div>
      );
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
                <label>Tgl</label>
                <input
                  placeholder='Tgl'
                  name='tgl'
                  className='form-control'
                  value={tgl}
                  onChange={e => setTgl(e.target.value)}
                />
              </div>
              <div className='form-group'>
                <label>Names</label>
                <input
                  placeholder='Name'
                  name='name'
                  className='form-control'
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className='form-group'>
                <label>Produk</label>
                <input
                  placeholder='Produk'
                  name='produk'
                  className='form-control'
                  value={produk}
                  onChange={e => setProduk(e.target.value)}
                />
              </div>
              <div className='form-group'>
                <label>Harga</label>
                <input
                  placeholder='Harga'
                  name='harga'
                  className='form-control'
                  value={harga}
                  onChange={e => setHarga(e.target.value)}
                />
              </div>
              <div className='form-group'>
                <label>Qty</label>
                <input
                  placeholder='Qty'
                  name='qty'
                  className='form-control'
                  value={qty}
                  onChange={e => setQty(e.target.value)}
                />
              </div>
              {editRole()}

              <br></br>
              <button
                className='btn btn-success'
                onClick={saveOrUpdateTransaksi}
              >
                Simpan
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

export default CreateTransaksi;
