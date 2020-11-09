import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import AppRouter from './routers/AppRouters';
import store from './store/storeConfig';
import { Provider } from 'react-redux';


const appRoot = document.getElementById('app');

console.log(store.getState());

store.subscribe(() => {
    console.log(store.getState());
})

const jsx = <Provider store={store}><AppRouter /></Provider>

ReactDOM.render(jsx, appRoot);