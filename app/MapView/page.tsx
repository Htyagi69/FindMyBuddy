"use client"
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { useEffect, useRef, useState } from 'react';
import { writePosition, readPostion } from '@/db/firebase'
import { Button } from '@/components/ui/button';

import useshareLocation from '@/hooks/useSharingLocation';
import { drawPolyLines } from '../../utils/drawPolylines';
import {getBearing,getRelativeBearing,getDistance, bearingtoCardinal} from '../../utils/compassNavigation'
import {LobbyInstance} from '../../utils/LobbyInstance'
import { Markers } from '@/hooks/useMarkers';
// import Route

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_DEMO_API_KEY;

export default function MapView() {
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
        
        const mypos = { lat: location.lat, lng: location.lng, altitude: 20 }
        const friendpos = { lat: 28.676731, lng: 77.500534, altitude: 20 };
        
        //Calculate Distance
        const duuri=getDistance({mylat:location.lat,mylng:location.lng,buddylat: 28.676731, buddylng: 77.500534})
        setDistance(duuri);
        
        writePosition({ userId: 123, Lat: location.lat, Lng: location.lng, buddyLat: friendpos.lat, buddyLng: friendpos.lng, altitude: 20 });
        
        const syncMarker=async()=>{
            
           await Markers({mapInstance:mapInstanceRef.current!,mypos,friendpos,myMarkerRef,myFriendMarkerRef,userArrowRef,start});
            

                    await drawPolyLines(mypos, friendpos, mapInstanceRef.current);//intially
                    
                    unsubscribe = readPostion(123, async (data) => {
                        const updatedFriendPos = { lat: data.buddyLat, lng: data.buddyLng, altitude: 20 };
                        const updatedMyPos = { lat: data.mylat, lng: data.mylng, altitude: 20 };
                        if(myFriendMarkerRef.current) myFriendMarkerRef.current.position = updatedFriendPos;
                        if(myMarkerRef.current) myMarkerRef.current.position = updatedMyPos;

                        await drawPolyLines(updatedMyPos, updatedFriendPos, mapInstanceRef.current!)
                    })
                }
                syncMarker();
            return () => {
            if (unsubscribe) unsubscribe()
                currentPolyLines.forEach(p => p.setMap(null))
        }},[location,start])

    //creating a sharable url
    
    const handleSharingUrl=async()=>{
        const url=LobbyInstance();
        console.log("url to share:",url);
        await navigator.clipboard.writeText(url);
    }

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


    if (error) return <div className="p-4 text-red-500">Tracking Error: {error.message}</div>;

    return (
        <div className='flex flex-col items-center gap-4 p-4'>
            {!location && <p className="text-gray-500 animate-pulse">Acquiring satellite lock...</p>}
            <div className='flex justify-center w-full relative'>
                <div ref={mapref} className='w-220 h-145 rounded shadow-lg border' />
               <Button variant="secondary" className='absolute top-4 left-4 border-2 border-amber-400 cursor-pointer bg-white hover:bg-slate-100 z-10' onClick={handleSharingUrl}>
                    share
                </Button>

                <Button variant="secondary" className='absolute top-4 right-4 border-2 border-amber-400 cursor-pointer bg-white hover:bg-slate-100 z-10' onClick={() => setStart(!start)}>
                    {start ? "Stop Navigation" : "Start Navigation"}
                </Button>
                <p className="font-semibold text-slate-700 mt-2">
                    Distance : {distance >= 1000 ? `${(distance / 1000).toFixed(1)} km` : `${Math.round(distance)}m`}
                </p>
            </div>
        </div>
    );
}


