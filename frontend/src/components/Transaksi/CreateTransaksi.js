import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import swal from 'sweetalert';
import { Form } from 'react-bootstrap'


const CreateTransaksi = () => {
  let params = useParams();
  const [id, setId] = useState(params.id);
  const [tgl, setTgl] = useState('');
  const [name, setName] = useState('');
  const [produk, setProduk] = useState('');
  const [produks, setProduks] = useState([]);
  const [harga, setHarga] = useState('');

  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState('');




  const [qty, setQty] = useState();
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const axiosJwt = axios.create();
  const [roleToken, setRoleToken] = useState('');
  const history = useNavigate();

  useEffect(() => {
    refreshToken();
    cekId();
    GetCustomer()
    GetProduk()
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
    }
  };

  const base_url = "http://localhost:5000/customers"
  const GetCustomer = async () => {
    const response = await axiosJwt.get(base_url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let Customer = response.data;
    setCustomers(Customer);
    console.log(Customer)

  }

  const base_url2 = "http://localhost:5000/produk"
  const GetProduk = async () => {
    const response = await axiosJwt.get(base_url2, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let Produk = response.data;
    setProduks(Produk);
    console.log(Produk)

  }


  const saveOrUpdateTransaksi = async e => {
    e.preventDefault();

    if (id === '_add') {
      let Transaksi = {
        tgl: tgl,
        nama_customer: name,
        produk: produk,
        harga: harga,
        qty: qty,
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
                  type="date"
                  placeholder='Tgl'
                  name='tgl'
                  className='form-control'
                  value={tgl}
                  onChange={e => setTgl(e.target.value)}
                />
              </div>

              <div className="field mt-5">
                <label className="label">Nama Customer</label>
                <div className="control">
                  <div className="select">
                    <select value={customer} onChange={(e) => setCustomer(e.target.value)}>
                      <option value='0' disabled>Pilih customer</option>
                      {
                        customers.map((a) => (
                          <option key={a.id} value={a.nama_customer}>{a.nama_customer}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              </div>

              <div className='form-group'>
                <Form.Select
                  defaultValue={produk}
                  value={produk}
                  onChange={e => setProduk(e.target.value)}
                >
                  {produks.map(produk => (
                    <option key={produk.id} value={produk.nama}>
                      {produk.nama}  {produk.harga}
                    </option>
                  ))}
                </Form.Select>
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
