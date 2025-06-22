import logo from "../assets/NEWS.png";
import { X } from  'react-bootstrap-icons';
import { useRef } from 'react';
import { logInUser } from "../firebase-data/StartUpData";

const LogInForm = (props) => {
    props.blockScroll();
    
    const emailRef = useRef(undefined);
    const passwordRef = useRef(undefined);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const email = emailRef.current.value
        const password = passwordRef.current.value;
        
        const user = await logInUser(email, password);
        localStorage.setItem("currentUserUID", user.uid);
        localStorage.setItem("loginStatus", true);
        localStorage.setItem("currentUser", user.displayName);
        
        props.props.setDisplayUserName(localStorage.getItem("currentUser"));
        props.props.setLogInState(localStorage.getItem("loginStatus"));
        props.props.setLogIn(false);
        props.props.setSignUp(false);
        props.props.setCurrentUserUID(user);
        props.useScroll();
        
        props.props.setMasterBoard(props.props.masterBoard)
        props.props.setVoteList(props.props.voteList)
        
        event.target.reset();
    }
    
    const handleTestLogin = async (event) => {
        event.preventDefault();
        
        // Fill in test credentials
        emailRef.current.value = "test_user_001@email.com";
        passwordRef.current.value = "password123";
        
        // Trigger the login
        const user = await logInUser("test_user_001@email.com", "password123");
        localStorage.setItem("currentUserUID", user.uid);
        localStorage.setItem("loginStatus", true);
        localStorage.setItem("currentUser", user.displayName);
        
        props.props.setDisplayUserName(localStorage.getItem("currentUser"));
        props.props.setLogInState(localStorage.getItem("loginStatus"));
        props.props.setLogIn(false);
        props.props.setSignUp(false);
        props.props.setCurrentUserUID(user);
        props.useScroll();
        
        props.props.setMasterBoard(props.props.masterBoard)
        props.props.setVoteList(props.props.voteList)
    }
    
    const antiCloseForm = (e) => {
        e.stopPropagation();
    }
    
    return (
        <div className="black-coat" onClick={() => closeForm(props)}>
            <form onSubmit={handleSubmit}>
                <div className="logIn-Form" onClick={antiCloseForm}>
                    <img className="logo-form" src={logo} alt="logo" onClick={() => closeForm(props)} />
                    <div className="close-form" onClick={() => closeForm(props)}>< X /></div>
                    <h4>Log In</h4>
                    <div className="input-form-container">
                        <input className="input-form" ref={emailRef} type="email" placeholder="Email"/>
                        <input className="input-form" ref={passwordRef} type="password" placeholder="Password" />
                        <button className="login-button-form">Log In</button>
                        <button 
                            type="button" 
                            className="login-button-form"
                            onClick={handleTestLogin}
                        >
                            Login w/ a Guest Account
                        </button>
                        <p className="small-text-form">
                            Don't have an account? 
                            <p className="small-text-form-blue" onClick={() => {switchToSignUpForm(props)}}>
                                SIGN UP
                            </p>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    )
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

export default LogInForm;