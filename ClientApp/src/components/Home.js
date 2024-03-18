import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = { editText: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ editText: event.target.value });
    }
callDummyPostMethod() {
        fetch('WeatherForecast/WriteToDatabase',{
            method: 'POST',
        headers:{'Content-type':'application/json'},
    body: 'ddddd'}).then(Response=>{
            if(Response.ok)
            console.log("asd")
            else{
                
            }
        }).catch(error=>{
            console.log(error.toString());
        });

    }
    handleSubmit(event) {
        event.preventDefault();
        //fetch('User/saveEditText').then(console.log("sadas")).catch(Error=>{console.log(Error.toString());});        
        this.callDummyPostMethod();
        
    }
    
    
    render() {
        return (
            <div className="landing-page-container">
                <h1>Your Landing Page Title</h1>
                <div className="form-wrapper">
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            value={this.state.editText}
                            onChange={this.handleChange}
                            placeholder="Enter your text here"
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        );
    
    }
}
