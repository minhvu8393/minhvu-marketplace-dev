import React from 'react';
import { setUser } from '../../actions/user';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import { switchOpen, setComponent } from '../../actions/modal';
import { setError } from '../../actions/error';
import FacebookLogin from './FacebookLogin';
import Error from '../Error';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: false
        }
        this.handleLogin = this.handleLogin.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
    }
    handleLogin(e) {
        e.preventDefault();
        let user = {
            email: e.target.email.value,
            password: e.target.password.value
        }
        fetch('/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(response => {
            if (response.status === 200) {
                this.props.setError('');
                response.json()
                .then(result => {
                    if (!this.props.modal.open) {
                        this.setState(() => {
                            return {
                                finished: true
                            }
                        })
                    } else {
                        this.props.setUser(result.user);
                        this.props.switchOpen(false)
                        this.props.setComponent(undefined);
                    }
                })
            } else {
                this.props.setError('Wrong username or password')
            }
        })
    }
    handleSignup() {
        this.props.switchOpen(true);
        this.props.setComponent('Signup');
    }
    componentWillUnmount() {
        this.props.setError('');
    }
    render() {
        return (
            <div className='login-container'>
                {
                    this.state.finished ?
                    <Redirect to='/'/> :
                    <div className='login'>
                        <form className='login__login' onSubmit={this.handleLogin}>
                            <input name='email' placeholder='Email'/>
                            <input name='password' type='password' placeholder='Password' />
                            <button>Submit</button>
                        </form>
                        <hr className='login__hr'/>
                        <FacebookLogin />
                        <div className='login__signup'>
                            <button onClick={this.handleSignup}>Sign Up</button>
                        </div>
                        <Error />
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        modal: state.modal
    }
}
 
const mapDispatchToProps = { setUser, switchOpen, setComponent, setError }

export default connect(mapStateToProps, mapDispatchToProps)(Login);