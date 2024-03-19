import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = { editText: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({editText: event.target.value});
    }
    
    handleSubmit(event) {

        event.preventDefault();
        console.log(this.state.editText)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: this.state.editText })
        };

        let user =fetch('/user/saveEditText', requestOptions)
            .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Return response as text
                
        })
            .then(data => {
                console.log(data); // Log the text response
                if(data == 'User created'){

                    localStorage.setItem('name', this.state.editText);

                }else{
                    localStorage.setItem('name', 'Back  ' + this.state.editText );

                }
                window.location.href = '/ClanBrowserPage'
            })

            
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    

    }
    
    
    render() {
        let  user = this.state;

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
