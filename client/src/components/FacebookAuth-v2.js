import React from 'react';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser } from '../actions/user';

class FacebookAuthV2 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            finished: false,
            id: undefined,
            firstname: undefined,
            lastname: undefined,
            email: undefined
        }
        this.handleSignup = this.handleSignup.bind(this);
    }
    componentDidMount() {
        let code = queryString.parse(this.props.location.search).code
        console.log(code);
        fetch(`/api/user/login/facebook?code=${code}`)
        .then(response => {
            if (response.status === 300) {
                response.json()
                .then(result => {
                    console.log(result)
                    this.setState(() => {
                        return {
                            id: result.id,
                            firstname: result.first_name,
                            lastname: result.last_name,
                            email: result.email
                        }
                    })
                })
            } else if (response.status === 200) {
                response.json()
                .then(result => {
                    this.props.setUser(result)
                    this.setState(() => {
                        return {
                            finished: true
                        }
                    })
                })

            }
        })
    }
    handleSignup(e) {
        e.preventDefault();
        let formData = new FormData();
        let { password, avatar, phone } = e.target
        formData.append('name', `${this.state.firstname} ${this.state.lastname}`);
        formData.append('fbid', this.state.id)
        formData.append('email', this.state.email);
        formData.append('password', password.value);
        formData.append('avatar', avatar.files[0])
        formData.append('phone', phone.value)
        fetch('/api/user', {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (response.status === 201) {
                response.json()
                .then(result => {
                    this.props.setUser(result)
                    this.setState(() => {
                        return {
                            finished: true
                        }
                    })
                })

            }
            else (response.json().then(result => console.log(result)))
        })
        .catch(err => console.log(err.message)) 
    }
    render() {
        return (
            <div className='signup-facebook-container'>
                { this.state.finished && <Redirect to='/'/>}
                <div className='signup-facebook'>
                    <div>
                        <h2>Sign up with Facebook</h2>
                    </div>
                    <hr style={{width: '300px'}}/>
                    {this.state.id &&
                    <div className='signup-facebook__fields'>
                        <div className='signup-facebook__fields-data'>
                            <h3>Name: {`${this.state.firstname} ${this.state.lastname}`}</h3>
                            <h3>Email: {this.state.email}</h3>
                        </div>
                        <form className='signup-facebook__fields-form' onSubmit={this.handleSignup}>
                            <input placeholder='Password' name='password'/>
                            <input placeholder='Phone number' name='phone'/>
                            Profile Picture: <input type='file' name='avatar' placeholder='Profile picture' />
                            <button>Submit</button>
                        </form>
                    </div>
                    }


                </div>

            </div>

        )
    }
}

const mapDispatchToProps = { setUser }

export default connect(null, mapDispatchToProps)(FacebookAuthV2)