import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            editText: '',
            isLoading: false // Initialize isLoading state
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ editText: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ isLoading: true }); // Set isLoading to true to show loading overlay
        console.log(this.state.editText);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: this.state.editText })
        };

        fetch('/user/saveEditText', requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {

                localStorage.setItem('name', this.state.editText);
                localStorage.setItem('sessionID', data.split('/')[1]);
                console.log(data.split('/')[0]);
                if(data.includes('User exist')) {
                    window.location.href = '/ClanPage';
                    

                }else{
                    window.location.href = '/ClanBrowserPage';

                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            })
            .finally(() => {
                this.setState({ isLoading: false }); 
            });
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
                        <button type="submit">
                            {this.state.isLoading ? 'Loading...' : 'Submit'}
                        </button>
                    </form>
                    {this.state.isLoading && (
                        <div className="loading-overlay">
                            <div className="spinner"></div> {this.state.isLoading && (
                            <div className="loading-overlay">
                                <h1 style={{ color: 'white' }}>Loading...</h1>
                            </div>
                        )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
