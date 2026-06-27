import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewPay() {
    const { payUrl } = useLocalSearchParams<{ payUrl: string }>();

    return (
        <View className='flex-1 bg-gray-50 pt-[40px] pb-[50px] px-4'>
            <WebView
                source={{ uri: payUrl }}
                style={{ flex: 1 }}
            />
        </View>

    );
}