import { BarChartFill, PencilSquare, Newspaper, Clock, CaretUpFill, CaretDownFill, ChatSquare, BoxArrowUpRight, Link45deg, LayoutTextSidebar } from 'react-bootstrap-icons'; 
import useScrollBlock from "./useScrollBlock";
import { useNavigate } from "react-router-dom";
import uniqid from 'uniqid';
import { useState, useEffect, useRef } from "react";
//import { upVotePostFirebase, downVotePostFirebase } from '../MessageBoardSample/firebaseData';
import { upVotePostFirebase, downVotePostFirebase, getRecords } from '../MessageBoardSample/firebaseData';

const HomeBoard = (props) => {
    const [blockScroll, useScroll] = useScrollBlock();
    
    const navigate = useNavigate();
    const createPostRoute = () => {
            navigate("/create-post");
    }

    useEffect(() => {
        const {setMasterBoard, setEntryMB, setVoteList} = props;
        getRecords({ setMasterBoard, setEntryMB, setVoteList});
    }, []);

    return (
        <div>
            {props.logInState && <div className='create-post-container'>
                                    <PencilSquare/>
                                    <input onClick={createPostRoute} className='create-post-input' type="text" placeholder='Create Post'/>
                                </div>
            }
            <div className="board-section-container">
                <div tabIndex="1" className="board-section" onClick={() => topBoard({props})}><BarChartFill/>Top</div>
                <div tabIndex="2" className="board-section" onClick={() => newBoard({props})}><Newspaper/>New</div>
                <div tabIndex="3" className="board-section" onClick={() => oldBoard({props})}><Clock/>Old</div>
            </div>
            <div className='hide-scroll'>
             <MessageBoard 
                props={props}
                blockScroll={blockScroll}
                useScroll={useScroll}
                key={uniqid()}
             />
             </div>
        </div>
    )
}

const backTop = () => {
    window.scrollTo(0, 0);
}

const MessageBoard = (props) => {

    let mB = props.props.masterBoard;
    // if (mB === null) {
    //     mB = [];
    // }
    if (!Array.isArray(mB)) {
        mB = Object.values(mB);
    }
    const boardList = mB.map((currentPost) => (
        <IndividualPost 
            currentPost={currentPost}
            props={props}
            key={uniqid()}
        />
))
    return (
        <>
            {boardList}
            <div className='backtop-button-container'><button className='backtop-button' onClick={() => backTop()}>BACK TO TOP</button></div>
        </>
    )
}

const IndividualPost = (props) => {
    const type = props.currentPost.type;
    if (type === "text") {
       return ( <TextPost props={props} key={uniqid()}/> )
    } else if (type === "image") {
        return ( <ImagePost props={props} key={uniqid()} /> )
    } else if (type === "link") {
        return ( <LinkPost props={props} key={uniqid()} /> )
    }
}

const directLink = (props) => {
    window.open(props);
}

const signUp = ({props}) => {
     props.props.setSignUp(true);
}
const antiCloseForm = (e) => {
    e.stopPropagation();
}
const upVotePost = (postVoteAmount, props) => {
     upVotePostFirebase(postVoteAmount + 1, props);
}
const downVotePost = (postVoteAmount, props) => {
    downVotePostFirebase(postVoteAmount - 1, props);
}

const TextPost = ({props}) => {
    let commentAmount = 0;
    if ( props.currentPost.comments === undefined) {
        commentAmount = 0;
    } else {
        commentAmount = props.currentPost.comments.length;
    }
    
    const navigate = useNavigate();

    const postRoute = (props) => {
        let temp = props.props.props;
        temp.setCurrentPost(props.currentPost);
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
             <div className='post-user'>Posted by {props.currentPost.user}<TimePosted props={props}/></div>
             <div className='post-title'>{props.currentPost.title}</div>
             <div className='post-comments'><ChatSquare /> {commentAmount} Comments</div>
        </div>
     </div>
    )
}
const ImagePost = ({props}) => {
    let commentAmount = 0;
    if (props.currentPost.comments[0] === "") {
        commentAmount = 0;
    } else {
        commentAmount = props.currentPost.comments.length;
    }
    const navigate = useNavigate();
    const postRoute = (props) => {
        let temp = props.props.props;
        temp.setCurrentPost(props.currentPost);
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
    }, []);

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
             <div className='post-user'>Posted by {props.currentPost.user}<TimePosted props={props} /></div>
             <div className='post-title'>{props.currentPost.title}</div>
             <img alt="post" src={props.currentPost.content} className="post-image"/>
             <div className='post-comments'><ChatSquare/> {commentAmount} Comments</div>
        </div>
     </div>
    )
}
const LinkPost = ({props}) => {
    let commentAmount = 0;
    if (props.currentPost.comments[0] === "") {
        commentAmount = 0;
    } else {
        commentAmount = props.currentPost.comments.length;
    }
    const navigate = useNavigate();
    const postRoute = (props) => {
        let temp = props.props.props;
        temp.setCurrentPost(props.currentPost);
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
    }, []);

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
                    <div className='post-user'>Posted by {props.currentPost.user}<TimePosted props={props}/></div>
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

const topBoard = ({props}) => {
    let firstTemp = props.masterBoard;
    
    if (firstTemp.sampleBoard) {
        firstTemp = firstTemp.sampleBoard;
    } 
    if (!Array.isArray(firstTemp)) {
       firstTemp = Object.values(firstTemp);
    }
    let temp = [...firstTemp];
    temp.sort((a, b) => {
        return b.voteAmount - a.voteAmount;
    });
    // props.masterBoard.sampleBoard = temp;
    props.setMasterBoard(temp);
}
const newBoard = ({props}) => {
    let firstTemp = props.masterBoard;
    if (firstTemp.sampleBoard) {
        firstTemp = firstTemp.sampleBoard;
    } 
    if (!Array.isArray(firstTemp)) {
        firstTemp = Object.values(firstTemp);
    }
    let temp = [...firstTemp];
    for (let i = 0; i < firstTemp.length; ++i) {
        if (firstTemp[i].timePosted === undefined) {
            break;
        } else {
            firstTemp[i].timePosted = firstTemp[i].timePosted.split('-').join('');
        }
    }
    temp.sort((a, b) => {
        return b.timePosted - a.timePosted;
    });
    let normal = [];
    let indvNormal = [];
    for (let i = 0; i < temp.length; ++i) {
        if (temp[i].timePosted === undefined) {
            break;
        }
        let tempDateArray = temp[i].timePosted.split('');
        for (let j = 0; j <= tempDateArray.length; ++j) {
            if ( j === 4 || j === 6 )  {
                normal.push("-");
            } else if ( j === 8 ) {
                indvNormal.push([...normal]);
                normal = [];
               break;
            }
            normal.push(tempDateArray[j]);
        }
    }    
    for (let i = 0; i < indvNormal.length; ++i) {
            temp[i].timePosted = indvNormal[i].join('');
    }
    //props.masterBoard.sampleBoard = temp;
    props.setMasterBoard(temp);
}
const oldBoard = ({props}) => {
    let firstTemp = props.masterBoard;
    if (firstTemp.sampleBoard) {
        firstTemp = firstTemp.sampleBoard;
    } 
    if (!Array.isArray(firstTemp)) {
        firstTemp = Object.values(firstTemp);
    }
    let temp = [...firstTemp];
    for (let i = 0; i < firstTemp.length; ++i) {
        if (firstTemp[i].timePosted === undefined) {
            break;
        } else {
            firstTemp[i].timePosted = firstTemp[i].timePosted.split('-').join('');
        }
    }
    temp.sort((a, b) => {
        return a.timePosted - b.timePosted;
    });
    let normal = [];
    let indvNormal = [];
    for (let i = 0; i < temp.length; ++i) {
        if (temp[i].timePosted === undefined) {
            break;
        }
        let tempDateArray = temp[i].timePosted.split('');
        for (let j = 0; j <= tempDateArray.length; ++j) {
            if ( j === 4 || j === 6 )  {
                normal.push("-");
            } else if ( j === 8 ) {
                indvNormal.push([...normal]);
                normal = [];
               break;
            }
            normal.push(tempDateArray[j]);
        }
    }    
    for (let i = 0; i < indvNormal.length; ++i) {
            temp[i].timePosted = indvNormal[i].join('');
    }
    //props.masterBoard.sampleBoard = temp;
    props.setMasterBoard(temp);
}

export const TimePosted = ({props}) => {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        let currDate =  [year, month, day].join('-');
        let postedDate = props.currentPost.timePosted;
        let timePosted = "";

        let currDateArray = currDate.split('');
        let postedDateArray = postedDate.split('');

        let currentDay = [];
        let postedDay = [];
        currentDay.push(currDateArray[8]);
        currentDay.push(currDateArray[9]);
        postedDay.push(postedDateArray[8]);
        postedDay.push(postedDateArray[9]);
        let tempCurrDay = currentDay.join('');
        let tempPostedDay = postedDay.join('');

        let currentMonth = [];
        let postedMonth = [];
        currentMonth.push(currDateArray[5]);
        currentMonth.push(currDateArray[6]);
        postedMonth.push(postedDateArray[5]);
        postedMonth.push(postedDateArray[6]);
        let tempCurrMonth = currentMonth.join('');
        let tempPostedMonth = postedMonth.join('');

        let currentYear = [];
        let postedYear = [];
        currentYear.push(currDateArray[0]);
        currentYear.push(currDateArray[1]);
        currentYear.push(currDateArray[2]);
        currentYear.push(currDateArray[3]);
        postedYear.push(postedDateArray[0]);
        postedYear.push(postedDateArray[1]);
        postedYear.push(postedDateArray[2]);
        postedYear.push(postedDateArray[3]);
        let tempCurrYear = currentYear.join('');
        let tempPostedYear = postedYear.join('');

        let numCurrDay = Number(tempCurrDay);
        let numPostedDay = Number(tempPostedDay);
        let numCurrMonth = Number(tempCurrMonth);
        let numPostedMonth = Number(tempPostedMonth);
        let numCurrYear = Number(tempCurrYear);
        let numPostedYear = Number(tempPostedYear);
        let getMonth = numPostedMonth - numCurrMonth;
        getMonth = Math.abs(getMonth);
        if (numCurrYear === numPostedYear) {
            if (numCurrMonth === numPostedMonth) {
                if (numCurrDay === numPostedDay) {
                    timePosted = "today";
                } else if (numPostedDay === numCurrDay - 1) {
                    timePosted = "1 day ago";
                } else if (numPostedDay === numCurrDay - 2) {
                    timePosted = "2 days ago";
                } else if (numPostedDay === numCurrDay - 3) {
                    timePosted = "3 days ago";
                } else if (numPostedDay === numCurrDay - 4) {
                    timePosted = "4 days ago";
                } else if (numPostedDay === numCurrDay - 5) {
                    timePosted = "5 days ago";
                } else if (numPostedDay === numCurrDay - 6) {
                    timePosted = "6 days ago";
                } else  {
                    timePosted = "Over a week ago";
                }
            } else {
                if (getMonth === 1) {
                    timePosted = getMonth + " month ago";
                } else {
                    timePosted = getMonth + " months ago";
                }
            }
        } else if (numPostedYear === numCurrYear - 1) {
            if (numCurrMonth === numPostedMonth) {
                timePosted = "1 year ago";
            } else if (numPostedMonth === numCurrMonth - 1  || numPostedMonth === numCurrMonth + 1) {
                timePosted = "11 months ago";
            } else if (numPostedMonth === numCurrMonth - 2  || numPostedMonth === numCurrMonth + 2) {
                timePosted = "10 months ago";
            } else if (numPostedMonth === numCurrMonth - 3  || numPostedMonth === numCurrMonth + 3) {
                timePosted = "9 months ago";
            } else if (numPostedMonth === numCurrMonth - 4  || numPostedMonth === numCurrMonth + 4) {
                timePosted = "8 months ago";
            } else if (numPostedMonth === numCurrMonth - 5  || numPostedMonth === numCurrMonth + 5) {
                timePosted = "7 months ago";
            } else if (numPostedMonth === numCurrMonth - 6  || numPostedMonth === numCurrMonth + 6) {
                timePosted = "6 months ago";
            } else if (numPostedMonth === numCurrMonth - 7  || numPostedMonth === numCurrMonth + 7) {
                timePosted = "5 months ago";
            } else if (numPostedMonth === numCurrMonth - 8  || numPostedMonth === numCurrMonth + 8) {
                timePosted = "4 months ago";
            } else if (numPostedMonth === numCurrMonth - 9  || numPostedMonth === numCurrMonth + 9) {
                timePosted = "3 months ago";
            } else if (numPostedMonth === numCurrMonth - 10 || numPostedMonth === numCurrMonth + 10 ) {
                timePosted = "2 months ago";
            } else if (numPostedMonth === numCurrMonth - 11 || numPostedMonth === numCurrMonth + 11) {
                timePosted = "1 month ago";
            }
        } else if (numPostedYear + 2 <= numCurrYear) {
            timePosted = "over 2 years ago"
        }
        
    return (
        <> {timePosted}</>
    )
}

export default HomeBoard;