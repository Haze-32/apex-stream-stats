import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from "firebase/firestore";  // Import Firestore methods

const UserStats = () => {
    const { uid } = useParams();
    const [userData, setUserData] = useState(null);
    const db = getFirestore(); // Initialize Firestore

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, 'userSettings', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                console.log("No such document!");
            }
        };

        fetchData();
    }, [uid, db]);

    return (
        <div>
            <h1>User Stats for {uid}</h1>
            {userData ? (
                <div>
                    <strong>Field:</strong> {userData.checkedStats}
                    {/* Add more fields as they are available */}
                </div>
            ) : (
                <p>Loading or no data available...</p>
            )}
        </div>
    );
};

export default UserStats;
