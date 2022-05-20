import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import swal from 'sweetalert';

const ResetPassword = () => {
    let params = useParams();
    const [id, setId] = useState(params.id);
    const [password, setPassword] = useState('');
    const history = useNavigate();
    const [token, setToken] = useState('');
    const [expired, setExpired] = useState('');
    const axiosJwt = axios.create();

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decode = jwt_decode(response.data.accessToken);
            // setName(decode.name);
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
        // eslint-disable-next-line
    }, []);

    const updatePassword = async (e) => {
        e.preventDefault();
        let data = {
            password: password
        }
        await axios.put('http://localhost:5000/resetpassword/' + id, data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => {
                swal(res.data.msg);
                history('/home');
            });

    }

    function cancel() {
        history('/home');
    }
    return (
        <div className="container">
            <div className="row">
                <div className="card col-md-6 offset-md-3 offset-md-3">
                    <h1>Ganti Password User id {id}</h1>
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label>Password Baru</label>
                            <input placeholder="***" name="password" type='password' className="form-control"
                                value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <br></br>
                        <button className="btn btn-success" onClick={updatePassword} >Simpan</button>
                        <button className="btn btn-danger" onClick={cancel}>Batal</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
