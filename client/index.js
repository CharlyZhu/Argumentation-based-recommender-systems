import App from './src/views/App/app';
import {ItemPage} from './src/views/App/items';
import ReactDom from 'react-dom';
import React from 'react';
import store from './src/store';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./src/views/App/header";
let queryString = require('query-string');

class Index extends React.Component{
    constructor(props) {
        super(props);
        let displayMode = queryString.parse(location.search)?.mode;
        this.state = { originalMode: displayMode, mode: displayMode };
        this.setDisplayMode = this.setDisplayMode.bind(this);
    }

    componentDidMount() {
        //queryAccount(Cookies.get().uid, Cookies.get().token, account=>this.setState({ account }), ()=>{}).then(()=>{});
    }

    setDisplayMode(val) {
        this.setState({ mode: val });
    }

    render() {
        console.log(this.state);
        return (<Provider store={store}>
            <Header account={this.state.account} setDisplayMode={this.setDisplayMode} />
            <BrowserRouter>
                <Routes>
                    <Route path="/" exact element={<App mode={this.state.mode} account={this.state.account} />} />
                    <Route path="*" exact element={<ItemPage />} />
                </Routes>
            </BrowserRouter>
        </Provider>);
    }
}

ReactDom.render(<Index />, document.getElementById('root'));