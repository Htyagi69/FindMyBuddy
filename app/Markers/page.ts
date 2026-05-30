import { importLibrary } from '@googlemaps/js-api-loader';
import { useState,useRef, RefObject } from 'react';

export const createGoogleArrow = (arrowId: string, isBuddy: boolean = false) => {
  
  // Circular disc (like Google Maps pulsing location disc)
  const disc = document.createElement('div');
  disc.style.position = 'relative';
  disc.style.width = '40px';
  disc.style.height = '42px';
  disc.style.borderRadius = '50%';
  disc.style.backgroundColor = isBuddy ? 'rgba(244, 63, 94, 0.15)' : 'rgba(37, 99, 235, 0.15)';
  disc.style.border = isBuddy ? '1.5px solid rgba(244, 63, 94, 0.35)' : '1.5px solid rgba(37, 99, 235, 0.35)';
  disc.style.display = 'flex';
  disc.style.alignItems = 'center';
  disc.style.justifyContent = 'center';

  // Arrow sits inside the disc, centered
  const arrowContainer = document.createElement('div');
  arrowContainer.id = arrowId;
  arrowContainer.style.position = 'absolute';
  arrowContainer.style.top = '4px';       // nudge toward top of disc
  arrowContainer.style.left = '50%';
  arrowContainer.style.transform = 'translateX(-50%)';
  arrowContainer.style.width = '26px';
  arrowContainer.style.height = '30px';
  arrowContainer.style.display = 'flex';
  arrowContainer.style.transition = 'transform 0.2s ease-out';
  arrowContainer.style.transformOrigin = 'bottom center';

  const lightColor = isBuddy ? '#f43f5e' : '#2563eb';
  const darkColor  = isBuddy ? '#be123c' : '#1d4ed8';

  const leftSide = document.createElement('div');
  leftSide.style.width = '50%';
  leftSide.style.height = '100%';
  leftSide.style.backgroundColor = lightColor;
  leftSide.style.clipPath = 'polygon(100% 0%, 100% 72%, 0% 100%, 100% 0%)';

  const rightSide = document.createElement('div');
  rightSide.style.width = '50%';
  rightSide.style.height = '100%';
  rightSide.style.backgroundColor = darkColor;
  rightSide.style.clipPath = 'polygon(0% 0%, 100% 100%, 0% 72%, 0% 0%)';

  arrowContainer.appendChild(leftSide);
  arrowContainer.appendChild(rightSide);
  disc.appendChild(arrowContainer);

  return disc;
};

export const createCustomPins=async(start:boolean)=>{
     
const { PinElement } = await importLibrary('marker') as google.maps.MarkerLibrary;

 const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.width = '45px';
  container.style.height = '45px';
  
  // 2. Create your profile photo marker inside a base pin
  const pinBackground = new PinElement({
    background: "red", // The pin color
    borderColor: "#137333",
    glyphColor: "red",
  });

  // 2. Create the image for the photo
const userIcon = document.createElement('img');
        userIcon.src = '/me.png'; 
        userIcon.style.width = '32px';  // Keep it small to fit in the pin
        userIcon.style.height = '32px';
        userIcon.style.borderRadius = '50%'; // Make the photo circular
        userIcon.style.objectFit = 'cover';
        
        // 3. Put the photo inside the Pin's glyph area
        pinBackground.glyph = userIcon;

        const arrow = createGoogleArrow('user-nav-arrow', false); // Your blue arrow
if(start){
  if(container.contains(pinBackground))
     container.removeChild(pinBackground);
     container.appendChild(arrow);
}else{
  container.appendChild(pinBackground.element);
  if(container.contains(arrow))
     container.removeChild(arrow);
}

// Your friend's marker stays simple (no compass arrow needed for them)
const pinbuddyBackground = new PinElement({
  background: "blue",
  borderColor: "#137333",
  glyphColor: "transparent",
});


const buddycontainer = document.createElement('div');
buddycontainer.style.position = 'relative';
buddycontainer.style.width = '45px';
buddycontainer.style.height = '45px';


const buddyIcon = document.createElement('img');
  buddyIcon.src = '/friend.png'; 
  buddyIcon.style.width = '32px';       
  buddyIcon.style.height = '32px'; 
  buddyIcon.style.borderRadius = '50%'; 
  buddyIcon.style.objectFit = 'cover';
  pinbuddyBackground.glyph = buddyIcon;
  
  const buddyarrow = createGoogleArrow('user-nav-buddyarrow', true); // Your buddy's green arrow
  if(start){
    buddycontainer.appendChild(buddyarrow);
  }else{
    buddycontainer.appendChild(pinbuddyBackground.element);
  }

         return {pinBackground:container,pinbuddyBackground:buddycontainer,userArrow:arrow,buddyArrow:buddyarrow}
  }

  interface LatLngLiteral {
  lat: number;
  lng: number;
  altitude?: number; // Optional, since you included it in some places
}

  interface marker{
    mapInstance:google.maps.Map
    mypos:LatLngLiteral
    friendpos:LatLngLiteral
    myMarkerRef:RefObject<google.maps.marker.AdvancedMarkerElement|null>
    myFriendMarkerRef:RefObject<google.maps.marker.AdvancedMarkerElement|null>
    userArrowRef:RefObject<HTMLDivElement | null>;
    start:boolean
  }

  export const Markers=async({mapInstance,mypos,friendpos,myMarkerRef,myFriendMarkerRef,userArrowRef,start}:marker)=>{
    
    const { AdvancedMarkerElement } = await importLibrary('marker')

         //Marker on you
                    const { pinBackground, pinbuddyBackground,userArrow } = await createCustomPins(start);
                    if(userArrowRef)
                        userArrowRef.current=userArrow;

                   if(myMarkerRef.current){

                     myMarkerRef.current.position=mypos;
                     myMarkerRef.current.content=pinBackground;
                    }
                    else{
                      myMarkerRef.current = new AdvancedMarkerElement({
                       position: mypos,
                       map: mapInstance,
                       title: "📍 You are here!",
                       content: pinBackground
                      })
                    }

                    if(myFriendMarkerRef.current){
                      
                      myFriendMarkerRef.current.position=friendpos;
                      myFriendMarkerRef.current.content=pinbuddyBackground;
                    }
                    else{
                      myFriendMarkerRef.current = new AdvancedMarkerElement({
                        position: friendpos,
                        map: mapInstance,
                        title: "📍 Your are friend is here!",
                        content: pinbuddyBackground,
                        collisionBehavior: 'REQUIRED',
                      })
                    }
  }


