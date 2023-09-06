import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import staticData from './staticData.json'; // Assuming you have access to the staticData.json file
import { getFirestore, doc, getDoc } from "firebase/firestore";

const UserStats = () => {
    const { uid } = useParams();
    const [userData, setUserData] = useState(null);
    const db = getFirestore();

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

    const segments = staticData.data.segments; // Assuming this is where you get the staticData from

    return (
        <div>
            <h1>User Stats for {uid}</h1>
            {userData ? (
                <div>
                    {/* Lifetime Stats */}
                    <div>
                        <h4 className="legendTitle">Lifetime Stats:</h4>
                        {Object.keys(userData.checkedStats).filter(key => userData.checkedStats[key] && key.startsWith('lifetime')).map(key => (
                            <div key={key}>
                                {key.split('_')[1]}: {segments.find(segment => segment.type === 'overview').stats[key.split('_')[1]].displayValue}
                            </div>
                        ))}
                    </div>

                    {/* Legend Stats */}
                    <div>
                        <h4 className="legendTitle">Legend Stats:</h4>
                        {Object.keys(userData.checkedStats).filter(key => userData.checkedStats[key] && key.startsWith('legend')).map(key => {
                            const statKey = key.split('_')[1];
                            const segment = segments.find(segment => segment.metadata.isActive === true && segment.stats[statKey]);
                            return (
                                <div key={key}>
                                    {segment.metadata.name} - {statKey}: {segment ? segment.stats[statKey].displayValue : 'N/A'}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <p>Loading or no data available...</p>
            )}
        </div>
    );
};

export default UserStats;
