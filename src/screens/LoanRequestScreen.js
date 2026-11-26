
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { apiFetch } from '../services/api';

export default function LoanRequestScreen({ route, navigation }) {
  const { libro } = route.params;

  const [fechaDevolucion, setFechaDevolucion] = useState('2026-12-01');
  const [loading, setLoading] = useState(false);

  const confirmarSolicitud = async () => {
    try {
      setLoading(true);

      const respuesta = await apiFetch('/api/loans/books', {
        method: 'POST',
        body: JSON.stringify({
          bookId: libro.id,
          fechaDevolucionEstimada: fechaDevolucion,
        }),
      });

      Alert.alert(
        '¡Solicitud registrada!',
        `Tu préstamo de "${respuesta.libro || libro.titulo}" se registró correctamente.`,
        [
          {
            text: 'Aceptar',
            onPress: () => navigation.navigate('MyLoans'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('No se pudo registrar', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitud de préstamo</Text>

      <View style={styles.card}>
        <Text style={styles.bookTitle}>{libro.titulo}</Text>
        <Text style={styles.author}>Autor: {libro.autor}</Text>
        <Text style={styles.detail}>ISBN: {libro.isbn}</Text>
        <Text style={styles.detail}>
          Disponibles: {libro.stockDisponible}
        </Text>
      </View>

      <Text style={styles.label}>Fecha estimada de devolución</Text>

      <View style={styles.dateContainer}>
        <Pressable
          style={[
            styles.dateButton,
            fechaDevolucion === '2026-12-01' && styles.selectedDate,
          ]}
          onPress={() => setFechaDevolucion('2026-12-01')}
          disabled={loading}
        >
          <Text style={styles.dateText}>1 Dic</Text>
        </Pressable>

        <Pressable
          style={[
            styles.dateButton,
            fechaDevolucion === '2026-12-05' && styles.selectedDate,
          ]}
          onPress={() => setFechaDevolucion('2026-12-05')}
          disabled={loading}
        >
          <Text style={styles.dateText}>5 Dic</Text>
        </Pressable>

        <Pressable
          style={[
            styles.dateButton,
            fechaDevolucion === '2026-12-10' && styles.selectedDate,
          ]}
          onPress={() => setFechaDevolucion('2026-12-10')}
          disabled={loading}
        >
          <Text style={styles.dateText}>10 Dic</Text>
        </Pressable>
      </View>

      <Text style={styles.selectedLabel}>
        Fecha seleccionada: {fechaDevolucion}
      </Text>

      <Pressable
        style={[
          styles.confirmButton,
          loading && styles.disabledButton,
        ]}
        onPress={confirmarSolicitud}
        disabled={loading || libro.stockDisponible <= 0}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Confirmar solicitud</Text>
        )}
      </Pressable>

      <Pressable
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={styles.cancelText}>Cancelar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#17365D',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 25,
  },
  bookTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#17365D',
    marginBottom: 8,
  },
  author: {
    color: '#444444',
    marginBottom: 8,
  },
  detail: {
    color: '#666666',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#17365D',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#DCE7FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedDate: {
    backgroundColor: '#25C85A',
  },
  dateText: {
    color: '#17365D',
    fontWeight: 'bold',
  },
  selectedLabel: {
    marginTop: 15,
    color: '#555555',
  },
  confirmButton: {
    backgroundColor: '#073DA8',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
});
