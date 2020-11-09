import React from 'react';
import Error from './Error';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser } from '../actions/user';
import { switchOpen, setComponent } from '../actions/modal';
import { setError } from '../actions/error';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: false
        }
        this.handleSignup = this.handleSignup.bind(this);
    }
    handleSignup(e) {
        e.preventDefault();
        let formData = new FormData();
        let { name, email, password, avatar, phone } = e.target
        formData.append('name', name.value);
        formData.append('email', email.value);
        formData.append('password', password.value);
        formData.append('avatar', avatar.files[0])
        formData.append('phone', phone.value)
        fetch('/api/user', {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (response.status === 201) {
                this.props.setError('')
                response.json()
                .then(result => {
                    this.props.setUser(result);
                    this.setState(() => {
                        return {
                            finished: true
                        }
                    })
                    this.props.switchOpen(false);
                    this.props.setComponent('');
                })
            } else {
                response.json()
                .then(result => {
                    this.props.setError(result.error)
                })
            }
        })
    }
    componentWillUnmount() {
        this.props.setError('');
    }
    render() {
        return (
            <div className='signup-container'>
                {this.state.finished && <Redirect to="/"/>}
                <div className='signup'>
                    <h1>Sign up your account</h1>
                    <form className='signup__fields' onSubmit={this.handleSignup}>
                        <input name="name" placeholder="Name"/>
                        <input name="email" placeholder="Email"/>
                        <input name="password" type="password" placeholder="Password"/>
                        <input name='phone' placeholder="Phone Number" />
                        Profile picture: 
                        <input type="file" name="avatar"/>
                        <button>Submit</button>
                    </form>
                    <Error />
                </div>
            </div>
        )
    }
}

let mapDispatchToProps = { setUser, switchOpen, setComponent, setError };

export default connect(undefined, mapDispatchToProps)(Signup);
