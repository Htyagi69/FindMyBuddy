import { importLibrary } from '@googlemaps/js-api-loader';

export const createCustomPins=async()=>{
     
const { PinElement } = await importLibrary('marker') as google.maps.MarkerLibrary;

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
        userIcon.style.borderRadius = '50%'; // Make the photo circular
        userIcon.style.objectFit = 'cover';
        
        // 3. Put the photo inside the Pin's glyph area
        pinBackground.glyph = userIcon;

    
        
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
         return {pinBackground,pinbuddyBackground}
        }