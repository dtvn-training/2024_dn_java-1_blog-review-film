import React, { useState } from 'react';
<<<<<<< Updated upstream
import './Login.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
=======
import styles from './Login.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from"react-router-dom";


function Login() {
  const navigate = useNavigate();
>>>>>>> Stashed changes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< Updated upstream
=======
  const [loggedIn, setLoggedIn] = useState(false);
  const [authenticated, setauthenticated] = useState(
    localStorage.getItem(localStorage.getItem("authenticated") || false)
  );
>>>>>>> Stashed changes

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
<<<<<<< Updated upstream
      const response = await axios.post('https://reqres.in/api/login', { email, password });
=======
      const response = await axios.post('http://192.168.1.120:8080/api/auth/login', { email, password });
>>>>>>> Stashed changes

      if (response.status === 200) {
        console.log('Logged in successfully!', response.data);
        toast.success('Logged in successfully!');
<<<<<<< Updated upstream
=======
        localStorage.setItem("authenticated", true);
        // Lưu token vào localStorage
        const token = response.data.token; // Giả sử token được trả về từ response.data.token
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("authenticated", true);
        
        navigate("/dashboard");

>>>>>>> Stashed changes
      } else {
        setError('Invalid email or password.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred. Please try again later.');
      toast.error('Check your email and password and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
<<<<<<< Updated upstream
    <div className="wrapper">
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <i className='bx bxs-user'></i>
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className='bx bxs-lock-alt'></i>
        </div>
        <div className="remember-forgot"></div>
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Login'}
        </button>
        <div className="register-link">
          <p>Dont have an account? <a href="#">Register</a></p>
        </div>
      </form>
=======
    <div className = {styles.login_container}>
      <div className = {styles.general}>
      <div className={styles.wrapper}>
        <form onSubmit={handleLogin} >
          <h1>Login</h1>
          <div className={styles.input_box}>
            <input
              type="text"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <i className='bx bxs-user'></i>
          </div>
          <div className={styles.input_box}>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i className='bx bxs-lock-alt'></i>
          </div>
          <div className={styles.remember_forgot}></div>
          <button type="submit" className={styles.btn} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </button>
          <div className={styles.register_link}>
            <p>Dont have an account? <a href="#">Register</a></p>
          </div>
        </form>
      </div>
      </div>
>>>>>>> Stashed changes
    </div>
  );
}

export default Login;