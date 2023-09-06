import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import staticData from './staticData.json';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const db = getFirestore();

const Dashboard = () => {
    const [uid, setUid] = useState(null);
    const [checkedStats, setCheckedStats] = useState({});

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('apexTrackerUser'));
        if (storedUser) {
            setUid(storedUser.uid);
        }
    }, []);


    useEffect(() => {
        // Fetch user settings from Firestore when uid is available
        const fetchUserSettings = async () => {
            if (uid) {
                const docRef = doc(db, 'userSettings', uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCheckedStats(docSnap.data().checkedStats);
                } else {
                    console.log('No such document!');
                }
            }
        };

        fetchUserSettings();
    }, [uid]);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCheckedStats(prevState => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!uid) {
            console.error("UID not available");
            return;
        }

        try {
            await setDoc(doc(db, 'userSettings', uid), { checkedStats });
            console.log('Document successfully written!');
        } catch (error) {
            console.error('Error writing document:', error);
        }
    };

    const segments = staticData.data.segments;

    // Filter segments to only include Lifetime and active Legends
    const filteredSegments = segments.filter(segment =>
        segment.type === 'overview' || segment.metadata.isActive === true
    );

    return (
        <div className="container-fluid">
            <div className="row">
                Dashboard
                {uid && <div>User ID: {uid}</div>}

                <form onSubmit={handleFormSubmit}>
                    {filteredSegments.map((segment, idx) => (
                        <div key={idx}>
                            <h3>{segment.metadata.name}</h3>
                            {Object.keys(segment.stats).map((statKey) => {
                                const uniqueName = `${segment.type === 'overview' ? 'lifetime_' : 'legend_'}${statKey}`;
                                return (
                                    <div key={uniqueName}>
                                        <input
                                            type="checkbox"
                                            name={uniqueName}
                                            checked={checkedStats[uniqueName] || false}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label>{segment.stats[statKey].displayName}: {segment.stats[statKey].displayValue}</label>
                                    </div>
                                );
                            })}
                        </div>
                    ))}

                    <div>
                        <h3>Selected Stats:</h3>

                        {/* Lifetime Stats */}
                        <div>
                            <h4>Lifetime Stats:</h4>
                            {Object.keys(checkedStats).filter(key => checkedStats[key] && key.startsWith('lifetime')).map(key => {
                                const statKey = key.split('_')[1];
                                const segment = segments.find(segment => segment.type === 'overview' && segment.stats[statKey]);

                                return (
                                    <div key={key}>
                                        {statKey}: {segment ? segment.stats[statKey].displayValue : 'N/A'}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend Stats */}
                        <div>
                            {/* Create a temporary array that groups stats by legends */}
                            {segments.filter(segment => segment.metadata.isActive === true).map((segment) => {

                                // Filter keys that are checked and belong to this legend
                                const filteredKeys = Object.keys(checkedStats).filter(
                                    key => checkedStats[key] &&
                                        key.startsWith('legend') &&
                                        segments.find(s => s.metadata.name === segment.metadata.name && s.stats[key.split('_')[1]])
                                );

                                // If no keys for this legend are checked, do not display the legend title
                                if (filteredKeys.length === 0) {
                                    return null;
                                }

                                return (
                                    <div key={segment.metadata.name}>
                                        <h4 className="legendTitle">{segment.metadata.name}</h4>

                                        {filteredKeys.map(key => {
                                            const statKey = key.split('_')[1];
                                            return (
                                                <div key={key}>
                                                    {statKey}: {segment.stats[statKey] ? segment.stats[statKey].displayValue : 'N/A'}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>

                    </div>


                    <button type="submit">Submit</button>
                </form>

                <br />
                <Link to={`/stats/${uid}`}>Stats</Link>
            </div>
        </div>
    );
};

export default Dashboard;
