import AsyncStorage from '@react-native-async-storage/async-storage';

export const getQuality = async (): Promise<"96" | "160" | "320"> => 
  (await AsyncStorage.getItem("quality")) as "96" | "160" | "320" || "320";

export const setQuality = async (quality: "96" | "160" | "320") => 
  await AsyncStorage.setItem("quality", quality);
