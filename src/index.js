import React from 'react';
import ReactDOM from 'react-dom';
import 'react-datepicker/dist/react-datepicker.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker.js';
import store from './store';
import Provider from 'react-redux/lib/components/Provider';
// import 'css/App.css';
// import 'css/test.css';

ReactDOM.render(
        <Provider store={store}>
                <App/>
        </Provider>
, document.getElementById('root'));

registerServiceWorker();
