import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, child, push, update } from "firebase/database"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile  } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCkY2NbgewS8OFKnSRv5tKfMgWwTpzoKTM",
    authDomain: "reddit-clone-8a064.firebaseapp.com",
    projectId: "reddit-clone-8a064",
    storageBucket: "reddit-clone-8a064.appspot.com",
    messagingSenderId: "488367010867",
    appId: "1:488367010867:web:994a86b7332d9095f51f46"
};
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

const auth = getAuth(app);

export function addNewUser(email, password, username) {
  console.log(email, password);  
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;

    updateProfile(user, {
      displayName: username
    }).then(() => {
      // Profile updated!
      // ...
      console.log("profile updated");
    }).catch((error) => {
      // An error occurred
      // ...
      console.log(error);
    });
    console.log(user);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert(errorCode, errorMessage);
    // ..
  });
}
export async function logInUser(email, password) {

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  console.log(user);
  return user;
}



export function addPostToDataBase(user, type, timePosted, voteAmount, title, content, comments) {

  // const postData = {
  //   user: user,
  //   type: type,
  //   timePosted: timePosted,
  //   voteAmount: voteAmount,
  //   title: title,
  //   content: content,
  //   comments: comments
  // }
    
    const newUserKey = push(child(ref(database), 'post')).key;

    const updates = {};

    updates[newUserKey] = {user, type, timePosted, voteAmount, title, content, comments};

    // const tempObj = update(ref(database), updates);
    // console.log(tempObj);
    return update(ref(database), updates);
}

export function getRecords({ setMasterBoard}) { 
  const board = ref(database, '/');
  onValue(board, (snapshot) => {
    const data = snapshot.val();
   setMasterBoard(data);
  });
}
  