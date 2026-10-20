import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: '#111827',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Reportes',
          headerTitle: 'Mantenimiento IPF',
          tabBarLabel: 'Reportes',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>📋</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="avisos"
        options={{
          title: 'Avisos',
          headerTitle: 'Bandeja de Avisos',
          tabBarLabel: 'Avisos',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>🔔</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="permisos"
        options={{
          title: 'Permisos',
          headerTitle: 'Panel de Permisos',
          tabBarLabel: 'Permisos',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 18, color }}>🛡️</Text>
          ),
        }}
      />
    </Tabs>
  );
}
