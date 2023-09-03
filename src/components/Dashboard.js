import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Import directly from Firebase package

// Initialize Firestore once
const db = getFirestore();

const Dashboard = () => {
    // State management
    const [uid, setUid] = useState(null);
    const [inputData, setInputData] = useState('');

    // Navigation
    const navigate = useNavigate();

    // Load UID from local storage once component mounts
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('apexTrackerUser'));
        if (storedUser) {
            setUid(storedUser.uid);
        }
    }, []);

    // Handles form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!uid) {
            console.error("UID not available");
            return;
        }

        try {
            // Write to Firestore
            await setDoc(doc(db, 'userSettings', uid), { field: inputData });
            console.log('Document successfully written!');
        } catch (error) {
            console.error('Error writing document:', error);
        }
    };

    return (
        <div className="row">
            {/* Dashboard title */}
            Dashboard

            {/* Display UID if available */}
            {uid && <div>User ID: {uid}</div>}

            {/* Form for entering data */}
            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    value={inputData}
                    onChange={e => setInputData(e.target.value)}
                    placeholder="Enter your data here"
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Dashboard;
