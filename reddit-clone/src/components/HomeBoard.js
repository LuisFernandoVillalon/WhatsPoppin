import { BarChartFill, Newspaper, Clock, ArrowUp, ArrowDown, ChatSquare, BoxArrowUpRight, Link45deg } from 'react-bootstrap-icons'; 
import { getRecords } from '../MessageBoardSample/firebaseData';
import { useState, useEffect } from "react";


const HomeBoard = () => {
    const [masterBoard, setMasterBoard] = useState([]);
    useEffect(() => {
        getRecords({setMasterBoard});
    }, [])
    return (
        <>
            <div className="board-section-container">
                <div tabIndex="1" className="board-section" onClick={() => topBoard({masterBoard, setMasterBoard})}><BarChartFill/>Top</div>
                <div tabIndex="2" className="board-section" onClick={() => newBoard({masterBoard, setMasterBoard})}><Newspaper/>New</div>
                <div tabIndex="3" className="board-section" onClick={() => oldBoard({masterBoard, setMasterBoard})}><Clock/>Old</div>
            </div>
             <MessageBoard 
                masterBoard={masterBoard}
             />
        </>
    )
}

const backTop = () => {
    window.scrollTo(0, 0);
}

const MessageBoard = ({masterBoard}) => {
    const boardList = masterBoard.map((currentPost) => (
        <IndividualPost 
            currentPost={currentPost}
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
       return ( <TextPost props={props} /> )
    } else if (type === "image") {
        return ( <ImagePost props={props} /> )
    } else if (type === "link") {
        return ( <LinkPost props={props} /> )
    }
}

const directLink = (props) => {
    window.open(props);
}

const TextPost = ({props}) => {
    return (
        <div className="individual-post">
        <div className="first-column">
             <ArrowUp className='upArrow'/>
             {props.currentPost.voteAmount}
             <ArrowDown className='downArrow'/>
        </div>
        <div className="second-column">
             <div className='post-user'>Posted by {props.currentPost.user}<TimePosted props={props}/></div>
             <div className='post-title'>{props.currentPost.title}</div>
             <div className='post-comments'><ChatSquare /> {props.currentPost.comments} Comments</div>
        </div>
     </div>
    )
}
const ImagePost = ({props}) => {
    return (
        <div className="individual-post">
        <div className="first-column">
             <ArrowUp className='upArrow'/>
             {props.currentPost.voteAmount}
             <ArrowDown className='downArrow'/>
        </div>
        <div className="second-column">
             <div className='post-user'>Posted by {props.currentPost.user}<TimePosted props={props}/></div>
             <div className='post-title'>{props.currentPost.title}</div>
             <img src={props.currentPost.content} className="post-image"/>
             <div className='post-comments'><ChatSquare /> {props.currentPost.comments} Comments</div>
        </div>
     </div>
    )
}
const LinkPost = ({props}) => {
     let temp = props.currentPost.title;
      let tempArr = temp.split('');
     let truncated = [];
     for (let i = 0; i <= 40; ++i) {
         truncated.push(tempArr[i]);
     }
     truncated.push("...");
     truncated.toString('');
    
    return (
        <div className="individual-post-link">
            <div className="first-column">
                <ArrowUp className='upArrow'/>
                {props.currentPost.voteAmount}
                <ArrowDown className='downArrow'/>
            </div>
            
            <div className="second-column">
                    <div className='post-user'>Posted by {props.currentPost.user}<TimePosted props={props}/></div>
                    <div className='post-title-link'>{truncated}</div>
                    <a  target="_blank" className='post-link' href={props.currentPost.content}>{props.currentPost.content}<BoxArrowUpRight/></a>
                    <div className='post-comments'><ChatSquare /> {props.currentPost.comments} Comments</div>
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

const topBoard = ({masterBoard, setMasterBoard}) => {
    let temp = [...masterBoard];
    temp.sort((a, b) => {
        return b.voteAmount - a.voteAmount;
    });
    setMasterBoard(temp);
}
const newBoard = ({masterBoard, setMasterBoard}) => {
    let temp = [...masterBoard];
    for (let i = 0; i < masterBoard.length; ++i) {
        masterBoard[i].timePosted = masterBoard[i].timePosted.split('-').join('');
    }
    temp.sort((a, b) => {
        return b.timePosted - a.timePosted;
    });
    let normal = [];
    let indvNormal = [];
    for (let i = 0; i < temp.length; ++i) {
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
      setMasterBoard(temp);
}
const oldBoard = ({masterBoard, setMasterBoard}) => {
    let temp = [...masterBoard];
    for (let i = 0; i < masterBoard.length; ++i) {
        masterBoard[i].timePosted = masterBoard[i].timePosted.split('-').join('');
    }
    temp.sort((a, b) => {
        return a.timePosted - b.timePosted;
    });
    let normal = [];
    let indvNormal = [];
    for (let i = 0; i < temp.length; ++i) {
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
      setMasterBoard(temp);
}

const TimePosted = ({props}) => {
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
            } else if (numPostedMonth === numCurrMonth + 1 ) {
                timePosted = "11 months ago";
            } else if (numPostedMonth === numCurrMonth + 2 ) {
                timePosted = "10 months ago";
            } else if (numPostedMonth === numCurrMonth + 3 ) {
                timePosted = "9 months ago";
            } else if (numPostedMonth === numCurrMonth + 4 ) {
                timePosted = "8 months ago";
            } else if (numPostedMonth === numCurrMonth + 5 ) {
                timePosted = "7 months ago";
            } else if (numPostedMonth === numCurrMonth + 6 ) {
                timePosted = "6 months ago";
            } else if (numPostedMonth === numCurrMonth + 7 ) {
                timePosted = "5 months ago";
            } else if (numPostedMonth === numCurrMonth + 8 ) {
                timePosted = "4 months ago";
            } else if (numPostedMonth === numCurrMonth + 9 ) {
                timePosted = "3 months ago";
            } else if (numPostedMonth === numCurrMonth + 10 ) {
                timePosted = "2 months ago";
            } else if (numPostedMonth === numCurrMonth + 11 ) {
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