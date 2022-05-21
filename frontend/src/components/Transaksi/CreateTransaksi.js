import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import swal from 'sweetalert';
import { Form } from 'react-bootstrap';

const CreateTransaksi = () => {
  let params = useParams();
  const date = new Date(), today = (date.getFullYear()) + '-' + (date.getMonth() + 1) + '-' + (date.getDate() + 1)
  const tanggal = new Date(today).toISOString().split('T')[0]
  const [id, setId] = useState(params.id);
  const [customers, setCustomers] = useState([]);
  const [produks, setProduks] = useState([]);
  const [tgl, setTgl] = useState(tanggal);
  const [namaCustomer, setNamaCustomer] = useState('');
  const [namaProduk, setNamaProduk] = useState('');
  const [hargaProduk, setHargaProduk] = useState('');
  const [qty, setQty] = useState(0);
  const [token, setToken] = useState('');
  const [expired, setExpired] = useState('');
  const history = useNavigate();
  const axiosJwt = axios.create();

  useEffect(() => {
    refreshToken();
    getTransactionById();
    getCustomers();
    getProduks();
    // eslint-disable-next-line
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decode = jwt_decode(response.data.accessToken);
      // setName(decode.name);
      // setUserId(decode.userId);
      // setRoleToken(decode.role);
      setExpired(decode.exp);
      // if (decode.role !== 'admin') {
      //   if (id != decode.userId) {
      //     history('/home');
      //   }
      // }
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
        // setRoleToken(decode.role);
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
    setNamaCustomer(response.data[0].nama_customer);
    setCustomers(response.data);
  };

  const getProduks = async () => {
    const response = await axiosJwt.get('http://localhost:5000/produk', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setProduks(response.data);
    setNamaProduk(response.data[0].nama);
  };

  const getTransactionById = async () => {
    if (id === '_add') {
      return;
    } else {
      const res = await axiosJwt.get('http://localhost:5000/transaksi/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let Transaction = res.data;
      setId(Transaction.id);
      setTgl(Transaction.tgl);
      setNamaCustomer(Transaction.nama_customer);
      setNamaProduk(Transaction.produk);
      setHargaProduk(Transaction.harga);
      setQty(Transaction.qty);
      console.log(Transaction);
    }
  };

  const saveOrUpdateTransaction = async e => {
    e.preventDefault();
    let Transaction = {
      tgl: tgl,
      nama_customer: namaCustomer,
      produk: namaProduk,
      harga: hargaProduk,
      qty: qty,
    };
    if (id === '_add') {
      await axios
        .post('http://localhost:5000/transaksi', Transaction, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          swal(res.data.msg);
          history('/transactions');
        });
    } else {
      await axios
        .put('http://localhost:5000/transaksi/' + id, Transaction, {
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

  const cekValueInputHarga = () => {
    produks.map(cekHargaProduk)
    // console.log(produks)
  }

  function cekHargaProduk(item) {
    if (namaProduk === item.nama) {
      setHargaProduk(item.harga)
    }
  }

  const cancel = () => {
    history('/transactions');
  };

  return (
    <div>
      <br></br>
      <div className='container'>
        <div className='row'>
          <div className='card col-md-6 offset-md-3 offset-md-3'>
            {/* {getTitle()} */}
          </div>
          <div className='card-body'>
            <form>
              <div className='form-group'>
                <label>Tgl</label>
                <input
                  placeholder='Tgl'
                  type='date'
                  name='tgl'
                  className='form-control'
                  value={tgl}
                  onChange={e => setTgl(e.target.value)}
                />
              </div>

              <div className='form-group'>
                <label>Nama Customer</label>
                <Form.Select
                  value={namaCustomer}
                  onChange={e => setNamaCustomer(e.target.value)}
                >
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.nama_customer}>
                      {customer.nama_customer}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className='form-group'>
                <label >Produk</label>
                <Form.Select
                  value={namaProduk}
                  onChange={e => setNamaProduk(e.target.value)}
                  onClick={() => cekValueInputHarga()}

                >
                  {produks.map(produk => (
                    <option key={produk.id} value={produk.nama}>
                      {produk.nama}

                    </option>

                  ))}
                </Form.Select>
              </div>






              <div className='form-group'>
                <label>Harga Produk</label>
                <input
                  type='text'
                  placeholder='Harga'
                  name='harga'
                  className='form-control'
                  value={hargaProduk}
                  onChange={e => setHargaProduk(e.target.value)}
                  disabled
                />
              </div>

              <div className='form-group'>
                <label>Qty</label>
                <input
                  type='number'
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
                onClick={saveOrUpdateTransaction}
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

export default CreateTransaksi;