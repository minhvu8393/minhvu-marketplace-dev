import React from 'react';
import { connect } from 'react-redux';
import profilePic from './profilepic.jpg';
import { FaPhoneAlt } from 'react-icons/fa';
import { IconContext } from "react-icons";
import RelativePost from './RelativePosts';


class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpdateAvatar = this.handleUpdateAvatar.bind(this);
    }
    handleUpdateAvatar(e) {

    }
    render() {
        return (
            <div className='userprofile-container'>
                <div className='userprofile'>
                    <div className='userprofile__profile'>
                        <UserAvatar avatar={this.props.user.avatar} handleUpdateAvatar={this.handleUpdateAvatar}/>
                        <UserInfo name={this.props.user.name} phoneNumber={this.props.user.phone}/>
                    </div>
                    <div className='userprofile__myposts'>
                        <MyPost />
                    </div>
                </div>
            </div>
        )
    }
}

const UserAvatar = (props) => {
    return (
        <div className='userprofile__profile__avatar'>
            <div className='userprofile__profile__avatar-avatar'>
                {
                    props.avatar ?
                    <div className='userprofile__profile__avatar-avatar__image'>
                        <img src={`data:image/jpeg;base64,${props.avatar}`}/>
                    </div>
                    :
                    <div className='userprofile__profile__avatar-avatar__image'>
                        <img src={profilePic}/>
                    </div>
                }
            </div>
        </div>
    )
}

const UserInfo = (props) => {
    return (
        <div className='userprofile__profile__info'>
            <div className='userprofile__profile__info-info'>
                <h1>{props.name}</h1>
            </div>
            <div className='userprofile__profile__info-changeinfo'>
                <div className='userprofile__profile__info-info__phonenumber'>
                    <IconContext.Provider value={{color: 'white', size: '2em'}}>
                        <div>
                            <FaPhoneAlt />
                        </div>
                    </IconContext.Provider>
                    <h3 style={{color: 'white'}}>{props.phoneNumber}</h3>
                </div>
            </div>
        </div>
    )
}

class MyPost extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: []
        }
    }
    componentDidMount() {
        fetch('/api/mypost')
        .then(response => response.json())
        .then(result => {
            this.setState(() => {
                return {
                    posts: result
                } 
            })
        })
    }
    render() {
        return (
            <div>
                {
                    this.state.posts.length > 0 &&
                    <div className='userprofile__myposts__posts'>
                        {this.state.posts.map((post, index) => {
                            return <RelativePost key={index} post={post}/>
                        })}
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);