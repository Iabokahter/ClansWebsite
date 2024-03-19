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
        console.log(event.target.value);
    }
    
    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.editText.editText)
        fetch('/user/saveEditText', { // Assuming your controller is named 'UserController'
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: "asdasdada" })});
        

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
