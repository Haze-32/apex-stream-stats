import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import staticData from './staticData.json';
import { getFirestore, doc, setDoc } from "firebase/firestore";

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
                                const uniqueName = `${segment.type === 'overview' ? 'lifetime_' : ''}${statKey}`;
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
                        {Object.keys(checkedStats).filter(key => checkedStats[key]).map(key => (
                            <div key={key}>{key}: {checkedStats[key] ? segments.find(segment => segment.stats[key.replace('lifetime_', '')]).stats[key.replace('lifetime_', '')].displayValue : ''}</div>
                        ))}
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
