import React from 'react';
import { View } from 'react-native';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-1 bg-primary-900">
      {children}
    </View>
  );
}