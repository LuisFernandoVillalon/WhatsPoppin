import logo from "../assets/NEWS.png";
import { X } from  'react-bootstrap-icons'; 

const SignUpForm = (props) => {

const antiCloseForm = (e) => {
        e.stopPropagation();
}

    props.blockScroll();
    return (
        <div className="black-coat" onClick={() => closeForm(props)}>
            <div className="logIn-Form" onClick={antiCloseForm}>
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