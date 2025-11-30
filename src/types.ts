export interface SongFile {
    name: string,
    url: string 
}

export enum PlayerControl {
    Play = 1,
    Pause,
    VolumeUp,
    VolumeDown
}