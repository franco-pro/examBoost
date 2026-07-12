import React, { memo } from "react";
import { View, Text, Image, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

interface PdfWatermarkProps {
  username: string;
  email?: string;
  opacity?: number;
  logo?: any;
}

function PdfWatermark({
  username,
  email,
  opacity = 0.08,
  logo,
}: PdfWatermarkProps) {
  const rows = 5;
  const cols = 3;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        width,
        height,
        zIndex: 999,
      }}
    >
      {Array.from({ length: rows }).map((_, row) => (
        <View
          key={row}
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 45,
          }}
        >
          {Array.from({ length: cols }).map((_, col) => (
            <View
              key={col}
              style={{
                alignItems: "center",
                transform: [
                  {
                    rotate: "-30deg",
                  },
                ],
              }}
            >
              {logo && (
                <Image
                  source={logo}
                  style={{
                    width: 40,
                    height: 40,
                    opacity,
                    marginBottom: 4,
                  }}
                  resizeMode="contain"
                />
              )}

              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 16,
                  color: "#181C5C",
                  opacity,
                }}
              >
                ExamBoost
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: "#181C5C",
                  opacity,
                }}
              >
                {username}
              </Text>

              {email ? (
                <Text
                  style={{
                    fontSize: 10,
                    color: "#181C5C",
                    opacity,
                  }}
                >
                  {email}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export default memo(PdfWatermark);
