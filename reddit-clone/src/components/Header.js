import logo from "../assets/NEWS.png";
import "../styles.css";
import { Search } from 'react-bootstrap-icons'; 
import { useNavigate } from "react-router-dom";
import React from "react";

const Header = (props) => {

    const navigate = useNavigate();

    const homeRoute = () => {
            navigate("/");
    }

    const handleChange = (e) => {
        e.preventDefault();
        console.log(e.target.value)
       props.setSearchInput(e.target.value);  
    };
    if (props.searchInput.length > 0) {
        const ans = props.masterBoard.filter((post) => {
            return post.title.match(props.searchInput);
        });
        console.log(ans);    
    }


    return (
        <div className="header-container">
            <div className="logo-container" onClick={homeRoute}>
                <img className="logo" src={logo} alt="logo" />
                <div>What's Poppin'?</div>
            </div>
            <div className="search-container">
                <Search /> 
                <input className="search-post" type="text" 
                placeholder="Search for a post" onChange={(e) => handleChange(e)} 

                ></input>
            </div>
            <div className="login-container">
                <button className="login-button">Sign up</button>
                <button className="login-button">Log In</button>
            </div>
            
        </div>
    )
}

export default Header;