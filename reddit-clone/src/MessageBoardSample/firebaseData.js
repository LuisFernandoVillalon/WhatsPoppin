import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, onValue, child, push, update } from "firebase/database"; 
import  sampleBoard  from "./MessageBoardSample.json";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile  } from "firebase/auth";
import { getFirestore, doc, setDoc, Timestamp, getDoc, updateDoc } from "firebase/firestore";
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

export async  function addNewUser(email, password, username) {

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  const user = userCredential.user;

  await updateProfile(user, {displayName: username});

  return user;

}
export async function logInUser(email, password) {

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  return user;
}
export async function addPostToDataBase(user, type, timePosted, voteAmount, title, content, comments, { setMasterBoard, setEntryMB }) {

  const docRef = doc(db, "data", "board");
  const docSnap = await getDoc(docRef);
  let temp = "";
  if (docSnap.exists()) {
        temp = docSnap.data();
  } else {
  // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
  temp.sampleBoard = Object.entries(temp.sampleBoard);
  temp.sampleBoard.push([temp.sampleBoard.length.toString(), {
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
export async function upVotePostFirebase(postVoteAmount, props){
  const boardRef = doc(db, "data", "board");
  const boardSnap = await getDoc(boardRef);
  const currentUser = props.props.props.currentUserUID;
  const currentPostID = props.currentPost.id;
  const mb = props.props.props.masterBoard;
  const temp = Object.entries(mb);
  
  temp.map((post) => {
    if (post[1].id === currentPostID) {
      post[1].voteAmount = postVoteAmount;
    }
  })


   if (boardSnap.exists()) {
         let board = boardSnap.data();
         let upVoteList = board.voteList;
         let tempUserArray = [];
         if (!Array.isArray(upVoteList)) {
          upVoteList = board.voteList.users;
         }
         for (let i = 0; i < upVoteList.length; ++i) {
            tempUserArray.push(upVoteList[i].currentUser);
         }
         if (upVoteList.length === 0 || !tempUserArray.includes(currentUser)) {
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
        }
        const output = Object.fromEntries(temp);
        board.sampleBoard = output;
        board.voteList = upVoteList;
        props.props.props.setVoteList(board.voteList);
        props.props.props.setMasterBoard(board.sampleBoard);
          await setDoc(doc(db, "data", "board"), board);
        }
     
}
export async function downVotePostFirebase(postVoteAmount, props){
  const boardRef = doc(db, "data", "board");
  const boardSnap = await getDoc(boardRef);
  const currentUser = props.props.props.currentUserUID;
  const currentPostID = props.currentPost.id;
  const mb = props.props.props.masterBoard;
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
         
         if (downVoteList.length === 0 || !tempUserArray.includes(currentUser)) {
     
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
        props.props.props.setVoteList(board.voteList);
        props.props.props.setMasterBoard(board.sampleBoard);
          await setDoc(doc(db, "data", "board"), board);
        }
     
}
export async function downVoteIndividualPostFirebase(postVoteAmount, props) {
  const docRef = doc(db, "data", "board");
  const docSnap = await getDoc(docRef);
  const currentUser = props.currentUserUID;
  const currentPostID = props.currentPost.id
  const mb = props.masterBoard;
  const temp = Object.entries(mb);
    
  temp.map((post) => {
    if (post[1].id === currentPostID) {
      post[1].voteAmount = postVoteAmount;
    }
  })

   let board = docSnap.data();
   let downVoteList = board.voteList;
   let tempUserArray = [];
   if (!Array.isArray(downVoteList)) {
    downVoteList = board.voteList.users;
   }
   for (let i = 0; i < downVoteList.length; ++i) {
     tempUserArray.push(downVoteList[i].currentUser);
   }
   if (downVoteList.length === 0 || !tempUserArray.includes(currentUser)) {     
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
   props.setVoteList(board.voteList);
   props.setMasterBoard(board.sampleBoard);
   await setDoc(doc(db, "data", "board"), board)
}
export async function upVoteIndividualPostFirebase(postVoteAmount, props) {
  const docRef = doc(db, "data", "board");
  const docSnap = await getDoc(docRef);
  const currentUser = props.currentUserUID;
  const currentPostID = props.currentPost.id
  const mb = props.masterBoard;
  const temp = Object.entries(mb);
    
  temp.map((post) => {
    if (post[1].id === currentPostID) {
      post[1].voteAmount = postVoteAmount;
    }
  })

   let board = docSnap.data();
   let upVoteList = board.voteList;
   let tempUserArray = [];
   if (!Array.isArray(upVoteList)) {
    upVoteList = board.voteList.users;
   }
   for (let i = 0; i < upVoteList.length; ++i) {
     tempUserArray.push(upVoteList[i].currentUser);
   }
   if (upVoteList.length === 0 || !tempUserArray.includes(currentUser)) {     
        upVoteList.push({currentUser, post: [
                                          {currentPostID, downVoteState: false, upVoteState: true}
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
   }
   const output = Object.fromEntries(temp);
   board.sampleBoard = output;
   board.voteList = upVoteList;
   props.setVoteList(board.voteList);
   props.setMasterBoard(board.sampleBoard);
   await setDoc(doc(db, "data", "board"), board)
}
export async function addCommentToFirebase(user, id, timePost, voteAmount, text, comments, currentPost, setMasterBoard, setVoteList) {
  const docRef = doc(db, "data", "board");
  const docSnap = await getDoc(docRef);
  let temp = docSnap.data();
  let sbArrayEntry = Object.entries(temp.sampleBoard);
  sbArrayEntry.map((post) => {
    if (post[1].id === currentPost.id) {
      post[1].comments.push({
        user: user,
        id: id,
        timePost: timePost, 
        voteAmount: voteAmount, 
        text: text,
        comments: comments
      })
    }
  })
  
  temp.sampleBoard = Object.fromEntries(sbArrayEntry);
  setMasterBoard(temp.sampleBoard);
  
  await setDoc(doc(db, "data", "board"), temp);

}
export async function addReplyToFirebase(user, id, timePost, voteAmount, text, response, currentPost, setMasterBoard, setVoteList) {
  const docRef = doc(db, "data", "board");
  const docSnap = await getDoc(docRef);
  let board = docSnap.data();

  let data = board.sampleBoard;

  data = tempFunction(user, id, timePost, voteAmount, text, response, currentPost, data);
  data = Object.fromEntries(data);
  board.sampleBoard = data;

  setMasterBoard(data);
  await setDoc(doc(db, "data", "board"), board);

}
function tempFunction(user, id, timePost, voteAmount, text, response, currentPost, data)  {
            data = Object.entries(data);
            data.map((post) => {
              if (currentPost.id === post[1].id) {
                for (let i = 0; i < post[1].comments.length; ++i) {
                   if (post[1].comments[i].id === response.id) {
                    let empty = [];
                    post[1].comments[i].comments.push({
                            user: user,
                            id: id,
                            timePost: timePost, 
                            voteAmount: voteAmount, 
                            text: text,
                            comments: empty
                          })
                          return;
                   }
                }
                        const temp = post[1].comments;
                        retriveParentComment(response, temp, user, id, timePost, voteAmount, text);
              }
            })
            return data;
  }
function retriveParentComment (response, temp, user, id, timePost, voteAmount, text) {

  for (let i = 0; i < temp.length; ++i) {
    if (temp[i].id === response.id) {
      let empty = [];
        temp[i].comments.push({
          user: user,
          id: id,
          timePost: timePost, 
          voteAmount: voteAmount, 
          text: text,
          comments: empty
        })
    }
  }
  for (let i = 0; i < temp.length; ++i) {
    retriveParentComment(response, temp[i].comments, user, id , timePost, voteAmount, text)
  }
 }
export async function getRecords({ setMasterBoard, setEntryMB, setVoteList}) { 

  const docRef = doc(db, "data", "board");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
        setMasterBoard(docSnap.data().sampleBoard);
        setEntryMB(docSnap.data());
        setVoteList(docSnap.data().voteList)
  } else {
  // docSnap.data() will be undefined in this case
    console.log("No such document!");
    await setDoc(doc(db, "data", "board"), sampleBoard);
  }

}