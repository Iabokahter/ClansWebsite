import React, { useState, useEffect } from 'react';

import config from './config.json'; 

function EntitiesPage() {
    const [entities, setEntities] = useState([]);
    const [numbers, setNumbers] = useState({}); 
    const [points,setPoints] = useState({});
    const nameStr = localStorage.getItem('name');
    const [loggedOut, setLoggedOut] = useState(false);
    const [Loading, setLoading] = useState(false);


    useEffect(() => {
        fetchNumbers();
        

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
    const handleButtonClick = (index) => {
        setLoading(true);
        fetch('/user/EnterClan',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text:index, username:nameStr })}).then(
                
        ).then(r =>{    
            if(r.ok){
                
                window.location.href = '/ClanPage'

            }else{
                window.location.href = '/ClanBrowserPage'

            }
            
        }).finally(r=>{
            setLoading(false);
        });

        };

    const fetchNumbers = async () => {
        try {
            await fetch('/user/GetPlayersCount',{
                method: 'GET'}).then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); 

            }) .then(data => {
                console.log(data)
                setNumbers(data);
                fetchPoints();

            });
    }catch (error) {
            console.error('Error fetching numbers:', error);
        }
    };
    const fetchPoints = async () => {
        try {
            await fetch('/user/GetClanPoints',{
                method: 'GET'}).then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text().then(data=>{

                    setPoints(data);

                    const loadEntities = () => {
                        setEntities(config.entities); 
                    };
                    loadEntities();
                }); 

            }) .then(data => {
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
                            {}
                            
                            <span>Clan name: {entity.name} ,current points: {(JSON.parse(points))[entity.name]=== undefined ? 0:JSON.parse(points)[entity.name] } , and has {(JSON.parse(numbers))[entity.name]=== undefined ? 0:JSON.parse(numbers)[entity.name] } players out of 10</span>

                            <button className="indent-button" disabled={(JSON.parse(numbers))[entity.name] >= 10} onClick={() => handleButtonClick(entity.name)}>Enter Clan</button>

                        </li>
                    ))}
                </ul>
            </div>
            <div className="name-display">
                <p>Logged in as: {nameStr ? nameStr : 'No name provided'}</p>
            </div>
            {loggedOut && (
                    <div className="loading-overlay">
                        <h1 style={{ color: 'white' }}>Logged Out...</h1>
                        <button  onClick={() =>                 window.location.href = '/'
                        }>BackToLogin</button>
                    </div>
                )}
            {Loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div> {Loading && (
                    <div className="loading-overlay">
                        <h1 style={{ color: 'white' }}>Loading...</h1>
                    </div>
                )}
                </div>
            )}
            
        </div>
    );
}

export default EntitiesPage;
