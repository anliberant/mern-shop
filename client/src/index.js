import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import './index.css';
import { rootReducer } from './reducers';
import App from './App';

const store = createStore(rootReducer, composeWithDevTools());
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Provider store={store}>
		<React.StrictMode>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</React.StrictMode>
	</Provider>,
);
