import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React from 'react';
import HomePage from '../components/HomePage/HomePage';
import Login from '../components/Login/Login';
import Signup from '../components/Signup';
import CreatePost from '../components/CreatePost/CreatePostV2';
import Logout from '../components/Logout';
import ModalContainer from '../components/ModalContainer';
import Filters from '../components/Filters/Filters';
import Banner from '../components/Banner';
import FiltersV2 from '../components/Filters-v2/Filters-v2';
import FacebookAuth from '../components/FacebookAuth-v2';
import TestUpload from '../components/TestUpload';
import BannerAndFilter from '../components/BannerAndFilter';
import UserProfile from '../components/UserProfile';

import Header from '../components/Header';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';

import { setUser } from '../actions/user';
import { connect } from 'react-redux';

class AppRouter extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        fetch('/api/user')
        .then(response => {
            if (response.status === 200) {
                response.json()
                .then(result => {
                  this.props.setUser(result)
                })
            } else {
                return console.log();
            }
        })
    }
    render() {
        return (
            <div>
                    <div>
                        <BrowserRouter>
                            <div>
                                <ModalContainer />
                            </div>
                            <div className='header-background'>
                                <div className='container'>
                                    <div className='flex-container-header'>
                                        <Header />
                                        <Navbar />
                                    </div>
                                    <div className='banner'>
                                        <BannerAndFilter />
                                    </div>
                                </div>
                            </div>
                            <div className='body-background'>
                                <div className='container-body'>
                                    <SearchBar />
                                    <Switch>
                                        <Route path='/' component={HomePage} exact={true}/>
                                        <Route path='/login' component={Login}/>
                                        <Route path='/signup' component={Signup}/>
                                        <Route path='/create' component={CreatePost} />
                                        <Route path='/facebookauth' component={FacebookAuth} />
                                        <Route path='/logout' component={Logout} />
                                        <Route path='/test' component={TestUpload} />
                                        <Route path='/userprofile' component={UserProfile}/>
                                    </Switch>
                                </div>
                            </div>
 
                        </BrowserRouter>
                    </div>  
            </div>

        )
    }
}

const setStateToProps = (state) => {
    return {
        user: state.user
    }
}

const setDispatchToProps = { setUser };

export default connect(setStateToProps, setDispatchToProps)(AppRouter);