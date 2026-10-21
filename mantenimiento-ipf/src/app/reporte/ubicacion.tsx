import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useReportDraft } from '@/hooks/useReportDraft';

export default function UbicacionScreen() {
  const { borrador, actualizarBorrador } = useReportDraft();

  const handleSimularUbicacion = async (tipo: 'aproximada' | 'precisa') => {
    // Si es aproximada, matiz sin coordenadas exactas
    await actualizarBorrador({
      ubicacion: {
        latitud: tipo === 'precisa' ? -34.6037 : undefined,
        longitud: tipo === 'precisa' ? -58.3816 : undefined,
        aproximada: tipo === 'aproximada',
      },
      sector: undefined,
    });
    router.back();
  };

  const handleSimularSector = async (sector: string) => {
    await actualizarBorrador({
      sector,
      ubicacion: undefined,
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ubicación del Reporte</Text>
        <Text style={styles.subtitle}>
          Permite geolocalizar la incidencia en primer plano o ingresar manualmente el sector edilicio.
        </Text>
      </View>

      {borrador.sector || borrador.ubicacion ? (
        <View style={styles.currentCard}>
          <Text style={styles.cardHeaderSmall}>Ubicación actual en borrador:</Text>
          <Text style={styles.cardValueSmall}>
            {borrador.sector ||
              (borrador.ubicacion?.aproximada
                ? 'Ubicación aproximada (sin exponer coordenadas exactas)'
                : `Ubicación precisa: ${borrador.ubicacion?.latitud}, ${borrador.ubicacion?.longitud}`)}
          </Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardIcon}>📍</Text>
        <Text style={styles.cardTitle}>Geolocalización en primer plano</Text>
        <Text style={styles.cardDescription}>
          Si el usuario concede permiso aproximado, no se expondrán coordenadas exactas y se indicará &apos;Ubicación aproximada&apos; (R05).
        </Text>
        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
            onPress={() => handleSimularUbicacion('aproximada')}>
            <Text style={styles.actionButtonText}>Aproximada</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
            onPress={() => handleSimularUbicacion('precisa')}>
            <Text style={styles.actionButtonText}>Precisa</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.fallbackBox}>
        <Text style={styles.fallbackTitle}>Alternativa sin GPS (Ingreso manual de sector)</Text>
        <Text style={styles.fallbackText}>
          Podés especificar el sector o ala del edificio de forma manual sin solicitar permisos de ubicación.
        </Text>
        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [styles.secondarySmallButton, pressed && styles.buttonPressed]}
            onPress={() => handleSimularSector('Planta Baja - Hall')}>
            <Text style={styles.secondarySmallText}>Hall Central</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.secondarySmallButton, pressed && styles.buttonPressed]}
            onPress={() => handleSimularSector('Piso 1 - Ala Este')}>
            <Text style={styles.secondarySmallText}>Ala Este</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
        onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Volver al formulario</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  currentCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginVertical: 4,
  },
  cardHeaderSmall: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  cardValueSmall: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    gap: 8,
  },
  cardIcon: {
    fontSize: 32,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  fallbackBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  fallbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  fallbackText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  secondarySmallButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondarySmallText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '500',
  },
});
