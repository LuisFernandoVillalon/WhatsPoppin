import uniqid from 'uniqid';
import { TextPostPage, ImagePostPage, LinkPostPage } from '../components/IndividualPosts';

const Post = ({masterBoard,
    setMasterBoard,
    currentPost,
    setCurrentPost,
    logIn,
    setLogIn,
    signUp,
    setSignUp,
    logInState,
    currentUserUID,
    entryMB,
    voteList,
    setVoteList
}) => {
    let type = currentPost.type;
    
     if (type === "text") {
         return ( <TextPostPage 
                        masterBoard={masterBoard}
                        setMasterBoard={setMasterBoard}
                        currentPost={currentPost}
                        setCurrentPost={setCurrentPost}
                        logIn={logIn}
                        setLogIn={setLogIn}
                        signUp={signUp}
                        setSignUp={setSignUp} 
                        logInState={logInState}
                        currentUserUID={currentUserUID}
                        entryMB={entryMB}
                        voteList={voteList}
                        setVoteList={setVoteList}
                        key={uniqid()}
                /> )
      }  else if (type === "image") {
         return ( <ImagePostPage
                        masterBoard={masterBoard}
                        setMasterBoard={setMasterBoard}
                        currentPost={currentPost}
                        setCurrentPost={setCurrentPost}
                        logIn={logIn}
                        setLogIn={setLogIn}
                        signUp={signUp}
                        setSignUp={setSignUp} 
                        logInState={logInState}
                        currentUserUID={currentUserUID}
                        entryMB={entryMB}
                        voteList={voteList}
                        setVoteList={setVoteList}
                        key={uniqid()}
                /> )
      } else if (type === "link") {
         return ( <LinkPostPage 
                        masterBoard={masterBoard}
                        setMasterBoard={setMasterBoard}
                        currentPost={currentPost}
                        setCurrentPost={setCurrentPost}
                        logIn={logIn}
                        setLogIn={setLogIn}
                        signUp={signUp}
                        setSignUp={setSignUp} 
                        logInState={logInState}
                        currentUserUID={currentUserUID}
                        entryMB={entryMB}
                        voteList={voteList}
                        setVoteList={setVoteList}
                        key={uniqid()}
                /> )
     }
}

export default Post;