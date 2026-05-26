import { Button } from "@/components/ui/button";
import { useEffect,useState } from "react";

export default function shareLocation(){
    const [location,setLocation]=useState<{lat:number;lng:number}| null>(null)
    const [error,setError]=useState<GeolocationPositionError| null>(null)
   useEffect(()=>{
       if(!navigator.geolocation){
        console.log("Geolocation not supported");
         return;
       }

       const watchId=navigator.geolocation.watchPosition((pos)=>{
        const lat=pos.coords.latitude;
        const lng=pos.coords.longitude;

       console.log("Updated location -> latitude:", lat, "longitude:",lng);
        setLocation({lat,lng});
    },(err)=>{
        console.log("Location error:", err);
        setError(err);
       },{
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0
       });
       return()=>{
           navigator.geolocation.clearWatch(watchId)
        }
},[])
return {location,error}
}