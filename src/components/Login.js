import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from '../utilities/AuthContext'; // Import the custom hook

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Use the AuthContext
    const { setIsLoggedIn, setEmail: setAuthEmail } = useAuth();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('apexTrackerUser'));
        if (storedUser) {
            navigate('/dashboard');
        }
    }, [navigate]);

    // Helper function to translate Firebase error messages
    const getFriendlyErrorMessage = (error) => {
        const code = error.code.split('/').pop(); // Extracts the error code after the last '/'
        switch (code) {
            case 'invalid-email':
                return 'Error: Invalid email';
            case 'email-already-in-use':
                return 'Error: Email already in use';
            case 'wrong-password':
                return 'Error: Wrong password';
            default:
                return 'Error: An unknown error occurred';
        }
    };

    const handleForgotPassword = () => {
        // Sending a password reset email
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Password reset link sent. Please check your email.");
            })
            .catch((error) => {
                setErrorMessage(getFriendlyErrorMessage(error));
            });
    };

    const googleProvider = new GoogleAuthProvider();

    // This will prompt the user to select a Google account
    googleProvider.setCustomParameters({
        prompt: 'select_account'
    });

    const handleGoogleLogin = () => {
        signInWithPopup(auth, googleProvider)
            .then(result => {
                const user = result.user;
                localStorage.setItem('apexTrackerUser', JSON.stringify(user));
                // Set the shared isLoggedIn and email states
                setIsLoggedIn(true);
                setAuthEmail(user.email);
                navigate('/dashboard');
            })
            .catch(error => {
                setErrorMessage(getFriendlyErrorMessage(error));
            });
    };

    const handleEmailPasswordLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                localStorage.setItem('apexTrackerUser', JSON.stringify(user));
                // Set the shared isLoggedIn and email states
                setIsLoggedIn(true);
                setAuthEmail(user.email);
                navigate('/dashboard');
            })
            .catch(error => {
                setErrorMessage(getFriendlyErrorMessage(error));
            });
    };

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                localStorage.setItem('apexTrackerUser', JSON.stringify(user));
                // Set the shared isLoggedIn and email states
                setIsLoggedIn(true);
                setAuthEmail(user.email);
                navigate('/dashboard');
            })
            .catch(error => {
                setErrorMessage(getFriendlyErrorMessage(error));
            });
    };

    return (
        <div className="container homeContainer blurContainer mt-5 py-5 text-center">


            <button className="apexBtn" onClick={handleGoogleLogin}>Google Login</button>
            <hr className='pb-5 mt-5' />
            <h4>Email Login/Sign up</h4>
            <form>
                <div className='py-3'>
                    <input
                        type="email"
                        className='me-3'
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className='py-3'>
                    <button className="apexBtn loginBtn" type="button" onClick={handleEmailPasswordLogin}>Login</button>
                    <button className="apexBtn signUpBtn" type="button" onClick={handleSignUp}>Sign Up</button>
                </div>
                {/* Add the "Forgot Password" link */}
                <div className='pt-2 ms-3'>
                    <button className="apexBtn forgotPasswordBtn" type="button" onClick={handleForgotPassword}>Forgot Password?</button>
                </div>
            </form>

            {/* Display the error message if it exists */}
            {errorMessage && <h3 className='loginError pt-3'>{errorMessage}</h3>}
        </div>
    );
}
