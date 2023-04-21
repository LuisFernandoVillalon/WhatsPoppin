import {  CaretUpFill, CaretDownFill, ChatSquare, BoxArrowUpRight, Link45deg } from 'react-bootstrap-icons'; 
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { upVotePostFirebase, downVotePostFirebase } from '../firebase-data/PostData';
import TimePosted from '../utilities/TimePosted';

const directLink = (props) => {
    window.open(props);
}
const signUp = ({props}) => {
    const {setSignUp} = props.props;
    setSignUp(true);
}
const antiCloseForm = (e) => {
    e.stopPropagation();
}
const upVotePost = (postVoteAmount, props) => {
    const { currentUserUID, setVoteList, masterBoard, setMasterBoard} = props.props.props;
    const {currentPost} = props;
     upVotePostFirebase(postVoteAmount + 1, { currentPost, currentUserUID, setVoteList, masterBoard, setMasterBoard });
}
const downVotePost = (postVoteAmount, props) => {
    const { currentUserUID, setVoteList, masterBoard, setMasterBoard} = props.props.props;
    const {currentPost} = props;
    downVotePostFirebase(postVoteAmount - 1, { currentPost, currentUserUID, setVoteList, masterBoard, setMasterBoard});
}

export const TextPost = ({props}) => {
    const {currentPost} = props;
    let commentAmount = 0;
    if ( currentPost.comments === undefined) {
        commentAmount = 0;
    } else {
        commentAmount = currentPost.comments.length;
    }
    
    const navigate = useNavigate();

    const postRoute = (props) => {
        const {setCurrentPost} = props.props.props;
        setCurrentPost(currentPost);
        navigate("/post");
    }
    const ogProps = props.props.props;
    const [postVoteAmount, setPostVoteAmount] = useState(0);
    const [downVoteStatus, setDownVoteStatus] = useState(false);
    const [upVoteStatus, setUpVoteStatus] = useState(false);

    useEffect(() => {
        setPostVoteAmount(currentPost.voteAmount);
        let voteListArray = Object.entries(ogProps.voteList);
        voteListArray.map((user) => {
             if (user[1].currentUser === ogProps.currentUserUID.uid || user[1].currentUser === ogProps.currentUserUID) {
                if (user[1].post === undefined || user[1].post === null) {
                    return;
                } else {
                    let userArray = Object.entries(user[1].post);
                    userArray.map((post) => {
                        if (currentPost.id === post[1].currentPostID) {
                            setUpVoteStatus(post[1].upVoteState);
                            setDownVoteStatus(post[1].downVoteState);
                        }
                    })
                } 
            }
        })
    }, [upVoteStatus, downVoteStatus]);
    return (
        <div className="individual-post"  onClick={() => postRoute(props)}>
            {!ogProps.logInState && <div className="first-column" onClick={antiCloseForm}>
                                        <CaretUpFill className='upArrow' onClick={() => signUp(props)}/>
                                            {postVoteAmount}
                                        <CaretDownFill className='downArrow' onClick={() => signUp(props)} />
                                    </div> 
            }
            {ogProps.logInState && <div className="first-column" onClick={antiCloseForm}>
                                        {upVoteStatus ? <CaretUpFill className='upArrowActive'/> : <CaretUpFill  onClick={() => upVotePost(postVoteAmount, props)} className='upArrow'/>}                                                                                                        
                                            {postVoteAmount}
                                        {downVoteStatus ? <CaretDownFill className='downArrowActive'/> : <CaretDownFill onClick={() => downVotePost(postVoteAmount, props)} className='downArrow'/>}                                                                                                             
                                    </div> 
            }
        <div className="second-column">
             <div className='post-user'>Posted by {props.currentPost.user}<TimePosted currentPost={currentPost}/></div>
             <div className='post-title'>{props.currentPost.title}</div>
             <div className='post-comments'><ChatSquare /> {commentAmount} Comments</div>
        </div>
     </div>
    )
}
export const ImagePost = ({props}) => {
    let commentAmount = 0;
    if (props.currentPost.comments[0] === "") {
        commentAmount = 0;
    } else {
        commentAmount = props.currentPost.comments.length;
    }
    const navigate = useNavigate();
    const postRoute = (props) => {
        const {setCurrentPost} = props.props.props;
        setCurrentPost(props.currentPost);
        navigate("/post");
    }
    const ogProps = props.props.props;
    const [postVoteAmount, setPostVoteAmount] = useState(0);
    const [downVoteStatus, setDownVoteStatus] = useState(false);
    const [upVoteStatus, setUpVoteStatus] = useState(false);

    useEffect(() => {
        setPostVoteAmount(props.currentPost.voteAmount);
        let voteListArray = Object.entries(ogProps.voteList);
        voteListArray.map((user) => {
             if (user[1].currentUser === ogProps.currentUserUID.uid || user[1].currentUser === ogProps.currentUserUID) {
                if (user[1].post === undefined || user[1].post === null) {
                    return;
                } else {
                    let userArray = Object.entries(user[1].post);
                    userArray.map((post) => {
                        if (props.currentPost.id === post[1].currentPostID) {
                            setUpVoteStatus(post[1].upVoteState);
                            setDownVoteStatus(post[1].downVoteState);
                        }
                    })
                } 
            }
        })
    }, [upVoteStatus, downVoteStatus]);
const {currentPost} = props;
    return (
        <div className="individual-post" onClick={() => postRoute(props)}>
            {!ogProps.logInState && <div className="first-column" onClick={antiCloseForm}>
                                            <CaretUpFill className='upArrow' onClick={() => signUp(props)}/>
                                            {postVoteAmount}
                                            <CaretDownFill className='downArrow' onClick={() => signUp(props)} />
                                    </div> 
            }
            {ogProps.logInState && <div className="first-column" onClick={antiCloseForm}>
                                        {upVoteStatus ? <CaretUpFill className='upArrowActive'/> : <CaretUpFill  onClick={() => upVotePost(postVoteAmount, props)} className='upArrow'/>}                                                                                                        
                                            {postVoteAmount}
                                        {downVoteStatus ? <CaretDownFill className='downArrowActive'/> : <CaretDownFill onClick={() => downVotePost(postVoteAmount, props)} className='downArrow'/>}                                                                                                             
                                    </div>  
            }
        <div className="second-column">
             <div className='post-user'>Posted by {props.currentPost.user}<TimePosted currentPost={currentPost}/></div>
             <div className='post-title'>{props.currentPost.title}</div>
             <img alt="post" src={props.currentPost.content} className="post-image"/>
             <div className='post-comments'><ChatSquare/> {commentAmount} Comments</div>
        </div>
     </div>
    )
}
export const LinkPost = ({props}) => {
    let commentAmount = 0;
    if (props.currentPost.comments[0] === "") {
        commentAmount = 0;
    } else {
        commentAmount = props.currentPost.comments.length;
    }
    const navigate = useNavigate();
    const postRoute = (props) => {
        const {setCurrentPost} = props.props.props;
        setCurrentPost(props.currentPost);
        navigate("/post");
    }
    const ogProps = props.props.props;
    const [postVoteAmount, setPostVoteAmount] = useState(0);
    const [downVoteStatus, setDownVoteStatus] = useState(false);
    const [upVoteStatus, setUpVoteStatus] = useState(false);

    useEffect(() => {
        setPostVoteAmount(props.currentPost.voteAmount);
        let voteListArray = Object.entries(ogProps.voteList);
        voteListArray.map((user) => {
             if (user[1].currentUser === ogProps.currentUserUID.uid || user[1].currentUser === ogProps.currentUserUID) {
                if (user[1].post === undefined || user[1].post === null) {
                    return;
                } else {
                    let userArray = Object.entries(user[1].post);
                    userArray.map((post) => {
                        if (props.currentPost.id === post[1].currentPostID) {
                            setUpVoteStatus(post[1].upVoteState);
                            setDownVoteStatus(post[1].downVoteState);
                        }
                    })
                } 
            }
        })
    }, [upVoteStatus, downVoteStatus]);
const {currentPost} = props;
     let temp = props.currentPost.title;
     let tempLink = props.currentPost.content;
     let tempArr = temp.split('');
     let tempArrLink = tempLink.split('');
     let truncated = [];
     let truncatedLink = [];
     for (let i = 0; i <= 40; ++i) {
         truncated.push(tempArr[i]);
         truncatedLink.push(tempArrLink[i]);
     }
     truncated.push("...");
     truncated.toString('');
     truncatedLink.push("...");
     truncatedLink.toString('');
    
    return (
        <div className="individual-post-link"  onClick={() => postRoute(props)}>
            {!ogProps.logInState && <div className="first-column" onClick={antiCloseForm}>
                                        <CaretUpFill className='upArrow' onClick={() => signUp(props)}/>
                                        {postVoteAmount}
                                        <CaretDownFill className='downArrow' onClick={() => signUp(props)} />
                                    </div> 
            }
            {ogProps.logInState &&  <div className="first-column" onClick={antiCloseForm}>
                                        {upVoteStatus ? <CaretUpFill className='upArrowActive'/> : <CaretUpFill  onClick={() => upVotePost(postVoteAmount, props)} className='upArrow'/>}                                                                                                        
                                            {postVoteAmount}
                                        {downVoteStatus ? <CaretDownFill className='downArrowActive'/> : <CaretDownFill onClick={() => downVotePost(postVoteAmount, props)} className='downArrow'/>}                                                                                                             
                                    </div> 
            }
            
            <div className="second-column">
                    <div className='post-user'>Posted by {props.currentPost.user}<TimePosted currentPost={currentPost}/></div>
                    <div className='post-title-link'>{truncated}</div>
                    <a  rel="noreferrer" target="_blank" className='post-link' href={props.currentPost.content}>{truncatedLink}<BoxArrowUpRight/></a>
                    <div className='post-comments'><ChatSquare /> {commentAmount} Comments</div>
            </div>

            <div onClick={() => directLink(props.currentPost.content)} className='link-square'>
                <div className='chain-in-square'>
                    <Link45deg/>
                </div>
                <div className='link-in-box-container'>
                    <div className='link-in-box'>
                        <BoxArrowUpRight/>
                    </div>
                </div>
            </div> 

        </div>
    )
}