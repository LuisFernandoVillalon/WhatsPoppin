import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child, push, update, onValue } from "firebase/database";

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

// export function addTimetoDatabase({timeRecord, username, level}) {
    
//     const newUserKey = push(child(ref(database), 'RecordsList')).key;

//     const updates = {};

//     updates['/RecordsList/' + level + '/' + newUserKey] = {timeRecord, username};
  
//     return update(ref(database), updates);
// }

export function getRecords({setMasterBoard}) { 

  const board = ref(database, '/');
  onValue(board, (snapshot) => {
    const data = snapshot.val();
   setMasterBoard(data);
  });
}
  