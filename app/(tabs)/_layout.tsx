import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function RootLayout(){
    return(
        <Tabs screenOptions={{animation: 'none', tabBarActiveTintColor:'#1d1d5a',
            headerStyle:{
            backgroundColor: '#f07e34'
        },
        headerShadowVisible:false,
        headerTintColor:'#fff',
        tabBarStyle: {
            backgroundColor: '#fff'
        }
        
        }}>
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
        </Tabs>
    )
}