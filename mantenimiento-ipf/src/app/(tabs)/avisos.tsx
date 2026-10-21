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
import { reportsLib } from '@/lib/reports';
import { Aviso } from '@/types';

const formatearFecha = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${hora}:${min}`;
  } catch {
    return isoString;
  }
};

export default function AvisosScreen() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  const cargarAvisos = async () => {
    try {
      const data = await reportsLib.obtenerAvisos();
      setAvisos(data);
    } catch (error) {
      console.error('Error al cargar avisos:', error);
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarAvisos();
    }, [])
  );

  const handleMarcarLeido = async (id: string) => {
    await reportsLib.marcarAvisoLeido(id);
    setAvisos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, leido: true } : a))
    );
  };

  const noLeidos = avisos.filter((a) => !a.leido).length;

  return (
    <View style={styles.container}>
      <FlatList
        data={avisos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Bandeja de Avisos</Text>
            <Text style={styles.subtitle}>
              Notificaciones internas generadas por las resoluciones de reportes edilicios.
            </Text>
            {avisos.length > 0 ? (
              <View style={styles.badgeRow}>
                <Text style={styles.badgeText}>
                  {noLeidos > 0 ? `${noLeidos} sin leer` : 'Todos los avisos leídos'}
                </Text>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.avisoCard,
              !item.leido && styles.avisoCardNoLeido,
              pressed && styles.cardPressed,
            ]}
            onPress={() => handleMarcarLeido(item.id)}>
            <View style={styles.avisoHeader}>
              <View style={styles.avisoTitleRow}>
                {!item.leido ? (
                  <View style={styles.unreadTag}>
                    <Text style={styles.unreadTagText}>NUEVO</Text>
                  </View>
                ) : null}
                <Text style={styles.avisoFecha}>{formatearFecha(item.fecha)}</Text>
              </View>
              {!item.leido ? (
                <Text style={styles.markReadAction}>Tocar para marcar leído</Text>
              ) : null}
            </View>

            <Text style={styles.avisoMensaje}>{item.mensaje}</Text>

            <View style={styles.avisoFooter}>
              <Pressable
                style={styles.viewReportButton}
                onPress={() => router.push(`/reporte/${item.reporteId}`)}>
                <Text style={styles.viewReportButtonText}>Ver reporte asociado →</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          cargando ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.emptySubtitle}>Cargando avisos...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyTitle}>Sin avisos pendientes</Text>
              <Text style={styles.emptySubtitle}>
                Cuando simules la resolución de un reporte, se generará y registrará automáticamente un aviso interno en esta bandeja.
              </Text>
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
  badgeRow: {
    marginTop: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  avisoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    gap: 8,
  },
  avisoCardNoLeido: {
    borderColor: '#bfdbfe',
    backgroundColor: '#f8fafc',
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  cardPressed: {
    opacity: 0.9,
  },
  avisoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avisoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadTag: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unreadTagText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  avisoFecha: {
    fontSize: 12,
    color: '#9ca3af',
  },
  markReadAction: {
    fontSize: 11,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  avisoMensaje: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  avisoFooter: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  viewReportButton: {
    alignSelf: 'flex-start',
  },
  viewReportButtonText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
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
  },
});
