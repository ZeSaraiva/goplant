import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 38,
          color: '#22c55e',
          letterSpacing: 1.2,
          marginTop: 8,
        },
        headerStyle: {
          backgroundColor: '#f3f4f6',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'GoPlant',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="dashboard" color="#4CAF50" />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          tabBarIcon: ({ color }) =><FontAwesome6 name="qrcode" size={24} color="#4CAF50" />,
          title: 'GoPlant',
          tabBarLabel: 'Scanner',
        }}
      />
      <Tabs.Screen
        name="cuidados"
        options={{
          title: 'GoPlant',
          tabBarLabel: 'Cuidados',
          tabBarIcon: ({ color }) => <FontAwesome6 name="sun-plant-wilt" size={28} color="#4CAF50" />,
        }}
      />
      <Tabs.Screen
        name="procurar"
        options={{
          title: 'GoPlant',
          tabBarLabel: 'Procurar',
          tabBarIcon: ({ color }) => <FontAwesome5 name="search" size={24} color="#4CAF50" />,
        }}
      />
    </Tabs>
  );
}
