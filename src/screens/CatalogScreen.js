
import { useEffect, useState } from 'react';

import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

export default function CatalogScreen({ navigation }) {
  const { logout } = useAuth();

  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState('Todas');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar libros desde la API
  const cargarLibros = async () => {
    try {
      setLoading(true);
      setError('');

      const respuesta = await apiFetch('/api/books');

      const librosAPI = Array.isArray(respuesta)
        ? respuesta
        : respuesta?.data || [];

      setLibros(librosAPI);
    } catch (error) {
      setError(error.message || 'No se pudieron cargar los libros.');
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar la carga al entrar a la pantalla
  useEffect(() => {
    cargarLibros();
  }, []);

  // Cerrar sesión
  const cerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas salir de tu cuenta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();

              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert(
                'Error',
                'No fue posible cerrar la sesión.'
              );
            }
          },
        },
      ]
    );
  };

  // Obtener categorías reales de la API
  const categorias = [
    'Todas',
    ...new Set(
      libros
        .map((libro) => libro.categoria)
        .filter(Boolean)
    ),
  ];

  // Buscar y filtrar libros
  const librosFiltrados = libros.filter((libro) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      libro.titulo?.toLowerCase().includes(texto) ||
      libro.autor?.toLowerCase().includes(texto);

    const coincideCategoria =
      categoriaSeleccionada === 'Todas' ||
      libro.categoria === categoriaSeleccionada;

    return coincideBusqueda && coincideCategoria;
  });

  // Navegar a solicitud de préstamo
  const solicitarPrestamo = (libro) => {
    navigation.navigate('LoanRequest', {
      libro: libro,
    });
  };

  // Mostrar cada libro
  const renderLibro = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.portada}>
        <Text style={styles.portadaTexto}>📚</Text>
      </View>

      <View style={styles.informacion}>
        <Text style={styles.titulo}>{item.titulo}</Text>

        <Text style={styles.autor}>
          Autor: {item.autor}
        </Text>

        <Text style={styles.detalle}>
          ISBN: {item.isbn}
        </Text>

        <Text style={styles.detalle}>
          Categoría: {item.categoria}
        </Text>

        <Text
          style={[
            styles.stock,
            item.stockDisponible > 0
              ? styles.disponible
              : styles.agotado,
          ]}
        >
          {item.stockDisponible > 0
            ? `Disponibles: ${item.stockDisponible}`
            : 'Sin existencias'}
        </Text>

        <Pressable
          style={[
            styles.boton,
            item.stockDisponible === 0 &&
              styles.botonDesactivado,
          ]}
          disabled={item.stockDisponible === 0}
          onPress={() => solicitarPrestamo(item)}
        >
          <Text style={styles.textoBoton}>
            {item.stockDisponible > 0
              ? 'Solicitar préstamo'
              : 'No disponible'}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.contenedor}>
      <Text style={styles.encabezado}>
        Catálogo de Libros
      </Text>

      <Text style={styles.subtitulo}>
        Encuentra tu próximo libro favorito
      </Text>

      <Pressable
        style={styles.prestamosButton}
        onPress={() => navigation.navigate('MyLoans')}
      >
        <Text style={styles.prestamosButtonText}>
          Mis préstamos
        </Text>
      </Pressable>

      <Pressable
        style={styles.cerrarSesionButton}
        onPress={cerrarSesion}
      >
        <Text style={styles.prestamosButtonText}>
          Cerrar sesión
        </Text>
      </Pressable>

      <TextInput
        style={styles.busqueda}
        placeholder="Buscar por título o autor..."
        placeholderTextColor="#777"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <Text style={styles.etiqueta}>Categorías</Text>

      <FlatList
        horizontal
        data={categorias}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listaCategorias}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.categoria,
              categoriaSeleccionada === item &&
                styles.categoriaActiva,
            ]}
            onPress={() => setCategoriaSeleccionada(item)}
          >
            <Text
              style={[
                styles.textoCategoria,
                categoriaSeleccionada === item &&
                  styles.textoCategoriaActivo,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        )}
      />

      <Text style={styles.resultados}>
        Libros encontrados: {librosFiltrados.length}
      </Text>

      {loading ? (
        <View style={styles.estado}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.mensajeEstado}>
            Cargando catálogo...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.estado}>
          <Text style={styles.error}>{error}</Text>

          <Pressable
            style={styles.botonReintentar}
            onPress={cargarLibros}
          >
            <Text style={styles.textoBoton}>
              Reintentar
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={librosFiltrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderLibro}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listaLibros}
          ListEmptyComponent={
            <Text style={styles.sinResultados}>
              No se encontraron libros.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
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
    fontSize: 13,
    marginTop: 5,
    marginBottom: 18,
  },
  prestamosButton: {
    backgroundColor: '#25C85A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  cerrarSesionButton: {
    backgroundColor: '#D32F2F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  prestamosButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  busqueda: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 45,
    color: '#222222',
  },
  etiqueta: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
  },
  listaCategorias: {
    gap: 8,
    paddingBottom: 5,
  },
  categoria: {
    backgroundColor: '#DCE7FF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  categoriaActiva: {
    backgroundColor: '#25C85A',
  },
  textoCategoria: {
    color: '#17365D',
    fontWeight: '600',
  },
  textoCategoriaActivo: {
    color: '#FFFFFF',
  },
  resultados: {
    color: '#FFFFFF',
    marginVertical: 12,
    fontWeight: '600',
  },
  listaLibros: {
    paddingBottom: 25,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    elevation: 3,
  },
  portada: {
    width: 85,
    minHeight: 135,
    backgroundColor: '#DCE7FF',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portadaTexto: {
    fontSize: 43,
  },
  informacion: {
    flex: 1,
    justifyContent: 'center',
  },
  titulo: {
    color: '#17365D',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 5,
  },
  autor: {
    color: '#333333',
    fontSize: 12,
    marginBottom: 4,
  },
  detalle: {
    color: '#555555',
    fontSize: 11,
    marginBottom: 3,
  },
  stock: {
    fontSize: 12,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  disponible: {
    color: '#168A3B',
  },
  agotado: {
    color: '#D32F2F',
  },
  boton: {
    backgroundColor: '#073DA8',
    padding: 9,
    borderRadius: 6,
    alignItems: 'center',
  },
  botonDesactivado: {
    backgroundColor: '#999999',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  sinResultados: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 30,
  },
  estado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mensajeEstado: {
    color: '#FFFFFF',
    marginTop: 12,
  },
  error: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  botonReintentar: {
    backgroundColor: '#25C85A',
    padding: 12,
    borderRadius: 8,
  },
});

