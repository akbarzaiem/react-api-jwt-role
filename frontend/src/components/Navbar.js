import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import logo from '../logo_agit_bawah.png';

const Navbar = () => {
  const history = useNavigate();
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    getUser();
  }, []);

  const Logout = async () => {
    try {
      await axios.delete('http://localhost:5000/logout');
      history('/');
    } catch (error) {
      console.log(error);
    }
  };

  const gantiPassword = async () => {
    history(`/gantiPassword/` + id);
  };

  const getUser = async () => {
    const res = await axios.get('http://localhost:5000/token');
    const decode = jwt_decode(res.data.accessToken);
    setName(decode.name);
    setId(decode.userId);
    setRole(decode.role);
  };

  function editUser() {
    history(`/add-User/` + id);
  }

  function showRoles() {
    if (role === 'admin') {
      return (
        <a href='/roles' className='navbar-item'>
          Roles
        </a>
      );
    }
  }
  return (
    <nav
      className='navbar is-dark'
      role='navigation'
      aria-label='main navigation'
    >
      <div className='container'>
        <div className='navbar-brand'>
          <a className='navbar-item' href='/home'>
            <img src={logo} alt='logo' />
          </a>

          <a
            href='/home'
            role='button'
            className='navbar-burger burger'
            aria-label='menu'
            aria-expanded='false'
            data-target='navbarBasicExample'
          >
            <span aria-hidden='true'></span>
            <span aria-hidden='true'></span>
            <span aria-hidden='true'></span>
          </a>
        </div>

        <div id='navbarBasicExample' className='navbar-menu'>
          <div className='navbar-start'>
            <a href='/home' className='navbar-item'>
              Home
            </a>
            {showRoles()}
            <a href='/produk' className='navbar-item'>
              Produk
            </a>
            <a href='/customers' className='navbar-item'>
              Customer
            </a>
            <a href='/transactions' className='navbar-item'>
              Transaksi
            </a>
          </div>

          <div className='navbar-end'>
            <div className='navbar-item'>
              <a onClick={editUser} className='me-5 '>
                {name} as {role}
              </a>
              <button
                onClick={gantiPassword}
                className='button is-success me-2'
              >
                Ganti Password
              </button>
              <button onClick={Logout} className='button is-danger'>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
