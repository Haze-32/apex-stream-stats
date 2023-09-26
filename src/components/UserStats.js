import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import staticData from './staticData.json'; // Assuming you have access to the staticData.json file
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import legendImages from './legendImages';

const UserStats = () => {
    const { uid } = useParams();
    const [userData, setUserData] = useState(null);
    const [segments, setSegments] = useState([]); // Initialize the segments state
    const [apiError, setApiError] = useState(null); // For holding API error messages
    const db = getFirestore();
    //const [detailedError, setDetailedError] = useState(null);
    const useStaticData = false;


    const formatStatKey = (statKey) => {
        return statKey
            .replace(/([A-Z]|\d+)/g, ' $1')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Function to fetch Apex data
    const fetchApexData = async (data) => {
        try {
            const response = await axios.get(`https://public-api.tracker.gg/v2/apex/standard/profile/${data.platform}/${data.gamerTag}`, {
                headers: {
                    'TRN-Api-Key': 'eddead8c-2bf4-407a-aa19-d1003709d2bd',
                },
            });
            setSegments(response.data.data.segments);
            //console.log("CALLED")
            setApiError(null);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Unknown error!';
            setApiError(errorMessage);
            // setDetailedError(JSON.stringify(error, null, 2)); // Pretty print the error object
            setSegments([]);
        }
    };

    useEffect(() => {
        const docRef = doc(db, 'userSettings', uid);

        const unsubscribe = onSnapshot(docRef, async (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserData(data);
                if (useStaticData) {
                    setSegments(staticData.data.segments);
                    setApiError(null);
                } else {
                    fetchApexData(data);  // Call the function to fetch Apex data
                }
            } else {
                console.log("No such document!");
            }
        });

        // Unsubscribe when the component unmounts
        return () => unsubscribe();

    }, [uid, db, useStaticData]);

    useEffect(() => {
        // Set up an interval only if userData is available and useStaticData is false
        if (userData && !useStaticData) {
            // Fetch Apex data every 10 minutes (600,000 milliseconds)
            const interval = setInterval(() => {
                fetchApexData(userData);
            }, 600000);

            // Clear the interval when the component unmounts
            return () => clearInterval(interval);
        }
    }, [userData, useStaticData]);


    const activeLegend = segments.find(segment => segment.metadata && segment.metadata.isActive === true);
    const LegendIcon = activeLegend ? legendImages[activeLegend.metadata.name] : null;

    return (
        <div>


            {apiError && <p>Error: {apiError}</p>} {/* Display error if exists */}
            {userData ? (
                <div className="statsDispalyWrapper float-end">
                    {/* Lifetime Stats */}
                    <div className="statBox lifeTimeStats mb-5">
                        <div className="statTitleWrap">

                        </div>
                        <h4 className="legendTitle">Lifetime Stats:</h4>
                        {Object.keys(userData.checkedStats).filter(key => userData.checkedStats[key] && key.startsWith('lifetime')).map(key => {
                            const statKey = key.split('_')[1];
                            const segment = segments.find(segment => segment && segment.type === 'overview' && segment.stats && segment.stats[statKey]);
                            const prettyStatKey = formatStatKey(statKey); // <-- Call the helper function

                            if (segment && segment.stats[statKey] && segment.stats[statKey].displayValue !== 'N/A') {
                                return (
                                    <div className="statRow" key={prettyStatKey}>
                                        <div className="statContent">
                                            <div className="statContentTitle">{prettyStatKey}</div>
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

                    {/* Legend Stats */}
                    <div className="statBox legendStats">

                        <div className="statTitleWrap">
                            <h2 className="legendTitle">
                                {LegendIcon && <LegendIcon fill="#fff" style={{ width: "75px" }} />}
                                <div className="legendName">
                                    {activeLegend ? activeLegend.metadata.name : 'Loading...'}<br />Stats
                                </div>
                            </h2>
                        </div>


                        {Object.keys(userData.checkedStats).filter(key => userData.checkedStats[key] && key.startsWith('legend')).sort().map(key => {
                            const statKey = key.split('_')[1];
                            const segment = segments.find(segment => segment && segment.metadata && segment.metadata.isActive === true && segment.stats && segment.stats[statKey]);
                            const prettyStatKey = formatStatKey(statKey); // <-- Call the helper function

                            if (segment && segment.stats[statKey] && segment.stats[statKey].displayValue !== 'N/A') {
                                return (
                                    <div className="statRow" key={key}>
                                        <div className="statContent">
                                            <div className="statContentTitle">
                                                {prettyStatKey}:
                                            </div>
                                            <div className="statContentValue">
                                                {segment.stats[statKey].displayValue}
                                            </div>
                                        </div>
                                        <div className="statRowBackground"></div>
                                    </div>
                                );
                            }
                            return null;
                        })}
                        <div className="statBoxBackground"></div>
                    </div>
                </div>

            ) : (
                <p>Loading or no data available...</p>
            )
            }
        </div >
    );

};

export default UserStats;