import React from 'react';
import { auth } from '../components/firebase';
import firebase from 'firebase/app';

export const Auth = () => {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    const signInWithEmail = (email, password) => {
        auth.signInWithEmailAndPassword(email, password);
    }

    return (
        <div>
            <button onClick={signInWithGoogle}>Sign In With Google</button>
            {/* Add your email and password input fields */}
            <button onClick={() => signInWithEmail(email, password)}>Sign In With Email</button>
        </div>
    )
};
