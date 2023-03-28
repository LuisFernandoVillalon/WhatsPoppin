import logo from "../assets/NEWS.png";
import "../styles.css";
import { Search, PersonCircle, PersonFill, PencilSquare, BoxArrowLeft } from 'react-bootstrap-icons'; 
import { useNavigate } from "react-router-dom";
import { React, useState } from "react";
import useScrollBlock from "./useScrollBlock";
import SignUpForm from "./SignUpForm";
import LogInForm from "./LogInForm";

const Header = (props) => {
    const [blockScroll, useScroll] = useScrollBlock();
    const [accountMenuStatus, setAccountMenuStatus] = useState(false);

    const navigate = useNavigate();

    const homeRoute = () => {
            navigate("/");
    }
    const createPostRoute = () => {
        navigate("/create-post");
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

    const openMenu = () => {
        setAccountMenuStatus(true);
    }
    const closeMenu = () => {
        setAccountMenuStatus(false);
    }
    const logOut = () => {
        localStorage.setItem("loginStatus", false);
        localStorage.setItem("displayUserName", "");

        props.setDisplayUserName("");
        props.setLogInState(false);
    }
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
            {!props.logInState &&           <div className="login-container">
                                                <button className="login-button" onClick={() => signUp(props)}>Sign up</button>
                                                <button className="login-button" onClick={() => logIn(props)}>Log In</button>
                                            </div>
            }
            {props.logInState && <div className="profile-container" onClick={() => openMenu()}>
                                    <PersonFill />
                                    {accountMenuStatus && <div onMouseLeave={() => closeMenu()} className="account-menu-container">
                                                            <div className="menu-item"><PersonCircle/><div>{props.displayUserName}</div></div>
                                                            <div onClick={createPostRoute} className="menu-item"><PencilSquare/><div>Create Post</div></div>
                                                            <div onClick={() => logOut()} className="menu-item"><BoxArrowLeft/><div>Log Out</div></div>
                                                          </div>
                                    }
                                </div>}
            {/* <div className="login-container">
                <button className="login-button" onClick={() => signUp(props)}>Sign up</button>
                <button className="login-button" onClick={() => logIn(props)}>Log In</button>
            </div> */}
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


export default Header;