import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

type CountdownProps = {
  serverNowUTC: string;  // ex: "2026-07-30T11:45:29.975Z"
  targetDateUTC: string; // ex: "2026-07-30T11:47:29.975Z"
  onFinish: () => void;
};

export default function Countdown({ serverNowUTC, targetDateUTC, onFinish }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    const serverTime = new Date(serverNowUTC).getTime();
    const targetTime = new Date(targetDateUTC).getTime();
    const localNowAtFetch = Date.now();

    // ⚡ Calcul du décalage d'horloge entre le téléphone et le serveur
    // Si clockOffset > 0, l'horloge du téléphone est en avance sur le serveur
    const clockOffset = localNowAtFetch - serverTime;

    const updateTimer = () => {
      // On corrige l'heure du téléphone avec le décalage serveur
      const correctedLocalNow = Date.now() - clockOffset;
      
      // Temps restant basé sur le temps réel du serveur
      const diffSeconds = Math.max(Math.ceil((targetTime - correctedLocalNow) / 1000), 0);
      
      setTimeLeft(diffSeconds);

      if (diffSeconds <= 0) {
        onFinishRef.current();
        return true;
      }
      return false;
    };

    const isFinished = updateTimer();
    if (isFinished) return;

    const interval = setInterval(() => {
      const finished = updateTimer();
      if (finished) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [serverNowUTC, targetDateUTC]);

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