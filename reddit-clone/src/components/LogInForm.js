import logo from "../assets/NEWS.png";
import { X } from  'react-bootstrap-icons'; 
import { useRef } from 'react';
import { logInUser } from "../MessageBoardSample/firebaseData";

const LogInForm = (props) => {
    props.blockScroll();

    const emailRef = useRef(undefined);
    const passwordRef = useRef(undefined);

    const handleSubmit =  async (event) => {
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
        // const ogProps = props.props;
        //     let upVoteListArray = Object.entries(ogProps.upVoteList);
        //     upVoteListArray.map((user) => {
        //         if (user[0] === ogProps.currentUserUID) {
        //             let userArray = Object.entries(user[1]);
        //             userArray.map((likedPost) => {
        //                 if (props.currentPost.newUserKey === likedPost[0]) {
        //                 ogProps.setUpVoteStatus(true);
        //                 }
                        
        //             })
        //         }
        //     });
        // let downVoteListArray = Object.entries(ogProps.downVoteList);
        // downVoteListArray.map((user) => {
        //     if (user[0] === ogProps.currentUserUID) {
        //         let userArray = Object.entries(user[1]);
        //         userArray.map((unLikedPost) => {
        //             if (props.currentPost.newUserKey === unLikedPost[0]) {
        //                ogProps.setDownVoteStatus(true);
        //             }
                    
        //         })
        //     }
        // });
        // console.log(ogProps.upVoteStatus)
        
        props.useScroll();
        event.target.reset();
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
                        <p className="small-text-form">Don't have an account? <p className="small-text-form-blue"
                            onClick={() => {switchToSignUpForm(props)}}
                        >SIGN UP</p></p>
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