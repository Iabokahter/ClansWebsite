import React, { useState, useEffect } from 'react';

function PlayersPage() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetchPlayers();
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
                        <td>{player.text}</td>
                        <td>{player.clanPoints}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button className="button-container" onClick={BackToClanPage}>Back to current clan </button>

        </div>
    );
}

export default PlayersPage;
