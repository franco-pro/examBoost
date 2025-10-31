import { Text } from "@/components/ui/text";
import React, { useEffect, useState } from "react";

export function Timer() {
  const [heure, setHeure] = useState(0);
  const [minute, setMinute] = useState(0);
  const [seconde, setSeconde] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconde((prevSec) => {
        if (prevSec === 59) {
          setMinute((prevMin) => {
            if (prevMin === 59) {
              setHeure((prevHour) => (prevHour === 23 ? 0 : prevHour + 1));
              return 0;
            }
            return prevMin + 1;
          });
          return 0;
        }
        return prevSec + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Text size="lg" className="text-primary-defaultOrange">
      {heure.toString().padStart(2, "0")}:
      {minute.toString().padStart(2, "0")}:
      {seconde.toString().padStart(2, "0")}
    </Text>
  );
}

export default Timer;
