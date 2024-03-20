import React, { useState, useEffect } from 'react';

function PlayersPage() {
    const [players, setPlayers] = useState([]);
    const [loggedOut, setLoggedOut] = useState(false);

    useEffect(() => {
        fetchPlayers();


        const checkSessionID = () => {
            fetch('/user/GetActiveSession',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username:localStorage.getItem('name') })}).
            then(r=>{
                    r.text().then(r=>{
                            if(r !== localStorage.getItem('sessionID')){
                                setLoggedOut(true);
                                console.log('logout!!');

                            }else{


                            }
                        }
                    )
                }
            )
        };
        checkSessionID();

        const intervalId = setInterval(checkSessionID, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const fetchPlayers = async () => {
        try {
            console.log(localStorage.getItem('name'));
            const response = await fetch('/user/GetClanMembers',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    
                    body: JSON.stringify({username: localStorage.getItem('name')})});
            if (!response.ok) {
                throw new Error('Failed to fetch players');
            }
            
            const data = await response.json();
            console.log(data);
            setPlayers(data);
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };
    const BackToClanPage = () => {
        window.location.href = '/ClanPage'

    };
    return (
        <div>
            <h1>List of Players and Their Points</h1>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Points</th>
                </tr>
                </thead>
                <tbody>
                {players.map((player, index) => (
                    <tr key={index}>
                        <td>{player.text + (player.inClan ? '' : ' (left the clan)')}</td>
                        <td>{player.clanPoints}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button className="button-container" onClick={BackToClanPage}>Back to current clan </button>
            {loggedOut && (
                <div className="loading-overlay">
                    <h1 style={{ color: 'white' }}>Logged Out...</h1>
                    <button  onClick={() =>                 window.location.href = '/'
                    }>BackToLogin</button>
                </div>
            )}
        </div>
    );
}

export default PlayersPage;
