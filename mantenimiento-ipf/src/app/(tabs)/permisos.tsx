import { Link, router } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PermisosScreen() {
  const recursos = [
    {
      id: 'camara',
      nombre: 'Cámara',
      descripcion: 'Escaneo de códigos QR en aulas y toma de fotografías.',
      icono: '📷',
    },
    {
      id: 'ubicacion',
      nombre: 'Ubicación',
      descripcion: 'Geolocalización en primer plano para ubicar la incidencia.',
      icono: '📍',
    },
    {
      id: 'notificaciones',
      nombre: 'Notificaciones',
      descripcion: 'Alertas locales al completarse la resolución de un reporte.',
      icono: '🔔',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Permisos</Text>
        <Text style={styles.subtitle}>
          Visualización de permisos del sistema, plataforma detectada ({Platform.OS}) y matices.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recursos del Sistema</Text>
        {recursos.map((rec) => (
          <View key={rec.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{rec.icono}</Text>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{rec.nombre}</Text>
                <Text style={styles.cardSubtitle}>{rec.descripcion}</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.outlineButton, pressed && styles.buttonPressed]}
              onPress={() => router.push(`/permisos/${rec.id}` as any)}>
              <Text style={styles.outlineButtonText}>Ver modal explicativo →</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.settingsSection}>
        <Link href="/ajustes-app" asChild>
          <Pressable style={({ pressed }) => [styles.settingsButton, pressed && styles.buttonPressed]}>
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
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  outlineButton: {
    backgroundColor: '#eff6ff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  outlineButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  settingsSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  settingsButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '500',
  },
});
