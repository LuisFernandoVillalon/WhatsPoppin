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
                <div className="board-section"><BarChartFill/>Top</div>
                <div className="board-section"><Newspaper/>New</div>
                <div className="board-section"><Clock/>Old</div>
            </div>
             <MessageBoard 
                masterBoard={masterBoard}
             />
        </>
    )
}

const backTop = () => {
    window.scrollTo(0, 0)
}

const MessageBoard = (props) => {
    const list = props.masterBoard;
    const boardList = list.map((currentPost) => (
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
             <div className='post-user'>Posted by {props.currentPost.user}</div>
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
             <div className='post-user'>Posted by {props.currentPost.user}</div>
             <div className='post-title'>{props.currentPost.title}</div>
             <img src={props.currentPost.content} className="post-image"/>
             <div className='post-comments'><ChatSquare /> {props.currentPost.comments} Comments</div>
        </div>
     </div>
    )
}
const LinkPost = ({props}) => {
    let temp = props.currentPost.content;
     let tempArr = temp.split('');
    let truncated = [];
    for (let i = 0; i < tempArr.length; ++i) {
        if (tempArr[i] === "."  && (tempArr[i+4] === "/" || tempArr[i+3] === "/")) {
            truncated.push(tempArr[i]);
            truncated.push(tempArr[i+1]);
            truncated.push(tempArr[i+2]);
            truncated.push(tempArr[i+3]);
            truncated.push(tempArr[i+4]);
            truncated.push("...")
            break;
        }
        truncated.push(tempArr[i]);
    }
    truncated.toString('');
    
    return (
        <div className="individual-post">
        <div className="first-column">
             <ArrowUp className='upArrow'/>
             {props.currentPost.voteAmount}
             <ArrowDown className='downArrow'/>
        </div>
        <div className='post-link-container'>
            <div className="second-column">
                <div className='post-user'>Posted by {props.currentPost.user}</div>
                <div className='post-title'>{props.currentPost.title}</div>
                <a  target="_blank" className='post-link' href={props.currentPost.content}>{truncated}<BoxArrowUpRight/></a>
                <div className='post-comments'><ChatSquare /> {props.currentPost.comments} Comments</div>
            </div>
            {/* <a  target="_blank" href={props.currentPost.content}> */}
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
            {/* </a> */}
        </div>
     </div>
    )
}


export default HomeBoard;