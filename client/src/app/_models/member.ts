import { Photo } from "./Photo";

export interface Member {
    id: number;
    username: string;
    age: number;
    photoUrl: string;
    knownAs?: any;
    created: Date;
    lastActive: Date;
    gender: string;
    introduction: string;
    lookingFor: string;
    interests: string;
    city: string;
    country: string;
    photos: Photo[];
}