import logo from "../assets/NEWS.png";
import "../styles.css";
import { Search } from 'react-bootstrap-icons'; 
import { useNavigate } from "react-router-dom";
import React from "react";
import useScrollBlock from "./useScrollBlock";
import { X } from  'react-bootstrap-icons'; 

const Header = (props) => {
    const [blockScroll, useScroll] = useScrollBlock();

    const navigate = useNavigate();

    const homeRoute = () => {
            navigate("/");
    }

    const handleChange = (e) => {
        e.preventDefault();
       props.setSearchInput(e.target.value);  

       if (e.target.value === "") {
        return props.setSearchResult([]);
       }

        const ans = props.masterBoard.filter((post) => {
            let a = post.title.toLowerCase();
            let b = props.searchInput.toLowerCase();
            return a.match(b);
        });

        props.setSearchResult(ans);

    };
    let temp = props.searchResult;

    const options = temp.map((post) => (
        <BarOptions 
            post={post}
            props={props}
        />
    ))

    
    return (
        <div className="header-container">
            <div className="logo-container" onClick={homeRoute}>
                <img className="logo" src={logo} alt="logo" />
                <div>What's Poppin'?</div>
            </div>
            <div className="search-options-container">
                <div className="search-container">
                    <Search /> 
                    <input className="search-post" type="text" 
                    placeholder="Search for a post" onChange={(e) => handleChange(e)} 

                    ></input>
                </div>
                 <div className="place-under-bar">{options}</div> 
            </div>
            <div className="login-container">
                <button className="login-button" onClick={() => signUp(props)}>Sign up</button>
                <button className="login-button" onClick={() => logIn(props)}>Log In</button>
            </div>
            {props.logIn && <LogInForm 
                blockScroll={blockScroll} 
                useScroll={useScroll}
                props={props}
            /> }
            {props.signUp && <SignUpForm 
                blockScroll={blockScroll} 
                useScroll={useScroll}
                props={props}
            /> }
        </div>
    )
}

const BarOptions = (props) => {
    const navigate = useNavigate();

    const postRoute = (props) => {
        console.log(props);
        props.props.setCurrentPost(props.post);
        props.props.setSearchResult([])
            navigate("/post");
    }
    return (
        
            <div className="search-options" onClick={() => postRoute(props)}>{props.post.title}</div>
        
    )
}

function logIn(props) {
    props.setLogIn(true);
}
function signUp(props) {
    props.setSignUp(true);
}

function closeForm(props) {
    props.props.setLogIn(false);
    props.props.setSignUp(false);
    props.useScroll();
}
function switchToSignUpForm(props) {
    props.props.setLogIn(false);
    props.props.setSignUp(true);
}
function switchToLogInForm(props) {
    props.props.setSignUp(false);
    props.props.setLogIn(true);
}
const LogInForm = (props) => {
    props.blockScroll();
    return (
        <div className="black-coat">
            <div className="logIn-Form">
            <img className="logo-form" src={logo} alt="logo" onClick={() => closeForm(props)} />
                <div className="close-form" onClick={() => closeForm(props)}>< X /></div>
                <h4>Log In</h4>
                <div className="input-form-container">
                    <input className="input-form" type="email" placeholder="Email"/>
                    <input className="input-form" type="password" placeholder="Password" />
                    <button className="login-button-form">Log In</button>
                    <p className="small-text-form">Don't have an account? <p className="small-text-form-blue"
                        onClick={() => {switchToSignUpForm(props)}}
                    >SIGN UP</p></p>
                </div>
            </div>
        </div>
    )
}

const SignUpForm = (props) => {
    props.blockScroll();
    return (
        <div className="black-coat">
            <div className="logIn-Form">
            <img className="logo-form" src={logo} alt="logo" onClick={() => closeForm(props)} />
                <div className="close-form" onClick={() => closeForm(props)}>< X /></div>
                <h5>Post, vote, and comment with the world.<br></br>Create an account today!</h5>
                <div className="input-form-container">
                <input className="input-form" type="email" placeholder="Username"/>
                    <input className="input-form" type="email" placeholder="Email"/>
                    <input className="input-form" type="password" placeholder="Password" />
                    <button className="login-button-form">Sign Up</button>
                    <p className="small-text-form">Already have an account? <p className="small-text-form-blue"
                        onClick={() => {switchToLogInForm(props)}}
                    >LOG IN</p></p>
                </div>
            </div>
        </div>
    )
}

export default Header;