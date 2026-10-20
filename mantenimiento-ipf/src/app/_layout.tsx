import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#1f2937',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="reporte/nuevo"
          options={{
            title: 'Nuevo Reporte',
          }}
        />
        <Stack.Screen
          name="reporte/escanear"
          options={{
            title: 'Escanear QR',
          }}
        />
        <Stack.Screen
          name="reporte/foto"
          options={{
            title: 'Adjuntar Foto',
          }}
        />
        <Stack.Screen
          name="reporte/ubicacion"
          options={{
            title: 'Ubicación',
          }}
        />
        <Stack.Screen
          name="reporte/[id]"
          options={{
            title: 'Detalle de Reporte',
          }}
        />
        <Stack.Screen
          name="permisos/[recurso]"
          options={{
            presentation: 'modal',
            title: 'Permiso Requerido',
          }}
        />
        <Stack.Screen
          name="ajustes-app"
          options={{
            title: 'Ajustes de la App',
          }}
        />
      </Stack>
    </>
  );
}
