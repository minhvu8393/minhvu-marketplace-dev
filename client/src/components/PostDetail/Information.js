import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { IconContext } from "react-icons";
import noAvatar from '../profilepic.jpg';

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='postdetail__information'>
                <PostTitle title={this.props.title}/>
                <PostBy name={this.props.user.name} avatar={this.props.user.avatar}/>
                <PhoneNumber phoneNumber={this.props.user.phone}/>
                <PostDescription description={this.props.description} price={this.props.price}/>
            </div>

        )
    }
}

const PostTitle = (props) => {
    return (
        <div style={{color: 'white'}}>
            <h1>{props.title}</h1>
        </div>
    )
}

const PostBy = (props) => {
    return (
        <div className='information__postby'>
            <div style={{color: 'whitesmoke'}}>
                <h3>Post by: {props.name}</h3>
            </div>
            <div>
                {!props.avatar ?
                    <div>
                        <div className='information__avatar'>
                            <img className='information__avatar-avatar' src={noAvatar}/>
                        </div>
                    </div>
                    : 

                    <div className='information__avatar'>
                        <img className='information__avatar-avatar' src={`data:image/jpeg;base64,${props.avatar}`}/>
                    </div>

                }
            </div>
        </div>
    )
}

const PhoneNumber = (props) => {
    return (
        <div className='information__phonenumber'>
            <IconContext.Provider value={{color: 'white', size: '2em'}}>
                <div>
                    <FaPhoneAlt />
                </div>
            </IconContext.Provider>
            <h3 style={{color: 'white'}}>{props.phoneNumber}</h3>
        </div>
    )
}

const PostDescription = (props) => {
    return (
        <div className='information__postdescription'>
            <div>
                <h1>${props.price}</h1>
            </div>
            <div>
                <p>{props.description}</p>
            </div>
        </div>
    )
}

export default UserProfile;