import logo from "../assets/NEWS.png";
import { X } from  'react-bootstrap-icons'; 

const LogInForm = (props) => {
    props.blockScroll();

    const antiCloseForm = (e) => {
        e.stopPropagation();
}

    return (
        <div className="black-coat" onClick={() => closeForm(props)}>
            <div className="logIn-Form" onClick={antiCloseForm}>
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