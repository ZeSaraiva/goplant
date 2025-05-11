import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#4CAF50" }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="dashboard" color="#4CAF50" />,
        }}
      />
      <Tabs.Screen
        name="plantas"
        options={{
          title: 'Plantas',
          tabBarIcon: ({ color }) =><FontAwesome6 name="plant-wilt" size={24} color="#4CAF50" />,
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
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color="#4CAF50" />,
        }}
      />
           
    </Tabs>
    
  );
}
