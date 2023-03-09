import logo from "../assets/NEWS.png";
import "../styles.css";
import { Search } from 'react-bootstrap-icons'; 

const Header = () => {
    return (
        <div className="header-container">
            <div className="logo-container">
                <img className="logo" src={logo} alt="logo" />
                <div>What's Poppin'?</div>
            </div>
            <div className="search-container">
                <Search /> 
                <input className="search-post" type="text" placeholder="Search for a post"></input>
            </div>
            <div className="login-container">
                <button className="login-button">Sign up</button>
                <button className="login-button">Log In</button>
            </div>
            
        </div>
    )
}

export default Header;