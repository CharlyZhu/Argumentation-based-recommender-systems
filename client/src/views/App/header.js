import React from 'react';
import "../../style/header.scss";
import {BrowserRouter, Link} from "react-router-dom";

class Header extends React.Component {
    getAuthButton() {
        let account = this.props.account;
        let displayText = account ? `欢迎回来, ${account.name}` : "注册 / 登录";
        let clickCb = account ? ()=>{
            document.location = "/my";
        } : ()=>{
            this.props.setDisplayMode("auth");
            this.setState({toggle: false});
        };
        return <li className="link animated" onClick={clickCb}>
            <i className="fas fa-user-circle" /> {displayText}
        </li>
    }

    onMenuToggle() {
        if (this.state?.toggle) this.setState({toggle: false});
        else this.setState({toggle: true});
    }

    render() {
        return <header>
            <div className="elastic-container">
                <div id="branding" onClick={()=>this.gotoHomePage()}>
                    <h1><span className="highlight">Zmzaon</span><small>.co.uk</small></h1>
                </div>
                <nav className={`${this.state?.toggle ? "toggle" : ""}`}>
                    <BrowserRouter>
                        <ul className="animated"> </ul>
                    </BrowserRouter>

                    <div className="menu-button animated" onClick={()=>this.onMenuToggle()}>
                        <div className="line1 animated" />
                        <div className="line2 animated" />
                        <div className="line3 animated" />
                    </div>
                </nav>
            </div>
        </header>
    }
}
export default Header;
