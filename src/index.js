import ReactDOM from 'react-dom/client';
import React from 'react';
// 這支 CSS 檔的樣式會作用到全域
import './styles.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);

serviceWorkerRegistration.register();
