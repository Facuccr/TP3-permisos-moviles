import { Link, router } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PermissionStatus } from '@/components/PermissionStatus';
import { RecursoPermiso } from '@/types';

const RECURSOS: RecursoPermiso[] = ['camara', 'ubicacion', 'notificaciones'];

export default function PermisosScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Permisos</Text>
        <Text style={styles.subtitle}>
          Monitoreo del estado en tiempo real de los permisos de hardware, plataforma detectada ({Platform.OS.toUpperCase()}) y matices del sistema operativo.
        </Text>
      </View>

      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerTitle}>Principio de Mínimo Privilegio (R01)</Text>
        <Text style={styles.infoBannerText}>
          No se solicitan permisos al abrir la app. Todas las funciones tienen alternativa manual. Al cambiar permisos en Ajustes del dispositivo y regresar a la aplicación, el estado se reconsulta automáticamente mediante AppState.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado de Recursos por Hardware</Text>
        {RECURSOS.map((recurso) => (
          <PermissionStatus
            key={recurso}
            recurso={recurso}
            onVerExplicacion={() => router.push(`/permisos/${recurso}` as any)}
          />
        ))}
      </View>

      <View style={styles.settingsSection}>
        <Link href="/ajustes-app" asChild>
          <Pressable
            style={({ pressed }) => [styles.settingsButton, pressed && styles.buttonPressed]}>
            <Text style={styles.settingsButtonText}>⚙️ Ir a Ajustes de la Aplicación</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9fafb',
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  infoBanner: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    gap: 4,
  },
  infoBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  infoBannerText: {
    fontSize: 12,
    color: '#1e40af',
    lineHeight: 18,
  },
  section: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  settingsSection: {
    marginTop: 8,
  },
  settingsButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#f3f4f6',
  },
  settingsButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
});
