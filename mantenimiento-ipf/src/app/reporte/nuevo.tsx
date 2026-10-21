import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ReportForm } from '@/components/ReportForm';

export default function NuevoReporteScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>Nuevo Reporte Edilicio</Text>
        <Text style={styles.subtitle}>
          Registrá un problema de mantenimiento. Ningún permiso de hardware se solicita al ingresar; solo se pedirán al pulsar cada acción específica.
        </Text>
      </View>

      <ReportForm
        onSuccess={(reporte) => {
          router.replace(`/reporte/${reporte.id}`);
        }}
      />
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
    marginBottom: 20,
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
});
