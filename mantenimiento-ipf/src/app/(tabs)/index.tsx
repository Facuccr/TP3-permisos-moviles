import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ReportCard } from '@/components/ReportCard';
import { reportsLib } from '@/lib/reports';
import { Reporte } from '@/types';

export default function ReportesScreen() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  const cargarReportes = async () => {
    try {
      const data = await reportsLib.obtenerReportes();
      setReportes(data);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarReportes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reportes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReportCard
            reporte={item}
            onPress={() => router.push(`/reporte/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Reportes Edilicios</Text>
              <Text style={styles.subtitle}>
                Visualizá el estado de los problemas edilicios o generá un nuevo reporte de mantenimiento.
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
              onPress={() => router.push('/reporte/nuevo')}>
              <Text style={styles.primaryButtonText}>+ Nuevo reporte</Text>
            </Pressable>

            {reportes.length > 0 ? (
              <View style={styles.statsRow}>
                <Text style={styles.statsText}>
                  Total: <Text style={styles.statsBold}>{reportes.length}</Text> reportes
                </Text>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          cargando ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.emptySubtitle}>Cargando reportes...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>Sin reportes registrados</Text>
              <Text style={styles.emptySubtitle}>
                Aún no creaste ningún reporte edilicio en este dispositivo.
              </Text>
              <Pressable
                style={({ pressed }) => [styles.emptyButton, pressed && styles.buttonPressed]}
                onPress={() => router.push('/reporte/nuevo')}>
                <Text style={styles.emptyButtonText}>Crear primer reporte</Text>
              </Pressable>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContent: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
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
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  statsRow: {
    marginTop: 8,
    marginBottom: 4,
  },
  statsText: {
    fontSize: 13,
    color: '#6b7280',
  },
  statsBold: {
    fontWeight: '700',
    color: '#111827',
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 20,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  emptyButton: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
});
