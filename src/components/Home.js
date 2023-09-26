import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container homeContainer blurContainer mt-5 py-3">
            <h3>How to use</h3>

            <div>Go to the <Link className="inlineLink" target="" to={`/dashboard`}>Dashboard</Link> and search for user stats. Supply the gamertag and the platform, and then click search.</div>
            <br />
            <div>The stats are pulled from a third-party API and load on the page for that player. Some players will have different stats from others.</div>
            <br />
            <div>The stats for the active legend will be displayed, and these will also be different for each player and each legend. Some legends will have legend-specific stats. For example, Pathfinder has "Grapple: Travel Distance," which will only appear for him.</div>
            <br />
            <div>Shared stats like "Kills" will still appear when switching legends.</div>
            <br />
            <div>When the desired stats are confirmed, click "Apply Changes." You can preview the stat page by clicking "View Stat Page."</div>
            <br />
            <div>You will now need to copy the link to your stat page and paste it into the browser source in the streaming program you use.</div>
            <br />
            <div>Choosing the stats to be shown should be almost instant. After switching legends in-game, the active legend stats will switch automatically within a minute or two. Because of rate limits in the third-party API, the stat data is refreshed every 10 minutes.</div>

        </div>
    )
}

export default Home;