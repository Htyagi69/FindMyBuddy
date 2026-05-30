

export const LobbyInstance=()=>{
    const lobbyId=Math.random().toString(36).substring(2,8).toUpperCase();
    const shareUrl=`${window.location.origin}/lobby/${lobbyId}`;
    return shareUrl;
}