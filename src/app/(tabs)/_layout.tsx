import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#4CAF50" }}>
      <Tabs.Screen
        name="index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="dashboard" color="#4CAF50" />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color }) =><FontAwesome6 name="qrcode" size={24} color="#4CAF50" />,
        }}
      />
            <Tabs.Screen
        name="cuidados"
        options={{
          title: 'Cuidados',
          tabBarIcon: ({ color }) => <FontAwesome6 name="sun-plant-wilt" size={28} color="#4CAF50" />,
        }}
      />
            <Tabs.Screen
        name="procurar"
        options={{
          title: 'Procurar',
          tabBarIcon: ({ color }) => <FontAwesome5 name="search" size={24} color="#4CAF50" />,
        }}
      />
           
    </Tabs>
    
  );
}
