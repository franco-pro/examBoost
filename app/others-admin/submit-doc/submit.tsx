import apiClient from "@/app/api/apiClient";
import { RootState } from "@/app/redux/store";
import { useState } from "react";
import { useSelector } from "react-redux";



export async  function SubmitDocument(
    fileToBase64: any,
    docFile: any,
    correctionFile: any,
    niveauID : any,
    fileType: any,
    subject: any,
    userID:any
) {
    
   

       if (!docFile) {
         throw new Error("Veuillez sélectionner une épreuve");
         }
         const docBase64 = await fileToBase64(docFile.uri);
         let correctionBase64 = null;

         if (correctionFile) {
           correctionBase64 = await fileToBase64(correctionFile.uri);
         }
         const payload = {
           base64Encode: docBase64,
           correctionBase64,
           subject,
           niveauID,
           fileType,
           userID,
         };

         await apiClient.post("/document", payload);
     };
    