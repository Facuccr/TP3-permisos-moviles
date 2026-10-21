import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useReportDraft } from '@/hooks/useReportDraft';

export default function NuevoReporteScreen() {
  const { borrador, limpiarBorrador, cargando } = useReportDraft();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nuevo Reporte</Text>
        <Text style={styles.subtitle}>
          Completá los datos del problema edilicio. Los accesos a hardware se solicitan únicamente al presionar cada acción.
        </Text>
      </View>

      <View style={styles.draftCard}>
        <View style={styles.draftHeader}>
          <Text style={styles.draftTitle}>Estado del Borrador Compartido</Text>
          <Pressable onPress={() => limpiarBorrador()} style={styles.clearDraftButton}>
            <Text style={styles.clearDraftText}>Limpiar</Text>
          </Pressable>
        </View>

        <View style={styles.draftRow}>
          <Text style={styles.draftLabel}>Aula:</Text>
          <Text style={styles.draftValue}>{borrador.aula || '(no definida)'}</Text>
        </View>

        <View style={styles.draftRow}>
          <Text style={styles.draftLabel}>Fotografía:</Text>
          <Text style={styles.draftValue}>
            {borrador.fotoUri ? 'Foto adjuntada en borrador' : '(sin fotografía)'}
          </Text>
        </View>

        <View style={styles.draftRow}>
          <Text style={styles.draftLabel}>Sector / Ubicación:</Text>
          <Text style={styles.draftValue}>
            {borrador.sector ||
              (borrador.ubicacion
                ? borrador.ubicacion.aproximada
                  ? 'Ubicación aproximada'
                  : 'Ubicación precisa'
                : '(no definida)')}
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Acciones contextuales</Text>

        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
          onPress={() => router.push('/reporte/escanear')}>
          <Text style={styles.actionIcon}>📷</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Escanear código QR de aula</Text>
            <Text style={styles.actionSubtitle}>
              {borrador.aula ? `Aula actual: ${borrador.aula}` : 'Identificar aula automáticamente'}
            </Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
          onPress={() => router.push('/reporte/foto')}>
          <Text style={styles.actionIcon}>🖼️</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Adjuntar fotografía</Text>
            <Text style={styles.actionSubtitle}>
              {borrador.fotoUri ? 'Cambiar o ver fotografía' : 'Tomar foto o elegir del selector'}
            </Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
          onPress={() => router.push('/reporte/ubicacion')}>
          <Text style={styles.actionIcon}>📍</Text>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Determinar ubicación</Text>
            <Text style={styles.actionSubtitle}>
              {borrador.sector || (borrador.ubicacion ? 'Ubicación registrada' : 'GPS o ingreso manual')}
            </Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </Pressable>
      </View>

      <View style={styles.placeholderBox}>
        <Text style={styles.placeholderText}>
          {cargando
            ? 'Cargando persistencia...'
            : 'El borrador se preserva automáticamente entre navegación y reinicios de la aplicación.'}
        </Text>
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
    marginBottom: 16,
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
  draftCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
    gap: 8,
  },
  draftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  draftTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  clearDraftButton: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#fee2e2',
  },
  clearDraftText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '500',
  },
  draftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  draftLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  draftValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  buttonPressed: {
    backgroundColor: '#f3f4f6',
  },
  actionIcon: {
    fontSize: 24,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
    color: '#9ca3af',
  },
  placeholderBox: {
    backgroundColor: '#eef2ff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  placeholderText: {
    fontSize: 13,
    color: '#4338ca',
    lineHeight: 18,
    textAlign: 'center',
  },
});
