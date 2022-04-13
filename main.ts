import { highestQuality, initAll, spliceMessage } from "./ttvemotes";

initAll();

//todo init with channel names (will only redownload if timestamp needs it)
//todo auto reload occasionally (should it? or is this a program that will be restarted regularly)
//todo add reloadAll()

spliceMessage('OMEGALUL', 'xqcow', emote => {
    console.log(emote);
    return highestQuality(emote);
});