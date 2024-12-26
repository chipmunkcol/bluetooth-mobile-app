// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// import Customheader from '../component/Cutomheader';
// import Index from '.';
// import Sensing from './Sensing';
import { Tabs } from 'expo-router';
import { Color } from '@/app/styles/color';
import Customheader from '../components/Cutomheader';

const TabIcon = ({ name, size, color }) => {
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
};
const TabIcons = ({ name, size, color }) => {
    return <MaterialIcons name={name} size={size} color={color} />;
};

export default function TabLayout() {
    return (
        <>
            <Tabs>
                <Tabs.Screen
                    name="sensing"
                    options={{
                        title: '충전내역',
                        header: () => <Customheader title="충전내역" />,
                        tabBarActiveTintColor: Color.main,
                        tabBarInactiveTintColor: '#93B5C6',
                        tabBarIcon: (props) => TabIcon({ ...props, name: 'monitor-multiple' }),
                    }}
                />
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'LUTECH',
                        header: () => <Customheader title="LUTECH" />,
                        tabBarActiveTintColor: Color.main,
                        tabBarInactiveTintColor: '#93B5C6',
                        tabBarIcon: (props) => TabIcon({ ...props, name: 'cog' }),
                    }}
                />
            </Tabs>
        </>
    );
}

// <Tabs screenOptions={{ tabBarActiveTintColor: '#ffd33d' }}>
//     <Tabs.Screen
//         name="index"
//         options={{
//             title: 'LUTECH',
//             headerTitleAlign: 'center',
//             headerTitleStyle: { color: '#fff' },
//             headerStyle: { backgroundColor: Color.main },
//             // headerTitleContainerStyle: { , backgroundColor: '#25292e' },
//             tabBarIcon: ({ color, focused }) => (
//                 <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
//             ),
//         }}
//     />
//     <Tabs.Screen
//         name="about"
//         options={{
//             title: 'About',
//             tabBarIcon: ({ color, focused }) => (
//                 <Ionicons
//                     name={focused ? 'information-circle' : 'information-circle-outline'}
//                     color={color}
//                     size={24}
//                 />
//             ),
//         }}
//     />
// </Tabs>
