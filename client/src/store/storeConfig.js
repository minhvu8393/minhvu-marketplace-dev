import { createStore, combineReducers } from 'redux';
import postReducer from '../reducers/post';
import userReducer from '../reducers/user';
import filterReducer from '../reducers/filter';
import modalReducer from '../reducers/modal';
import errorReducer from '../reducers/error';

export default createStore(
    combineReducers({
        posts: postReducer,
        user: userReducer,
        filters: filterReducer,
        modal: modalReducer,
        error: errorReducer,
    })
);