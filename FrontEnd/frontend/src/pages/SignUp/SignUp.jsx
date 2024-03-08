import React from 'react';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './SignUp.module.css';
import 'boxicons/css/boxicons.min.css';
import { signup } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(null);


    const validatePhone = (phone) => {
        const phoneRegex = /^(\+\d{1,3}[-\s]?)?(\d{10})$/;
        return phoneRegex.test(phone);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    };

    const validateRePassword = () => {
        return validatePassword(confirmPassword);
    };

    const validatePasswordMatch = () => {
        return password === confirmPassword;
    };
    
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setIsPasswordValid(validatePassword(newPassword));
    };



    const handleSignUp = async (e) => {
        e.preventDefault();
        if (validatePhone(phone) && validateEmail(email) && validatePassword(password) && validatePasswordMatch()) {
            setIsLoading(true);
            try {
                const response = await signup(name, phone, email, password);
                console.log(response)
                if (response.code === 201) {
                    toast.success('Successfully signed up!')

                    setTimeout(() => {
                        navigate('/login');
                    }, 1000);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    for (let i = 0; i < error.response.data.message.length; i++) {
                        toast.error(error.response.data.message[i].defaultMessage + '. Please try again.');
                    }
                } else {
                    for (let i = 0; i < error.response.data.message.length; i++) {
                        toast.error(error.response.data.message[i].defaultMessage);
                    }
                }
                
            } finally {
                setIsLoading(false)
            }
        } else {
            if (!validatePhone(phone)) {
                toast.error('Invalid Phone');
            }
    
            if (!validateEmail(email)) {
                toast.error('Invalid Email');
            }
    
            if (!validatePassword(password)) {
                toast.error('Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character.');
            }
    
            if (!validatePasswordMatch()) {
                toast.error("Passwords do not match");
            }
        }
    };
    

    return (
        <>
            <ToastContainer />
            <div className={styles.login_container}>
                <div className={styles.general}>
                    <div className={styles.wrapper}>
                        <form onSubmit={handleSignUp}>
                            <h1>Sign Up</h1>
                            <div className={styles.input_box}>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <i className='bx bxs-user'></i>
                            </div>
                            <div className={styles.input_box}>
                                <input
                                    type="text"
                                    placeholder="Phone"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                {phone ? (validatePhone(phone) ? <i className='bx bx-check'></i> : <i className='bx bx-x'></i>) : null}
                            </div>
                            <div className={styles.input_box}>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {email && <i className={validateEmail(email) ? 'bx bx-check' : 'bx bx-x'}></i>}
                            </div>
                            <div className={styles.input_box}>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                {isPasswordValid !== null && (
                                    <i className={isPasswordValid ? 'bx bx-check' : 'bx bx-x'}></i>
                                )}
                            </div>
                            <div className={styles.input_box}>
                                <input
                                    type="password"
                                    placeholder="Re Password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {confirmPassword !== '' && isPasswordValid !== null && (
                                    <i className={validateRePassword() && validatePasswordMatch() ? 'bx bx-check' : 'bx bx-x'}></i>
                                )}
                            </div>

                            <button type="submit" className={styles.btn} disabled={isLoading}>
                                {isLoading ? 'Loading...' : 'Sign Up'}
                            </button>
                            <div className={styles.register_link}>
                                <p>Already have an account? <a href="login">Login</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignUp;
