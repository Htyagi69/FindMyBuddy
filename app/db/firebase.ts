// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, set,ref, onValue } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


interface userPos{
    userId:number;
    Lat:number;
    Lng:number;
    buddyLat:number;
    buddyLng:number;
    altitude:number,
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTO_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database=getDatabase();

export function writePosition({userId,Lat,Lng,buddyLat,buddyLng,altitude}:userPos){
    set(ref(database,`pos/${userId}`),{
        mylat:Lat,
        mylng:Lng,
        buddyLat:buddyLat,
        buddyLng:buddyLng,
         altitude: altitude,
        timestamp:Date.now()
    })
}

export  function readPostion(userId:number,callback:(data:any)=>void){
    const posref = ref(database, `pos/${userId}`);
    return onValue(posref, (snapshot) => {
  const data = snapshot.val();
  if(data){
     callback(data);
  }
});
}