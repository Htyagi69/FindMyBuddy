"use client"
// Import the needed libraries.
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { useEffect, useRef } from 'react';
import {writePosition,readPostion} from '../db/page'
// import Route

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_DEMO_API_KEY;

interface LatLng{
    mylat:number;
    mylng:number;
    buddylat:number;
    buddylng:number;
}

export default function MapView(){
const mapref=useRef<HTMLDivElement>(null)
    const getUserLocation=async()=>{
        return new Promise<{lat:number;lng:number}>((resolve,reject)=>{
        navigator.geolocation.getCurrentPosition((pos)=>{
            const lat=pos.coords.latitude;
            const lng=pos.coords.longitude;
            console.log("latitude:",lat," ","longitude:",lng);
            resolve({lat,lng})
        },(error)=>{
            console.log("Location error",error);   
            reject(error)  
        })
    })
    }
    const drawRoute=async({ mylat, mylng, buddylat, buddylng }: LatLng)=>{
        const originLatLng={lat:mylat,lng:mylng};
        const destinationLatLng={lat:buddylat,lng:buddylng};

        const request={
            origin:originLatLng,
            destination:destinationLatLng,
            fields:["path"],
            computeAlternativeRoutes:false,
            travelMode:'WALKING',
            // routeModifiers:{
            //     avoidTolls:true,
            // }
        }
        return  request;
    }
    useEffect(()=>{
        let unsubscribe: (() => void) | null = null
        let currentPolyLines:any[]=[]
        async function initMap(): Promise<void> {
            // Set loader options.
            setOptions({
                key: API_KEY,
                v: 'weekly',
            });
            try{
                // Load the Maps library.
                const { Map } = (await importLibrary('maps'));
                const {AdvancedMarkerElement,PinElement,collisionBehavior}=await importLibrary('marker')
                const {Route} =await importLibrary('routes')
                const {Polyline}=await importLibrary('maps')
                const {lat,lng}=await getUserLocation();
                const mypos={lat:lat,lng:lng, altitude: 20}
                const friendpos={lat:28.676731,lng:77.500534, altitude: 20};
                // Set map options.
               writePosition({userId:123,Lat: lat,Lng: lng,buddyLat: friendpos.lat,buddyLng:friendpos.lng,altitude:20 });

    const mapOptions = {
        center: { lat:lat, lng: lng  },
        zoom: 35,
        mapId:process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
    };
    
    // Declare the map.
    if(mapref.current){ 
       const mapInstance= new Map(
            mapref.current,mapOptions
        );

const pinBackground = new PinElement({
    background: "red", // The pin color
    borderColor: "#137333",
    glyphColor: "red",
});

// 2. Create the image for the photo
        const userIcon = document.createElement('img');
        userIcon.src = '/me.png'; 
        userIcon.style.width = '75px';  // Keep it small to fit in the pin
        userIcon.style.height = '25px';
        userIcon.style.borderRadius = '55%'; // Make the photo circular
        userIcon.style.objectFit = 'cover';
        
        // 3. Put the photo inside the Pin's glyph area
        pinBackground.glyph = userIcon;

        //Marker on you
        const myMarker=new AdvancedMarkerElement({
            position:mypos,
            map:mapInstance,
            title: "📍 You are here!",
            content:pinBackground.element
        })
        
        const pinbuddyBackground = new PinElement({
            background: "blue", // The pin color
            borderColor: "#137333",
            glyphColor: "red",
        });
        const buddyIcon = document.createElement('img');
         buddyIcon.src = '/friend.png'; 
         buddyIcon.style.width = '25px';  // Keep it small to fit in the pin
         buddyIcon.style.height = '25px';
         buddyIcon.style.borderRadius = '50%'; // Make the photo circular
         buddyIcon.style.objectFit = 'cover';
         
         // 3. Put the photo inside the Pin's glyph area
         pinbuddyBackground.glyph = buddyIcon;

        //Marker on your friend
        const friendMarker= new AdvancedMarkerElement({
            position:friendpos,
            map:mapInstance,
            title: "📍 Your are friend is here!",
            content:pinbuddyBackground.element,
            collisionBehavior: collisionBehavior,
        })

        

        const drawPolyLines=async(origin:any,destination:any)=>{
            currentPolyLines.forEach(p=>p.setMap(null));
            currentPolyLines=[]
             const request=await drawRoute({mylat: origin.lat,mylng: origin.lng,buddylat: destination.lat,buddylng: destination.lng });
               const {routes}=await Route.computeRoutes(request);
                console.log("routes",routes);
                if(routes && routes.length>0){
                    const mapPolyLines=routes[0].createPolylines();
                        mapPolyLines.forEach((polyline: typeof Polyline) => {
                             polyline.setMap(mapInstance);
                             currentPolyLines.push(polyline)
                            });
                        }else{
                            console.log("No routes found");
                            return;
                        }
        }
                 await drawPolyLines(mypos,friendpos);//intially

                unsubscribe=readPostion(123,async(data)=>{
                    const updatedFriendPos={lat:data.buddyLat,lng:data.buddyLng,altitude:20};
                    const updatedMyPos={lat:data.mylat,lng:data.mylng,altitude:20};
                    friendMarker.position=updatedFriendPos;
                    myMarker.position=updatedMyPos;
                    await drawPolyLines(updatedMyPos,updatedFriendPos)
                })
            }
       }catch (error) { 
                console.error("Error loading Google Maps:", error);
            }
}
initMap();
       return () => {
            if (unsubscribe) unsubscribe()
            currentPolyLines.forEach(p => p.setMap(null))
        }
},[])
return (
  <div ref={mapref} className='w-200 h-150 rounded'/>
  )
}