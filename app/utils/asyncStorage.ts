import asyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async(key:string,value:any)=>{
  try {
     await asyncStorage.setItem(key,value)
  } catch (e) {
    console.log("Error storing value", e)
  }
}

export const getItem = async(key:string)=>{
  try {
   const value =await asyncStorage.getItem(key)
   return value
  } catch (e) {
    console.log("error triving value", e)
    return null; 
  }
}

export const removeItem = async(key:string)=>{
  try {
    await asyncStorage.removeItem(key)
  } catch (e) {
    console.log("error removing value", e)
  }
}