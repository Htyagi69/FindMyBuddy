"use client"
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { useEffect, useRef, useState } from 'react';
import { LobbyShemaWrite, LobbySchemaRead } from '@/db/firebase'
import { Button } from '@/components/ui/button';

import useshareLocation from '@/hooks/useSharingLocation';
import { drawPolyLines } from '@/utils/drawPolylines';
import {getBearing,getRelativeBearing,getDistance, bearingtoCardinal} from '@/utils/compassNavigation'
import { Markers } from '@/hooks/useMarkers';
import { LobbyInstance } from '@/utils/LobbyInstance';
// import Route

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_DEMO_API_KEY;

export default function MapInterface({lobbyId,userId}:{lobbyId:string,userId:string}) {
    const mapref = useRef<HTMLDivElement>(null)
    const { location, error } = useshareLocation()
    //References 
    const mapInstanceRef = useRef<google.maps.Map | null>(null) 
    const myMarkerRef = useRef<any>(null)
    const myFriendMarkerRef = useRef<any>(null)
    const [distance,setDistance]=useState(0);
    const userArrowRef = useRef<HTMLDivElement | null>(null);

    const [mapReady,setMapReady]=useState(false)
    const [start,setStart]=useState(false)
    
    let currentPolyLines: any[] = []
    
//MapInstance 

    useEffect(() => {
        // Set loader options.
        setOptions({
            key: API_KEY,
            v: 'weekly',
        });
        async function initMap(): Promise<void> {
            try {
                // Load the Maps library.
                const { Map } = (await importLibrary('maps'));
                
                const initcenter={lat:location?.lat || 28.676,lng:location?.lng || 77.500}

                // Set map options.
                const mapOptions = {
                    center: initcenter,
                    zoom: 12,
                    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
                };
                
                // Declare the map.
                if (mapref.current && !mapInstanceRef.current) {
                    mapInstanceRef.current = new Map(
                        mapref.current, mapOptions
                    );
                    setMapReady(true);
                } 
            }catch (error) {
                console.error("Error loading Google Maps:", error);
            }
        }
        initMap();
        }, [])
        
        
        //  Marker and polyline Implementation
        
        useEffect(()=>{
            if(!location || !mapInstanceRef.current || !mapReady) return;
            
            let unsubscribe: (() => void) | null = null
            
            console.log("lobbyId",lobbyId);
        const mypos = { lat: location.lat, lng: location.lng, altitude: 20 }
        const friendpos = { lat: 28.676731, lng: 77.500534, altitude: 20 };
        
        LobbyShemaWrite({lobbyId:lobbyId, userId: userId, lat: location.lat, lng: location.lng,  heading: 20 });
        
        const syncMarker=async()=>{
            
           await Markers({mapInstance:mapInstanceRef.current!,mypos,friendpos,myMarkerRef,myFriendMarkerRef,userArrowRef,start});
            

                    await drawPolyLines(mypos, friendpos, mapInstanceRef.current);//intially
                    
                    unsubscribe = LobbySchemaRead(lobbyId, async (data) => {
                        console.log("data",data);
                        const allusersIds=Object.keys(data);
                        console.log("allusersIds",allusersIds);
                        
                        const buddyId=allusersIds.find((id)=>id.startsWith("buddy-")&& id!==userId)
                        const buddyData=buddyId?data[buddyId]:null;
                        const myData=userId?data[userId]:null;
                        if(buddyData){
                            const updatedFriendPos = { lat: buddyData.lat, lng: buddyData.lng, altitude: 20 };
                            if(myFriendMarkerRef.current) myFriendMarkerRef.current.position = updatedFriendPos;
                        }
                        if(myData){
                            const updatedMyPos = { lat:myData.lat, lng: myData.lng, altitude: 20 };
                            if(myMarkerRef.current) myMarkerRef.current.position = updatedMyPos;
                        }
                        if(myData && buddyData){
                            const updatedFriendPos = { lat: buddyData.lat, lng: buddyData.lng, altitude: 20 };
                            const updatedMyPos = { lat:myData.lat, lng: myData.lng, altitude: 20 };
                            await drawPolyLines(updatedMyPos, updatedFriendPos, mapInstanceRef.current!)
                              //Calculate Distance
                            const duuri=getDistance({mylat:location.lat,mylng:location.lng,buddylat:buddyData.lat, buddylng: buddyData.lng})
                           setDistance(duuri);
                        }

                    })
                }
                syncMarker();
            return () => {
            if (unsubscribe) unsubscribe()
                currentPolyLines.forEach(p => p.setMap(null))
        }},[location,start])


//Arrow Orientation
useEffect(()=>{
    const handleOrientation = (e: DeviceOrientationEvent) => {
        // const heading= e.webkitCompassHeading ??e.alpha;
        const deviceHeading= e.alpha;  //for android
        if(deviceHeading!==null && location){
            
            const bearing=getBearing({mylat:location.lat,mylng:location.lng,buddylat: 28.676731, buddylng: 77.500534})
            console.log("dir:",bearing); 
            const relative=getRelativeBearing(bearing,deviceHeading);
            console.log("Relative dir:",relative); 
            //Rotate 
            if(userArrowRef.current){
                userArrowRef.current.style.transform=`rotate(${relative}deg)`
            }
        }
    }

    window.addEventListener('deviceorientationabsolute', handleOrientation);
    
    return () => {
        window.removeEventListener('deviceorientationabsolute', handleOrientation);
    };
    
},[location])

   const handleShareLink=async()=>{
        const buddyNo="buddy-"+Math.floor(1000+Math.random()*9000);
        const url=LobbyInstance(lobbyId,buddyNo);
        console.log("ShareLink",url);
        await navigator.clipboard.writeText(url);
    }

    if (error) return <div className="p-4 text-red-500">Tracking Error: {error.message}</div>;

    return (
        <div className='flex flex-col items-center gap-4 p-4'>
            {!location && <p className="text-gray-500 animate-pulse">Acquiring satellite lock...</p>}
            <div className='flex justify-center w-full relative'>
                <div className='flex flex-col'>
                  <div ref={mapref} className='w-220 h-145 rounded shadow-lg border' />
                     <p className="font-semibold text-slate-700 mt-2">
                    Distance : {distance >= 1000 ? `${(distance / 1000).toFixed(1)} km` : `${Math.round(distance)}m`}
                    </p>
                </div>
                  <Button variant="secondary" className='absolute top-4 right-2 border-2 border-amber-400 cursor-pointer bg-white hover:bg-slate-100 z-10'
                      onClick={handleShareLink}>
                   🔗 Generate & Share buddy Link
                 </Button>
                <Button variant="secondary" className='absolute top-4 left-2 border-2 border-amber-400 cursor-pointer bg-white hover:bg-slate-100 z-10' onClick={() => setStart(!start)}>
                    {start ? "Stop Navigation" : "Start Navigation"}
                </Button>
            </div>
        </div>
    );
}


