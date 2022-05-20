import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [msg, setMsg] = useState('');
    const history = useNavigate();
    const [roles, setRoles] = useState([]);
    const [role, setRole] = useState('');

    useEffect(() => {
        getRoles();
    }, []);

    const Register = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/users', {
                name: name,
                email: email,
                password: password,
                confPassword: confPassword,
                role:role
            });
            alert('Berhasil Register')
            history('/');
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }

    const Login = () => {
        history('/');
    }

    const getRoles = async () => {
        const response = await axios.get('http://localhost:5000/roles');
        setRoles(response.data);
        setRole(response.data[0].role);
    }

    return (
        <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop">
                            <form onSubmit={Register} className="box">
                                <p className='has-text-centered'>{msg}</p>
                                <div className="field mt-5">
                                    <label className="label">Name</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder='Name'
                                            value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Email</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder='Email'
                                            value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder='*****'
                                            value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Confirm Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder='*****'
                                            value={confPassword} onChange={(e) => setConfPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Select Roles</label>
                                    <div className="controls">
                                        <select className='input' name="roles" id="roles" onChange={(e)=>setRole(e.target.value)}
                                        defaultValue={role} >
                                            {roles.map((role) => (
                                                <option key={role.id}>{role.role}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <p>selected value {role}</p>
                                <div className="field mt-5">
                                    <button className="button is-success is-fullwidth">Register</button>
                                </div>
                            </form>
                            <button className="button is-danger" onClick={Login}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register
