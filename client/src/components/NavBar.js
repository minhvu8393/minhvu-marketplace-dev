import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { resetAllFilters } from '../actions/filter'
import { switchOpen, setComponent } from '../actions/modal';
import profilePicture from './profilepic.jpg';

const NavBar = (props) => {
    return (
            <div className='navbar'>
                <div className='navbar__item'>
                    <Link to='/'>                    
                    <h3 onClick={() => {
                        props.resetAllFilters();
                    }}>Home</h3></Link>
                </div>
                <div className='navbar__item'>
                    <h3 className='navbar__createpost' onClick={() => {
                        props.setComponent('CreatePost')
                        props.switchOpen(true)
                    }}>Create Post</h3>
                </div>
                <div className='navbar__item'>
                    {!props.user.name ?
                        <h3 onClick={() => {
                            props.setComponent('Login')
                            props.switchOpen(true)
                        }}>Login</h3>
                        :
                        <NavbarUser avatar={props.user.avatar} switchOpen={props.switchOpen} setComponent={props.setComponent}/>
                    }
                </div>
            </div>
    )
}

const NavbarUser = (props) => {
    const [showMenu, setShowMenu] = useState(false)
    const prevShowMenuRef = useRef();
    useEffect(() => {
        prevShowMenuRef.current = showMenu;
      });
    return (
        <div className='navbar__item-user'>
            <div onClick={() => {setShowMenu(!prevShowMenuRef.current)}} className='navbar__item-user__avatar'>
                <div className='navbar__item-user__avatar-avatar'>
                    {props.avatar ?
                        <img src={`data:image/jpeg;base64,${props.avatar}`}/>
                        :
                        <img src={profilePicture} />
                    }
                    
                </div>
            </div>
            {   showMenu &&
            <div className='navbar__item-user__menu'>
                <Link to='/userprofile'><h3 onClick={() => {setShowMenu(false)}}>User Profile</h3></Link>
                <h3 onClick={() => {
                    setShowMenu(false);
                    props.setComponent('CreatePost');
                    props.switchOpen(true);
                }}>Create Post</h3>
                <Link to='/logout'><h3>Log out</h3></Link>
            </div>
            }

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        filters: state.filters
    }
}

const mapDispatchToProps = { resetAllFilters, switchOpen, setComponent };

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);