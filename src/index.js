import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore,combineReducers, applyMiddleware, compose} from 'redux';
 
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import urunlerReducer from './store/reducers/urunler';
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';
import 'bootstrap/dist/css/bootstrap.min.css';


import thunk from 'redux-thunk';

const composeEnhancers = process.env.NODE_ENV==='development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;
const rootReducer = combineReducers({
    urunler:urunlerReducer,
    orders:orderReducer,
    auth:authReducer
});

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider> 
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
