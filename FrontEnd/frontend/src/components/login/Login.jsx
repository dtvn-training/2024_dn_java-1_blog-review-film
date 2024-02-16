import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('https://reqres.in/api/login', { email, password });

      if (response.status === 200) {
        console.log('Logged in successfully!', response.data);
        toast.success('Logged in successfully!');
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
    </div>
  );
}

export default Login;