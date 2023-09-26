import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import staticData from './staticData.json';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const db = getFirestore();

const Dashboard = () => {
    const [uid, setUid] = useState(null);
    const [checkedStats, setCheckedStats] = useState({});
    const [segments, setSegments] = useState([]);
    const [gamerTag, setGamerTag] = useState('haze-32-');
    const [platform, setPlatform] = useState('psn');
    const [apiError, setApiError] = useState(null);
    const [gamerTagEdited, setGamerTagEdited] = useState(false);
    const useStaticData = false;

    const formatStatKey = (statKey) => {
        return statKey
            .replace(/([A-Z]|\d+)/g, ' $1')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('apexTrackerUser'));
        if (storedUser) {
            setUid(storedUser.uid);
        }
    }, []);

    useEffect(() => {
        if (uid) {
            fetchUserSettings();
        }
    }, [uid]);

    // New useEffect for initial API call
    useEffect(() => {
        if (gamerTag && !gamerTagEdited) {
            fetchData();
        }
    }, [gamerTag, gamerTagEdited]);

    const fetchUserSettings = async () => {
        const docRef = doc(db, 'userSettings', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (!gamerTagEdited) {
                setGamerTag(data.gamerTag || '');
            }
            setPlatform(data.platform || 'origin');
            setCheckedStats(data.checkedStats || {});
        } else {
            console.log('No such document!');
        }
    };

    const handleGamerTagChange = (e) => {
        setGamerTag(e.target.value);
        setGamerTagEdited(true);
    };

    const fetchData = async () => {
        if (!gamerTag) {
            setApiError("Gamer Tag is not available.");
            return;
        }

        if (useStaticData) {  // Step 3: Use conditional statement based on the boolean flag
            setSegments(staticData.data.segments);  // Assuming the staticData is in the same shape as the API response
            setApiError(null);  // Reset the error state if the call is successful
        } else {
            try {
                const response = await axios.get(`https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${gamerTag}`, {
                    headers: {
                        'TRN-Api-Key': 'eddead8c-2bf4-407a-aa19-d1003709d2bd',
                    },
                });
                setSegments(response.data.data.segments);
                setApiError(null);  // Reset the error state if the call is successful
            } catch (error) {
                console.error('Failed to fetch data', error);
                // Update this line to show Axios error message
                const errorMessage = error.response && error.response.data.message ? error.response.data.message : 'Unknown error';
                setApiError(errorMessage);
                setSegments([]);  // Clear the segments as the call failed
            }
        }
    };

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
            console.error('UID not available');
            return;
        }

        // Now, we also save gamerTag and platform along with checkedStats
        const userData = {
            checkedStats,
            gamerTag,
            platform,
        };

        try {
            await setDoc(doc(db, 'userSettings', uid), userData);
            console.log('Document successfully written!');
        } catch (error) {
            console.error('Error writing document:', error);
        }
    };

    const handleSearch = () => {
        fetchData();
    };



    // Filter segments to only include Lifetime and active Legends
    const filteredSegments = segments.filter(segment =>
        segment.type === 'overview' || segment.metadata.isActive === true
    );


    const inputRef = useRef(null);

    // Function to handle the copy action
    const handleCopy = () => {
        // Access the input element
        const inputElement = inputRef.current;

        // Select the text in the input field
        inputElement.select();

        // Copy the selected text to the clipboard
        document.execCommand('copy');
    };

    return (
        <>
            <div className="statSettingsContainerWrap py-5">
                <div className="container statSettingsContainer blurContainer">
                    <div className="settingSection p-3">
                        <h1>Dashboard</h1>
                        <div className="row mb-4">
                            <div className="col-sm-12 col-md-8 col-lg-6">
                                <div className='playerSearch input-group mb-3'>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Gamer Tag"
                                        value={gamerTag}
                                        onChange={handleGamerTagChange} // Updated this line
                                    />
                                    <select className="form-select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                                        <option className="" value="origin">PC</option>
                                        <option className="" value="xbl">XBOX</option>
                                        <option className="" value="psn">PLAYSTATION</option>
                                    </select>
                                    <button className="apexBtn apexBtnSm" type="button" onClick={handleSearch}>Search</button>
                                </div>
                            </div>
                        </div>





                        <form onSubmit={handleFormSubmit}>
                            <div className="row mb-4">
                                {apiError ? (
                                    <div className="error-message">
                                        {apiError}
                                    </div>
                                ) : (
                                    <>
                                        {filteredSegments.map((segment, idx) => (

                                            <div className="col-md-6" key={idx}>
                                                <h3>
                                                    {idx === 0 ? `${segment.metadata.name} Stats` : `Active Legend - ${segment.metadata.name}`}
                                                </h3>
                                                <div className="form-check form-switch apex-form-switch mb-3">
                                                    {Object.keys(segment.stats).map((statKey) => {
                                                        const uniqueName = `${segment.type === 'overview' ? 'lifetime_' : 'legend_'}${statKey}`;
                                                        return (
                                                            <div key={uniqueName}>
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    name={uniqueName}
                                                                    checked={checkedStats[uniqueName] || false}
                                                                    onChange={handleCheckboxChange}
                                                                />
                                                                <label>{segment.stats[statKey].displayName}: <b>{segment.stats[statKey].displayValue}</b></label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                {idx === 1 &&
                                                    <div className="pt-3">
                                                        <img className="legendImage" src={segment.metadata.tallImageUrl} />
                                                    </div>
                                                }
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                            <div className="row mb-4">
                                <div className='col-sm-12 col-md-6'>
                                    <button className="apexBtn  mb-3" type="submit">Apply Changes</button>
                                </div>
                                <div className='col-sm-12 col-md-6'>
                                    <div className="row">
                                        <div className="col-auto">
                                            <Link className="viewStatsLink" target="_blank" to={`/stats/${uid}`}>
                                                <div className="apexBtn mb-3">View Stat Page</div>
                                            </Link>
                                        </div>
                                        <div className="col-sm-12 col-auto">
                                            <div className="copyLink">
                                                <div>Copy this link and paste into streaming program</div>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" ref={inputRef} value={`${window.location.origin}/stats/${uid}`} readOnly />
                                                    <div className="apexBtn apexBtnSm copyBtn" type="button" onClick={handleCopy}>Copy</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </form>

                        <br />

                    </div>
                </div >
            </div >
            {/*
            <div className="statsPreview demoWrap">
                {apiError ? (
                    <div className="error-message">
                        {apiError}
                    </div>
                ) : (
                    <>

                        <div className="statsDispalyWrapper float-end">
                            {/* Lifetime Stats 
                            <div className="statBox lifeTimeStats mb-5">
                                <h4 className="legendTitle">Lifetime Stats:</h4>
                                {Object.keys(checkedStats).filter(key => checkedStats[key] && key.startsWith('lifetime')).sort().map(key => {
                                    const statKey = key.split('_')[1];
                                    const segment = segments.find(segment => segment.type === 'overview' && segment.stats[statKey]);
                                    const prettyStatKey = formatStatKey(statKey);

                                    // Check if the segment and stat exist, and that the displayValue is not 'N/A'
                                    if (segment && segment.stats[statKey] && segment.stats[statKey].displayValue !== 'N/A') {
                                        return (
                                            <div className="statRow" key={key}>
                                                <div className="statContent">
                                                    <div>{prettyStatKey}: </div>
                                                    <div className="statContentValue">{segment.stats[statKey].displayValue}</div>
                                                </div>
                                                <div className="statRowBackground"></div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                                <div className="statBoxBackground"></div>
                            </div>

                            {/* Legend Stats *
                            <div className="statBox legendStats">
                                {/* Create a temporary array that groups stats by legends 
                                {segments.filter(segment => segment.metadata.isActive === true).sort().map((segment) => {

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
                                        <>
                                            <div key={segment.metadata.name}>
                                                <h4 className="legendTitle">{segment.metadata.name}</h4>

                                                {filteredKeys.map(key => {
                                                    const statKey = key.split('_')[1];
                                                    // Check if the stat exists and is not 'N/A'
                                                    if (segment.stats[statKey] && segment.stats[statKey].displayValue !== 'N/A') {
                                                        return (
                                                            <div key={key}>
                                                                {statKey}: {segment.stats[statKey].displayValue}
                                                            </div>
                                                        );
                                                    }
                                                    return null;  // Return null if the condition is not met
                                                })}
                                            </div>
                                        </>
                                    );

                                })}
                                <div className="statBoxBackground"></div>
                            </div>

                        </div>


                    </>
                )}
            </div>

        */}
        </>
    );
};

export default Dashboard;
