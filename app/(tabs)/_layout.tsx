import { useNotifications } from '@/src/features/notifications/hooks'
import { setCurrentUserId } from '@/src/redux/session/slice'
import { loadUserById } from '@/src/redux/users/slice'
import { Ionicons } from '@expo/vector-icons'
import { Tabs, usePathname } from 'expo-router'
import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import AppLayout from '../styles/AppLayout'

export default function RootLayout(){
    // TODO: remplacer par l'ID utilisateur réel quand l'auth sera prête
    const userID = 42
    const dispatch = useDispatch()
    const pathname = usePathname()
    const isOnNotifications = pathname?.endsWith('/notifications') || pathname === '/notifications'
    // Poll uniquement hors de la page notifications
    const { data } = useNotifications(userID, { refetchInterval: isOnNotifications ? false : 1000 })
    const unreadCount = useMemo(() => (data?.filter((n) => !n.read).length ?? 0), [data])

    useEffect(() => {
        dispatch(setCurrentUserId(userID))
        dispatch(loadUserById(userID) as any)
    }, [dispatch, userID])

    return(
        <AppLayout>
        <Tabs initialRouteName="index" screenOptions={{animation: 'none', tabBarActiveTintColor:'#181c5c',
            headerStyle:{
            backgroundColor: '#181c5c'
        },
        headerShadowVisible:false,
        tabBarInactiveTintColor: '#FFFFFF',
        headerTintColor:'#FFFFFF',
        tabBarStyle: {
            backgroundColor: '#ff894f'
        }
        
        }}>
            {/* Masquer le segment "packs" (sous-pages matières) de la barre d'onglets */}
            <Tabs.Screen name='packs' options={{ href: null }} />
            {/* Masquer la page profil dans les tabs, mais accessible par navigation */}
            <Tabs.Screen name='profile' options={{ href: null }} />
            <Tabs.Screen name='index' options={{title: 'Home',
                tabBarIcon: ({color,focused})=>(
                    <Ionicons name={focused? 'home-sharp':'home-outline'} color={color} size={24}/>
                )
            }}/>
            <Tabs.Screen name='transaction' options={{title:'Mes Transactions',
                tabBarIcon:({focused,color})=>(
                    <Ionicons name={focused?'swap-horizontal':'swap-horizontal-outline'} color={color} size={24} />
                )
            }}/>

            <Tabs.Screen name='pack' options={{title: 'Packs',
                tabBarIcon: ({focused,color})=>(
                    <Ionicons name={focused?'briefcase':'briefcase-outline'} color={color} size={24}/>
                )
            }}/>

            <Tabs.Screen name='competition' options={{title:'Competitions',
            tabBarIcon:({focused,color})=>(
                <Ionicons name={focused?'trophy':'trophy-outline'} color={color} size={24}/>
            )
            }}/>

            <Tabs.Screen name='notifications' options={{title:'Notifications',
            tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
            tabBarIcon:({focused,color})=>(
                <Ionicons name={focused?'notifications':'notifications-outline'} color={color} size={24}/>
            )
            }}/>
        </Tabs>
        </AppLayout>
    )
}