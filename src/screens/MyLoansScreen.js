
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { apiFetch } from '../services/api';

export default function MyLoansScreen() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarPrestamos = async () => {
    try {
      setLoading(true);
      setError('');

      const respuesta = await apiFetch('/api/loans/books');

      const lista = Array.isArray(respuesta)
        ? respuesta
        : respuesta?.data || respuesta?.prestamos || [];

      setPrestamos(lista);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const renderPrestamo = ({ item }) => {
    const estado = item.estatus || item.estado || 'PRESTADO';
    const devuelto = estado === 'DEVUELTO';

    return (
      <View style={styles.card}>
        <Text style={styles.titulo}>
          {item.libro || item.titulo}
        </Text>

        <Text style={styles.autor}>
          Autor: {item.autor}
        </Text>

        <Text style={styles.detalle}>
          Fecha de préstamo: {item.fechaPrestamo}
        </Text>

        <Text style={styles.detalle}>
          Fecha estimada de devolución:{' '}
          {item.fechaDevolucionEstimada || item.fechaDevolucion}
        </Text>

        {item.fechaDevolucionReal && (
          <Text style={styles.detalle}>
            Fecha de devolución real: {item.fechaDevolucionReal}
          </Text>
        )}

        <View
          style={[
            styles.estado,
            devuelto ? styles.devuelto : styles.prestado,
          ]}
        >
          <Text style={styles.textoEstado}>{estado}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.encabezado}>Mis préstamos</Text>

      <Text style={styles.subtitulo}>
        Consulta el estado de tus libros
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FFFFFF"
          style={styles.cargando}
        />
      ) : error ? (
        <View style={styles.mensajeContainer}>
          <Text style={styles.vacio}>{error}</Text>

          <Pressable
            style={styles.reintentar}
            onPress={cargarPrestamos}
          >
            <Text style={styles.textoReintentar}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={prestamos}
          keyExtractor={(item, index) =>
            String(item.loanId || item.id || index)
          }
          renderItem={renderPrestamo}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.lista}
          onRefresh={cargarPrestamos}
          refreshing={loading}
          ListEmptyComponent={
            <Text style={styles.vacio}>
              No tienes préstamos registrados.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#073DA8',
    padding: 16,
  },
  encabezado: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 12,
  },
  subtitulo: {
    color: '#DCE7FF',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 20,
  },
  lista: {
    paddingBottom: 20,
    gap: 14,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  titulo: {
    color: '#17365D',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  autor: {
    color: '#444444',
    marginBottom: 10,
  },
  detalle: {
    color: '#666666',
    fontSize: 13,
    marginBottom: 6,
  },
  estado: {
    alignSelf: 'flex-start',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 10,
  },
  prestado: {
    backgroundColor: '#DCE7FF',
  },
  devuelto: {
    backgroundColor: '#D5F5DF',
  },
  textoEstado: {
    color: '#17365D',
    fontWeight: 'bold',
    fontSize: 12,
  },
  vacio: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 30,
  },
  cargando: {
    marginTop: 40,
  },
  mensajeContainer: {
    alignItems: 'center',
  },
  reintentar: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  textoReintentar: {
    color: '#17365D',
    fontWeight: 'bold',
  },
});
