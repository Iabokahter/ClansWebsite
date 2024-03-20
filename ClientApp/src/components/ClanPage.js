import React, {useEffect, useState} from 'react';
import config from "./config.json";

function ClanPage() {
    const [addPoints, setAddPoints] = useState(0);
    const [subtractPoints, setSubtractPoints] = useState(0);
    const [setPoints, setSetPoints] = useState(0);

    const [ClanName,setClanName] = useState("");
    const [loggedOut, setLoggedOut] = useState(false);

    useEffect(() => {


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

        const intervalId = setInterval(checkSessionID, 1000); // Poll every 1 second
        return () => clearInterval(intervalId);

    }, []);
    const getClanName = ()=>{
        fetch('/user/GetMyClanName',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: localStorage.getItem('name') })}).then(r =>{
            if(r.ok){
                r.text().then(r=>{
                    console.log(r);
                    setClanName(r);
                    }
                    
                )
            }
        });
    }
    const handleAddPoints = () => {
        
        fetch('/user/AddRemovePoints',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: localStorage.getItem('name'),Diff : addPoints })}).then(

        ).then(r =>{
            if(r.ok){

                setAddPoints(0);

            }
        });
    };
    const handleShowClanContribution = () => {
        window.location.href = '/ClanContribution'

    };
    const handleSubtractPoints = () => {
        console.log("Subtracting points:", subtractPoints);
        let subtraction  = -subtractPoints;

        fetch('/user/AddRemovePoints',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: localStorage.getItem('name'),Diff : subtraction })}).then(

        ).then(r =>{
            if(r.ok){

                setSubtractPoints(0);

            }
        });
    };

    const handleSetPoints = () => {
        fetch('/user/SetPoints',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: localStorage.getItem('name'),Diff : setPoints })}).then(

        ).then(r =>{
            if(r.ok){

                setSetPoints(0);

            }
        });
    };
    
    const handleLeaveClan = () => {
        fetch('/user/LeaveClan',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: localStorage.getItem('name') })}).then(

        ).then(r =>{
            if(r.ok){
                window.location.href = '/ClanBrowserPage'

            }
        });
    };
    getClanName();
    return (
        <div>
            <button style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={handleLeaveClan}>Leave the Clan</button>

            <h1>You are a part of {ClanName}</h1>

            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '200px' }}>
                <div style={{ marginRight: '20px', textAlign: 'center' }}>
                    <label>Add</label>
                    <br />
                    <input type="number" value={addPoints} onChange={(e) => setAddPoints(parseInt(e.target.value))} />
                    <br />
                    <button onClick={handleAddPoints}>Submit</button>
                </div>

                <div style={{ marginRight: '20px', textAlign: 'center' }}>
                    <label>Subtract</label>
                    <br />
                    <input type="number" value={subtractPoints} onChange={(e) => setSubtractPoints(parseInt(e.target.value))} />
                    <br />
                    <button onClick={handleSubtractPoints}>Submit</button>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <label>Set</label>
                    <br />
                    <input type="number" value={setPoints} onChange={(e) => setSetPoints(parseInt(e.target.value))} />
                    <br />
                    <button onClick={handleSetPoints}>Submit</button>
                </div>
            </div>
            <button className="button-container" onClick={handleShowClanContribution}>Show clan contribution </button>
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

export default ClanPage;
