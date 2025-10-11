declare module 'expo-screen-capture' {
  // Minimal typings to satisfy TS 
  export function preventScreenCaptureAsync(): Promise<void>;
  export function allowScreenCaptureAsync(): Promise<void>;
}
