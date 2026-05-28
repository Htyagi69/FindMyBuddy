"use client"
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { useEffect, useRef, useState } from 'react';
import { writePosition, readPostion } from '../db/firebase'
import { Button } from '@/components/ui/button';

import useshareLocation from '../sharingLocation/page';
import { drawPolyLines } from '../drawPolylines/page';
import { createCustomPins } from '../Markers/page'
import {getBearing,getRelativeBearing,getDistance, bearingtoCardinal} from '../compassNavigation/page'
// import Route

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_DEMO_API_KEY;

export default function MapView() {
    const mapref = useRef<HTMLDivElement>(null)
    const { location, error } = useshareLocation()

    const mapInstanceRef = useRef<google.maps.Map | null>(null) 
    const myMarkerRef = useRef<any>(null)
    const myFriendMarkerRef = useRef<any>(null)
    const [distance,setDistance]=useState(0);
    const userArrowRef = useRef<HTMLDivElement | null>(null);
    const [start,setStart]=useState(false)

    let currentPolyLines: any[] = []
    useEffect(() => {
        let unsubscribe: (() => void) | null = null
        async function initMap(): Promise<void> {
            // Set loader options.
            setOptions({
                key: API_KEY,
                v: 'weekly',
            });
            try {
                // Load the Maps library.
                const { Map } = (await importLibrary('maps'));
                const { AdvancedMarkerElement } = await importLibrary('marker')
                if (!location) return;
                const mypos = { lat: location.lat, lng: location.lng, altitude: 20 }
                const friendpos = { lat: 28.676731, lng: 77.500534, altitude: 20 };
                // Set map options.
                writePosition({ userId: 123, Lat: location.lat, Lng: location.lng, buddyLat: friendpos.lat, buddyLng: friendpos.lng, altitude: 20 });
                
                const mapOptions = {
                    center: { lat: location.lat, lng: location.lng },
                    zoom: 12,
                    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
                };
                
                // Declare the map.
                if (mapref.current) {
                    const mapInstance = new Map(
                        mapref.current, mapOptions
                    );
                    mapInstanceRef.current = mapInstance;
                    //Marker on you

                    const { pinBackground, pinbuddyBackground,userArrow } = await createCustomPins(start);
                    userArrowRef.current=userArrow;

                    const myMarker = new AdvancedMarkerElement({
                        position: mypos,
                        map: mapInstance,
                        title: "📍 You are here!",
                        content: pinBackground
                    })
                    myMarkerRef.current = myMarker;
                    //Marker on your friend
                    const coords={lat:location.lat,lng:location.lng,buddylat: 28.676731, buddylng: 77.500534}

                    //Calculate Distance

                    const duuri=getDistance({mylat:location.lat,mylng:location.lng,buddylat: 28.676731, buddylng: 77.500534})
                    setDistance(duuri);


                    const friendMarker = new AdvancedMarkerElement({
                        position: friendpos,
                        map: mapInstance,
                        title: "📍 Your are friend is here!",
                        content: pinbuddyBackground,
                        collisionBehavior: 'REQUIRED',
                    })
                    myFriendMarkerRef.current = friendMarker;

                    await drawPolyLines(mypos, friendpos, mapInstance);//intially

                    unsubscribe = readPostion(123, async (data) => {
                        const updatedFriendPos = { lat: data.buddyLat, lng: data.buddyLng, altitude: 20 };
                        const updatedMyPos = { lat: data.mylat, lng: data.mylng, altitude: 20 };
                        friendMarker.position = updatedFriendPos;
                        myMarker.position = updatedMyPos;
                        await drawPolyLines(updatedMyPos, updatedFriendPos, mapInstance)
                    })
                }
            } catch (error) {
                console.error("Error loading Google Maps:", error);
            }
        }
        initMap();
        return () => {
            if (unsubscribe) unsubscribe()
            currentPolyLines.forEach(p => p.setMap(null))
        }
    }, [location,start])

    //onUpdating

    useEffect(() => {
        if (!location || !mapInstanceRef.current || !myMarkerRef.current || !myFriendMarkerRef.current) return;
        const mypos = { lat: location.lat, lng: location.lng, altitude: 20 }
        const friendpos = myFriendMarkerRef.current.position;

        //Repositioning without rebuilding the whole map
        myMarkerRef.current.position = mypos;
        mapInstanceRef.current.setCenter(mypos);

        //writing to firebase
        writePosition({
            userId: 123,
            Lat: location.lat,
            Lng: location.lng,
            buddyLat: friendpos.lat,
            buddyLng: friendpos.lng,
            altitude: 20
        })
        drawPolyLines(mypos, friendpos, mapInstanceRef.current)
    }, [location])

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
                <Button variant="secondary" className='absolute top-4 right-4 border-2 border-amber-400 cursor-pointer bg-white hover:bg-slate-100'>
                    share
                </Button>
                <p>Distance : {distance>=1000 ? `${(distance/1000).toFixed(1)} km`:`${Math.round(distance)}m`}</p>
            </div>
                <Button variant="secondary" className='absolute top-4 right-4 border-2 border-amber-400 cursor-pointer bg-white hover:bg-slate-100' onClick={()=>setStart(!start)}>
                    start
                </Button>
        </div>
    );
}