"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MapViewRouter(){
    const router= useRouter();
    
    useEffect(()=>{
        const generateLobbyId=crypto.randomUUID().slice(0,8);
        const generateUserId="host-"+Math.floor(1000+Math.random()*9000);
        
        router.replace(`/MapView/lobby/${generateLobbyId}/${generateUserId}`)
    },[router])

    return <div className="p-8 text-center font-sans"><h2>Creating your tracking room...</h2></div>;
}
