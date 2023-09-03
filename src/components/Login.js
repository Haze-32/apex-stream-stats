import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from '../utilities/AuthContext'; // Import the custom hook

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Use the AuthContext
    const { setIsLoggedIn, setEmail: setAuthEmail } = useAuth();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('apexTrackerUser'));
        if (storedUser) {
            navigate('/dashboard');
        }
    }, [navigate]);

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
                console.log(error.message);
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
                console.log(error.message);
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
                console.log(error.message);
            });
    };

    return (
        <div>
            <button onClick={handleGoogleLogin}>Google Login</button>
            <form>
                <input
                    type="email"
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
                <button type="button" onClick={handleEmailPasswordLogin}>Login</button>
                <button type="button" onClick={handleSignUp}>Sign Up</button>
            </form>
        </div>
    );
}
