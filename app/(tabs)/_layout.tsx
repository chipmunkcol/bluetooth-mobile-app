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

export default function TabLayout() {
    return (
        <>
            <Tabs>
                <Tabs.Screen
                    name="sensing"
                    options={{
                        title: '센서현황',
                        header: () => <Customheader title="센서현황" />,
                        tabBarActiveTintColor: Color.main,
                        tabBarInactiveTintColor: '#93B5C6',
                        tabBarLabelStyle: { fontSize: 14 },
                        tabBarStyle: { height: 60 },
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="monitor-multiple" size={26} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="index"
                    options={{
                        // title: 'Sensomedi',
                        title: 'SENSOMEDI',
                        header: () => <Customheader title="SENSOMEDI" />,
                        tabBarActiveTintColor: Color.main,
                        tabBarInactiveTintColor: '#93B5C6',
                        tabBarLabelStyle: { fontSize: 14 },
                        tabBarStyle: { height: 60 },
                        tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cog" size={26} color={color} />,
                    }}
                />
            </Tabs>
        </>
    );
}
