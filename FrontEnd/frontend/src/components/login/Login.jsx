import React, { useState } from 'react';
import styles from './Login.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from"react-router-dom";


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authenticated, setauthenticated] = useState(
    localStorage.getItem(localStorage.getItem("authenticated") || false)
  );

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://192.168.1.120:8080/api/auth/login', { email, password });

      if (response.status === 200) {
        console.log('Logged in successfully!', response.data);
        toast.success('Logged in successfully!');
        localStorage.setItem("authenticated", true);
        // Lưu token vào localStorage
        const token = response.data.token; // Giả sử token được trả về từ response.data.token
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("authenticated", true);
        
        navigate("/admin/dashboard");

      } else {
        setError('Invalid email or password.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred. Please try again later.');
      alert('Check your email and password and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
    </div>
  );
}

export default Login;