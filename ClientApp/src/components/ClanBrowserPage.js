import React, { useState, useEffect } from 'react';

import config from './config.json'; // Assuming your config data is in a JSON file

function EntitiesPage() {
    const [entities, setEntities] = useState([]);
    const [numbers, setNumbers] = useState({}); // State to store numbers fetched from .NET

    const nameStr = localStorage.getItem('name');
    useEffect(() => {
        
        fetchNumbers();
    }, []);
    const handleButtonClick = (index) => {

        console.log(JSON.parse(numbers)["Clan A"]);
    };

    const fetchNumbers = async () => {
        try {
            // Fetch numbers from .NET backend
            await fetch('/user/GetPlayersCount',{
                method: 'GET'}).then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Return response as text

            }) .then(data => {
                console.log(data)
                setNumbers(data);

                const loadEntities = () => {
                    setEntities(config.entities); // Adapt based on your config file's structure 
                };
                loadEntities();
            });
    }catch (error) {
            console.error('Error fetching numbers:', error);
        }
    };
    return (
        <div className="entities-page-wrapper">
            <div className="entities-list">
                <h1>Welcome {nameStr ? nameStr : 'No text provided'}</h1>
                <ul>
                    {entities.map((entity, index) => (
                        <li key={index}>
                            {/* Display entity properties (e.g., entity.name, entity.id, etc.) */}
                            
                            <span>Clan name: {entity.name} ,current points: {entity.initialPoints}, and has {(JSON.parse(numbers))[entity.name]=== undefined ? 0:JSON.parse(numbers)[entity.name] } players out of 10</span>

                            <button className="indent-button" onClick={() => handleButtonClick(entity.name)}>Print Index</button>

                        </li>
                    ))}
                </ul>
            </div>
            <div className="name-display">
                <p>Logged in as: {nameStr ? nameStr : 'No name provided'}</p>
            </div>
        </div>
    );
}

export default EntitiesPage;
