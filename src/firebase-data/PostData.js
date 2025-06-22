import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc  } from "firebase/firestore";
import { getRecords } from './StartUpData';
import uniqid from 'uniqid';

const firebaseConfig = {
    apiKey: "AIzaSyCkY2NbgewS8OFKnSRv5tKfMgWwTpzoKTM",
    authDomain: "reddit-clone-8a064.firebaseapp.com",
    projectId: "reddit-clone-8a064",
    storageBucket: "reddit-clone-8a064.appspot.com",
    messagingSenderId: "488367010867",
    appId: "1:488367010867:web:994a86b7332d9095f51f46"
};
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export async function addPostToDataBase(currentUserUID, user, type, timePosted, voteAmount, title, content, comments, { setMasterBoard, setEntryMB }) {

    const docRef = doc(db, "data", "board");
    const docSnap = await getDoc(docRef);
    let temp = "";
    if (docSnap.exists()) {
          temp = docSnap.data();
    } else {
    // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    if (currentUserUID.uid) {
      currentUserUID = currentUserUID.uid;
    }
    temp.sampleBoard = Object.entries(temp.sampleBoard);
    temp.sampleBoard.push([temp.sampleBoard.length.toString(), {
      userID: currentUserUID, 
      user: user, 
      id: uniqid(),
      type: type, 
      timePosted: timePosted, 
      voteAmount: voteAmount, 
      title: title, 
      content: content, 
      comments: comments
    }]);
    temp.sampleBoard = temp.sampleBoard.reduce((accum, [k, v]) => {
      accum[k] = v;
      return accum;
    }, {})
    await setDoc(doc(db, "data", "board"), temp);
    getRecords({ setMasterBoard, setEntryMB });
}
export async function upVotePostFirebase(postVoteAmount,  { currentPost, currentUserUID, setVoteList, masterBoard, setMasterBoard }){
    const boardRef = doc(db, "data", "board");
    const boardSnap = await getDoc(boardRef);
    let currentUser = currentUserUID;
    if (currentUser.uid) {
      currentUser = currentUser.uid 
    }
    const currentPostID = currentPost.id;
    const mb = masterBoard;
    const temp = Object.entries(mb);
    
    temp.map((post) => {
      if (post[1].id === currentPostID) {
        post[1].voteAmount = postVoteAmount;
      }
    })
  
  
           let board = boardSnap.data();
           let upVoteList = board.voteList;
           let tempUserArray = [];
           if (!Array.isArray(upVoteList)) {
            upVoteList = board.voteList.users;
           }
           for (let i = 0; i < upVoteList.length; ++i) {
              tempUserArray.push(upVoteList[i].currentUser);
           }
           let commentArrayStatus = upVoteList.map((user) => {
            if (user.post)  {
              return true
            } else {
              return false;
            }
          })
           if (upVoteList.length === 0 || !tempUserArray.includes(currentUser) || (tempUserArray.includes(currentUser) && !commentArrayStatus[0])) {
            
            upVoteList.push({currentUser, post: [
                                                  {currentPostID, upVoteState: true, downVoteState: false}
                                                ]
                            }
                          );
           } else {
            upVoteList.map((user) => {
                if (user.currentUser === currentUser) {
                  let tempPostArray = [];
                  for (let i = 0; i < user.post.length; ++i) {
                     tempPostArray.push(user.post[i].currentPostID);
                  }
                    if (!tempPostArray.includes(currentPostID)) {
                      user.post.push({currentPostID, upVoteState: true, downVoteState: false})
                    } else {
                      user.post.map((item => {
                          if (item.currentPostID === currentPostID) {
                            item.upVoteState = true;
                            item.downVoteState = false;
                          }
                      }))
                    }
                } 
            })
  
          const output = Object.fromEntries(temp);
          board.sampleBoard = output;
          board.voteList = upVoteList;
          setVoteList(board.voteList);
          setMasterBoard(board.sampleBoard);
            await setDoc(doc(db, "data", "board"), board);
          }
       
}
export async function downVotePostFirebase(postVoteAmount, { currentPost, currentUserUID, setVoteList, masterBoard, setMasterBoard}){
    const boardRef = doc(db, "data", "board");
    const boardSnap = await getDoc(boardRef);
    let currentUser = currentUserUID;
    if (currentUser.uid) {
      currentUser = currentUser.uid 
    }
    const currentPostID = currentPost.id;
    const mb = masterBoard;
    const temp = Object.entries(mb);
    
    temp.map((post) => {
      if (post[1].id === currentPostID) {
        post[1].voteAmount = postVoteAmount;
      }
    })
  
  
     if (boardSnap.exists()) {
           let board = boardSnap.data();
           let downVoteList = board.voteList;
           let tempUserArray = [];
           if (!Array.isArray(downVoteList)) {
            downVoteList = board.voteList.users;
           }
           for (let i = 0; i < downVoteList.length; ++i) {
              tempUserArray.push(downVoteList[i].currentUser);
           }
           let commentArrayStatus = downVoteList.map((user) => {
            if (user.post)  {
              return true
            } else {
              return false;
            }
          })
           if (downVoteList.length === 0 || !tempUserArray.includes(currentUser) || (tempUserArray.includes(currentUser) && !commentArrayStatus[0])) {
       
            downVoteList.push({currentUser, post: [
                                                  {currentPostID, upVoteState: false, downVoteState: true}
                                                ]
                            }
                          );
           } else {
            
            downVoteList.map((user) => {
                if (user.currentUser === currentUser) {
                 
                  let tempPostArray = [];
                  for (let i = 0; i < user.post.length; ++i) {
                     tempPostArray.push(user.post[i].currentPostID);
                  }
                    if (!tempPostArray.includes(currentPostID)) {
                    
                      user.post.push({currentPostID, upVoteState: false, downVoteState: true})
                    } else {
                      user.post.map((item => {
                          if (item.currentPostID === currentPostID) {
                            item.upVoteState = false;
                            item.downVoteState = true;
                          }
                      }))
                    }
                } 
            })
          }
          const output = Object.fromEntries(temp);
          board.sampleBoard = output;
          board.voteList = downVoteList;
          setVoteList(board.voteList);
          setMasterBoard(board.sampleBoard);
          console.log(board);
            await setDoc(doc(db, "data", "board"), board);
          }
       
}
export async function deletePostFromFirebase(currentPost, setMasterBoard, setCurrentPost) {
    const docRef = doc(db, "data", "board");
    const docSnap = await getDoc(docRef);
    let data = docSnap.data();
    let masterBoard = data.sampleBoard;
  
    masterBoard = Object.entries(masterBoard);
  
    masterBoard.map((post) => {
      if (post[1].id === currentPost.id) {
          post[1].title = "deleted";
          post[1].content = "deleted";
          setCurrentPost(post[1]);
      }
    })
  
    masterBoard = Object.fromEntries(masterBoard);
    data.sampleBoard = masterBoard;
    setMasterBoard(masterBoard); 
    await setDoc(doc(db, "data", "board"), data)
  
}