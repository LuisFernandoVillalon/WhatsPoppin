import { ArrowUp, ArrowDown, ChatSquare, BoxArrowUpRight, Link45deg } from "react-bootstrap-icons";
import { TimePosted } from "./HomeBoard";
import uniqid from 'uniqid';
import { directLink } from "./HomeBoard";

const Post = (props) => {
    let type = props.currentPost.type;
     if (type === "text") {
         return ( <TextPostPage props={props} key={uniqid()}/> )
      }  else if (type === "image") {
         return ( <ImagePostPage props={props} key={uniqid()} /> )
      } else if (type === "link") {
         return ( <LinkPostPage props={props} key={uniqid()} /> )
     }
}

const TextPostPage = ({props}) => {
    return (
        <div className="individual-post-page" >
        <div className="first-column">
             <ArrowUp className='upArrow'/>
             {props.currentPost.voteAmount}
             <ArrowDown className='downArrow'/>
        </div>
        <div className="second-column-page">
             <div className='post-user'>Posted by {props.currentPost.user}<TimePosted props={props}/></div>
             <div className='post-title'>{props.currentPost.title}</div>
             <div className="post-text">{props.currentPost.content}</div>
             <div className='post-comments'><ChatSquare /> {props.currentPost.comments} Comments</div>
        </div>
     </div>
    )
}

const ImagePostPage = ({props}) => {
    let key = uniqid();
    return (
        <div className="individual-post-page">
        <div className="first-column">
             <ArrowUp className='upArrow'/>
             {props.currentPost.voteAmount}
             <ArrowDown className='downArrow'/>
        </div>
        <div className="second-column-page">
             <div className='post-user'>Posted by {props.currentPost.user}<TimePosted props={props} key={key}/></div>
             <div className='post-title'>{props.currentPost.title}</div>
             <img alt="post" src={props.currentPost.content} className="post-image"/>
             <div className='post-comments'><ChatSquare key={key} /> {props.currentPost.comments} Comments</div>
        </div>
     </div>
    )
}

const LinkPostPage = ({props}) => {
    let temp = props.currentPost.title;
     let tempArr = temp.split('');
    let truncated = [];
    for (let i = 0; i <= 40; ++i) {
        truncated.push(tempArr[i]);
    }
    truncated.push("...");
    truncated.toString('');
   
   return (
       <div className="individual-post-link-page">
           <div className="first-column">
               <ArrowUp className='upArrow'/>
               {props.currentPost.voteAmount}
               <ArrowDown className='downArrow'/>
           </div>
           
           <div className="second-column-page">
                   <div className='post-user'>Posted by {props.currentPost.user}<TimePosted props={props}/></div>
                   <div className='post-title-link'>{props.currentPost.title}</div>
                   <a  rel="noreferrer" target="_blank" className='post-link-page' href={props.currentPost.content}>{props.currentPost.content}<BoxArrowUpRight/></a>
                   <div className='post-comments'><ChatSquare /> {props.currentPost.comments} Comments</div>
           </div>

           {/* <div onClick={() => directLink(props.currentPost.content)} className='link-square'>
               <div className='chain-in-square'>
                   <Link45deg/>
               </div>
               <div className='link-in-box-container'>
                   <div className='link-in-box'>
                       <BoxArrowUpRight/>
                   </div>
               </div>
           </div>  */}

       </div>
   )
}

export default Post;