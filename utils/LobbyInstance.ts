

export const LobbyInstance=(lobbyId:string,userId:string)=>{
   
    const shareUrl=`${window.location.origin}/MapView/lobby/${lobbyId}/${userId}`;
    return shareUrl;
}