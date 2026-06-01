import { importLibrary } from '@googlemaps/js-api-loader';

     
  interface LatLng{
    mylat:number;
    mylng:number;
    buddylat:number;
    buddylng:number;
    }
    
      let currentPolyLines:any[]=[]
      
          const drawRoute=async({ mylat, mylng, buddylat, buddylng }: LatLng)=>{
        const originLatLng={lat:mylat,lng:mylng};
        const destinationLatLng={lat:buddylat,lng:buddylng};

        const request={
            origin:originLatLng,
            destination:destinationLatLng,
            fields:["path"],
            // fields: ["routes.polyline", "routes.duration", "routes.distanceMeters"],
            computeAlternativeRoutes:false,
            // travelMode:'WALKING' as const,
            travelMode:'DRIVING' as const,
            // routeModifiers:{
            //     avoidTolls:true,
            // }
        }
        return  request;
    }
       export const drawPolyLines=async(origin:any,destination:any,mapInstance:google.maps.Map | null)=>{
        if (!mapInstance) return;
         const { Route } = await importLibrary('routes') as google.maps.RoutesLibrary;

            currentPolyLines.forEach(p=>p.setMap(null));
            currentPolyLines=[]
             const request=await drawRoute({mylat: origin.lat,mylng: origin.lng,buddylat: destination.lat,buddylng: destination.lng });
               const {routes}=await Route.computeRoutes(request);
                console.log("routes",routes);
                if(routes && routes.length>0){
                    const mapPolyLines=routes[0].createPolylines();
                        mapPolyLines.forEach((polyline : any) => {
                             polyline.setMap(mapInstance);
                             currentPolyLines.push(polyline)
                            });
                        }else{
                            console.log("No routes found");
                            return;
                        }
        }