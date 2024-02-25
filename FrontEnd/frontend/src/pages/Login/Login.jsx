import React, { useState } from 'react';
import styles from './Login.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {login} from '../services/AuthService';
import { ToastContainer } from 'react-toastify';
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    // Biểu thức chính quy kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Biểu thức chính quy kiểm tra mật khẩu phải có ít nhất một kí tự đặc biệt, một kí tự in hoa, một kí tự in thường và một chữ số
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email) && !validatePassword(password)) {
      toast.error('Invalid email and password');
    } else if (!validateEmail(email)) {
      toast.error('Invalid email');
    } else if (!validatePassword(password)) {
      toast.error('Invalid password');
    }
    
    if (validateEmail(email) && validatePassword(password)) {
      setIsLoading(true);
      try {
        const response = await login(email, password); // Sử dụng service đăng nhập
        console.log('Logged in successfully!', response);
        toast.success('Logged in successfully!');
        localStorage.setItem("authenticated", true);
        const token = response.token;
        localStorage.setItem("jwtToken", token);
        
        // Xác định vai trò của người dùng từ response
        const userRole = response.data.role;
        
        // Chuyển hướng dựa trên vai trò của người dùng
        if (userRole === 'ROLE_ADMIN') {
          navigate("/admin/dashboard");
        } else if (userRole === 'ROLE_REVIEWER') {
          navigate("/reviewer/dashboard");
        } else {
          // Xử lý chuyển hướng cho các vai trò khác (nếu cần)
        }
    
      } catch (error) {
        console.error('Error logging in:', error);
        if (error.response && error.response.status === 401) {
          setError('Invalid username or password. Please try again.'); // Set thông báo lỗi cho người dùng
          for (let i = 0; i < error.response.data.message.length; i++) {
            alert(error.response.data.message[i].defaultMessage + '. Please try again.');
          }
        } else {
          setError('An error occurred. Please try again later.');
          alert('An error occurred. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    }
    
  };

  return (
    <>
      <ToastContainer />
      <div className={styles.login_container}>
        <div className={styles.general}>
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
    </>
  );
}

export default Login;
