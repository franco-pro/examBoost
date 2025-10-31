import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

type CountdownProps = {
  targetDateUTC: string; // ex: "2025-10-30T14:30:00Z"
  onFinish: () => void; // fonction à déclencher quand le timer atteint 0
};

export default function Countdown({ targetDateUTC, onFinish }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0); // temps restant en secondes

  useEffect(() => {
    // Calcul du temps restant en secondes
    const targetTime = new Date(targetDateUTC).getTime();
    const now = Date.now();
    const diffSeconds = Math.max(Math.floor((targetTime - now) / 1000), 0);
    setTimeLeft(diffSeconds);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onFinish(); // déclenche la fonction parent
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateUTC]);

  // Calcul minutes et secondes pour affichage
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 24 }} className="text-primary-defaultOrange">
        {String(minutes).padStart(2, "0")} : {String(seconds).padStart(2, "0")}
      </Text>
    </View>
  );
}
