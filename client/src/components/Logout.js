import React from 'react';
import { Redirect } from 'react-router-dom'
import  { connect } from 'react-redux';
import { setUser } from '../actions/user';

class Logout extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        fetch('/api/user/logout', {
            method: 'POST'
        })
        .then(response => {
            if (response.status === 200) {
                this.props.setUser({});
            }
        })
    }
    render() {
        return (
            <div>
                <Redirect to='/'/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = { setUser };

export default connect(mapStateToProps, mapDispatchToProps)(Logout);