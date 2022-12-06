// import { createRoot } from "react-dom/client";
// import App from "./App";
import ReactDom from 'react-dom';
import React from 'react';
// 這支 CSS 檔的樣式會作用到全域
import './styles.css';
import App from './App';
// import * as serviceWorker from './';

const rootElement = document.getElementById('root');
// const root = createRoot(rootElement);

ReactDom.render(<App />, rootElement);

// serviceWorker.register();
