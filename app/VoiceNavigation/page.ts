export const VoiceNavigation=function(content:string){

    const cleanText=content.replace(/<[^>]*>/g, '');
    const  utterance=new SpeechSynthesisUtterance(cleanText);

    utterance.lang='en-US';
    utterance.rate=1.0;

    window.speechSynthesis.speak(utterance)
}