//@ts-nocheck
import CryptoJS from 'crypto-js';
import { getSongDetails } from "@/lib/api";

import { Track as DefaultTrack } from 'react-native-track-player';
export interface Track extends DefaultTrack {
  songId : string
}
import he from "he"

export function parseString(name:string){
  return he.decode(name).replace(/\s*\(.*\)\s*$/, '')
}

export function decryptUrl(encryptedUrl: string, key: string) {
  const bytes = CryptoJS.DES.decrypt(encryptedUrl, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse('0000000000000000'), 
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7, 
  });

  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted.replace("_96.mp4", "_320.mp4"); 
}


export function processMediaUrls(data: any) {
  try {
    const decryptedMediaUrl = decryptUrl(data.encrypted_media_url, '38346591'); 
    data.media_url = decryptedMediaUrl;

    if (data['320kbps'] !== "true") {
      data.media_url = data.media_url.replace("_320.mp4", "_160.mp4");
    }

    data.media_preview_url = data.media_url
      .replace("_320.mp4", "_96_p.mp4")
      .replace("_160.mp4", "_96_p.mp4")
      .replace("//aac.", "//preview.");
  } catch (error) {
    let url = data.media_preview_url || '';
    if (url) {
      url = url.replace("preview", "aac");
      if (data['320kbps'] === "true") {
        url = url.replace("_96_p.mp4", "_320.mp4");
      } else {
        url = url.replace("_96_p.mp4", "_160.mp4");
      }
      data.media_url = url;
    }
  }
  return data;
}


export function parseTrackPlayer(songData:any): Track {
  const input = processMediaUrls(songData)
  return {
    songId : input.id ,
    url: input.media_url, 
    title: parseString(input.song) || "SONG" , 
    artist: parseString(input.primary_artists), 
    album: parseString(input.album), 
    genre: input.language, 
    date: new Date(input.release_date).toISOString(), 
    artwork: input.image.replace("50x50" , "500x500").replace("150x150" , "500x500"), 
    duration: parseInt(input.duration), 
  };
}


export async function getSongParsedData(songId: string) {
      const songDetails = await getSongDetails(songId);
        if (!songDetails) {
          console.warn("No song details found for the provided ID");
          return;
        }
        
        const parsedData = parseTrackPlayer(songDetails[songId]);
        console.log("Parsed data for TrackPlayer:", parsedData);

        return parsedData
}