import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import Cookies from 'js-cookie';

export const Login = () => {
    // useState hooks to get value of inputs 
    // email and password will be updated "onChange"
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
 

    // navigate to signup page, route path is in App.js
    let navigate = useNavigate();
    const navSignup = () =>{
        navigate('/Signup');
    }
    // const json = JSON,stringify();
    /*
    handleSubmit = e => {
        e.preventDefault();

        const json = {username: username, password: password}
        axios
            .post('http://localhost:3000', json)
            .then(() => console.log("Login Sucessful"))
            .catch(err => {
                console.error(err);
            });
    };
    */
    //aysnc function
    //const axios = require('axios');
   
        
            //      console.log("Incorrect Password");
            //      Cookies.remove('userid');
            //  } else {
            //      console.log(`successfully logged in ${apiResponse}`);
            //      Cookies.set('userid', apiResponse, { expires: 7 });
            //      navigate('/List');
            //  }
    
    //    const response =  async () => {
    //         await axios.post('http://localhost:3001/users/login', {
    //             username: username,
    //             password: password
    //         }).then(res => {

    //             if (res.data.id !== "Not Found") {
    //                 console.log(`successfully logged in ${res.data.id}`);
    //                 Cookies.set('userid', res.data.id, { expires: 7 });
    //                 Cookies.set('foundUser', "true");
    //             } else {
    //                 console.log(`Message: ${res.status}`);
    //                 Cookies.set('foundUser', "false");
    //             }
    //         }).catch(e => console.log(e));
    //     }

    //    // alert(response);
    //     //const foundUser = Cookies.get('foundUser');
    //     //alert(Cookies.get('userid'));
    //     alert(response.data);
    //     if (response.data.id != "Not Found") {
    //         //Cookies.remove('foundUser');
    //         navigate('/List');
    //     } else {
    //         Cookies.remove('foundUser');
    //         console.log("Incorrect Password");
    //     }

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const data = await axios.post('http://localhost:3001/users/login',{
                            username: username,
                            password: password
                        });
            Cookies.set('userid', data.data.id);
            console.log(data.data.id);
            navigate('/List');
        } catch (error) {
            console.log(error.response.status);
            console.log("Incorrect");
            alert("Incorrect Password");
        }
        // if (await data.response.status != 400) {

        //     console.log(await data.data.id);

        // } else {
        //     console.log("WRONG");
        // }
    }

    return(
        <>
            <nav className="nav justify-content-center">
                <h1>Productivity Manager</h1>
            </nav>
            <div className="container">
                <h1>Login</h1>
                <form id="loginForm" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="usernameLabel">Username</label>
                        <input type="username" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username"/>
                    </div>
                    <div className="form-group">
                    <label htmlFor="passwordLabel">Password</label>
                        <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                    </div>
                    <button className="btn btn-primary" type="submit" >Submit</button>
                    <button className="btn btn-link" onClick={navSignup} type="cancel">Don't have an account? Signup here</button>
                </form>
            </div>
        </>
    )
}