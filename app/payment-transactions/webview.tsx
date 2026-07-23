import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { toastConfig } from '../config/toast.config';
import Toast from 'react-native-toast-message';
import { useAppSelector } from '../hooks/redux/redux.hooks';
import { useEffect, useState } from 'react';
import { updateDepositAction } from '../hooks/redux/users/users.slice';

export default function WebViewPay() {
    const { payUrl } = useLocalSearchParams<{ payUrl: string }>();
    
    return (
        <View className='flex-1 bg-gray-50 pt-[40px] pb-[50px] px-4'>
                {/* <TouchableOpacity
                    className="flex-row items-center mb-6"
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={"gray"} />
                    <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
                </TouchableOpacity> */}
            <WebView
                source={{ uri: payUrl }}
                style={{ flex: 1 }}
            />
        <Toast config={toastConfig} />    
        </View>

    );
}