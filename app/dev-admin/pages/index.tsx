//new page dev administration

import { RootState } from "@/app/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function DevAdmin() {
    const { user, accessToken, others } = useSelector(
        (state: RootState) => state.user
      );
    useEffect(() => {
        console.log("user:", user);
        console.log("accessToken:", accessToken);
        console.log("others:", others);
     })
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">Dev Admin Page</h1>
            <p className="text-lg text-gray-600">This page is for development and administration purposes.</p>
        </div>
    );
}