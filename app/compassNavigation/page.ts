    
    interface LatLng{
        mylat:number;
        mylng:number;
        buddylat:number;
        buddylng:number;
    }

    // Bearing between two GPS coords (which direction is my buddy?)

  export const getBearing=({mylat,mylng,buddylat,buddylng}:LatLng)=>{
  const q1=mylat * Math.PI /180;
  const q2=buddylat * Math.PI/180;
  const deg= (buddylng-mylng)* Math.PI/180;
  
  const y = Math.sin(deg) * Math.cos(q2);
  const x = Math.cos(q1)*Math.sin(q2) - Math.sin(q1)*Math.cos(q2)*Math.cos(deg);
  const theta = Math.atan2(y,x);
  return ((theta * 180/Math.PI)+360)%360;
}

// Haversine distance (how far away?)


export const getDistance=({mylat,mylng,buddylat,buddylng}:LatLng)=>{
    const R=6371000;
    const q1=mylat * Math.PI /180;
    const q2=buddylat * Math.PI/180;
    const latdeg= (buddylat-mylat) *Math.PI/180;
    const deg= (buddylng-mylng)* Math.PI/180;

    const a= Math.sin(latdeg/2) **2 + Math.cos(q1) * Math.cos(q2) * Math.sin(deg/2) **2;

    return R * 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

//Rotate the arrow

export function getRelativeBearing( buddyBearing:number,deviceHeading:number){
   return ((buddyBearing-deviceHeading)+360)%360;
}


export function bearingtoCardinal(bearing:number){
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE',
                'S','SSW','SW','WSW','W','WNW','NW','NNW'];
                return dirs[Math.round(bearing/22.5) %16];
}

