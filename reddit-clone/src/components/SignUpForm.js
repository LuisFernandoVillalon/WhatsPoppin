import logo from "../assets/NEWS.png";
import { X } from  'react-bootstrap-icons'; 
import { addNewUser } from "../MessageBoardSample/firebaseData";
import { useRef } from 'react';

const SignUpForm = (props) => {

    const usernameRef = useRef(undefined);
    const emailRef = useRef(undefined);
    const passwordRef = useRef(undefined);
    const confirmpasswordRef = useRef(undefined);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const username = usernameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const confirmpassword = confirmpasswordRef.current.value;

        if (password !== confirmpassword) {
            window.alert("Password does not match.");
            return;
        } else {
            const user = await addNewUser(email, password, username);

            localStorage.setItem("loginStatus", true);
            localStorage.setItem("currentUser", username);
            localStorage.setItem("currentUserUID", user.uid);
            props.props.setDisplayUserName(username);
            props.props.setLogInState(localStorage.getItem("loginStatus"));
            props.props.setLogIn(false);
            props.props.setSignUp(false);
            props.props.setCurrentUserUID(user);
            props.useScroll();
            event.target.reset();
        }

    } 

const antiCloseForm = (e) => {
        e.stopPropagation();
}

    props.blockScroll();
    return (
        <div className="black-coat" onClick={() => closeForm(props)}>
            <form onSubmit={handleSubmit}>
                <div className="logIn-Form" onClick={antiCloseForm}>
                        <img className="logo-form" src={logo} alt="logo" onClick={() => closeForm(props)} />
                        <div className="close-form" onClick={() => closeForm(props)}>< X /></div>
                        <h5>Post, vote, and comment with the world.<br></br>Create an account today!</h5>
                        <div className="input-form-container">
                        <input className="input-form" minLength="3" id="username" name="username" type="text" ref={usernameRef} placeholder="Username" required/>
                        <input className="input-form"  id="email" name="email" type="email" ref={emailRef} placeholder="Email" required/>
                        <input className="input-form" minLength="6"  alphabet="A-Za-z0-9+_%@!$*~-" 
                            requiredclasses="[A-Z] [a-z] [0-9] [+_%@!$*~-]" requiredclasscount="3" id="password" name="password" 
                            type="password" ref={passwordRef} placeholder="Password" required/>
                        <input className="input-form" id="confirmpassword" name="confirmpassword" type="password" ref={confirmpasswordRef} 
                                placeholder="Confirm password" required/>
                        <button className="login-button-form" type="submit">Sign Up</button>
                        <p className="small-text-form">Already have an account? <p className="small-text-form-blue"
                                onClick={() => {switchToLogInForm(props)}}
                        >LOG IN</p></p>
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

function switchToLogInForm(props) {
    props.props.setSignUp(false);
    props.props.setLogIn(true);
}

export default SignUpForm;