
import MapInterface from "@/components/MapInterface";
import { LobbyInstance } from "@/utils/LobbyInstance";

interface PageProps{
    params:Promise<{lobbyId:string,userId:string}>
}

export default async function Page({params}:PageProps){
    const {lobbyId,userId}=await params;
     
    return (
    <main style={{ position: "relative" }}>
      <MapInterface lobbyId={lobbyId} userId={userId}/>
    </main>
  )
}