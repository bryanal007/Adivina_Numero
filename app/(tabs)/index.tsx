import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Star, Clock, BrainCircuit } from 'lucide-react-native';
import { initializeDatabase } from '@/utils/database';

export default function HomeScreen() {
  useEffect(() => {
    // Initialize the database when the app starts
    initializeDatabase();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#6A5ACD', '#9370DB']}
        style={styles.header}
      >
        <Text style={styles.title}>Adivina el Número</Text>
        <Text style={styles.subtitle}>¡Pon a prueba tu intuición!</Text>
      </LinearGradient>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          ¡Bienvenido al juego de Adivina el Número! Pon a prueba tu intuición
          y habilidad mental mientras intentas descubrir números secretos en
          diferentes niveles de dificultad.
        </Text>
      </View>

      <Link href="/game" asChild>
        <TouchableOpacity style={styles.playButton}>
          <Text style={styles.playButtonText}>¡JUGAR AHORA!</Text>
        </TouchableOpacity>
      </Link>

      <Text style={styles.sectionTitle}>Modos de Dificultad</Text>
      <View style={styles.difficultyContainer}>
        <TouchableOpacity style={[styles.difficultyCard, styles.easyCard]}>
          <Star size={32} color="#FFFFFF" />
          <Text style={styles.difficultyTitle}>Fácil</Text>
          <Text style={styles.difficultyDescription}>
            Números del 1 al 50 con más pistas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.difficultyCard, styles.mediumCard]}>
          <Clock size={32} color="#FFFFFF" />
          <Text style={styles.difficultyTitle}>Intermedio</Text>
          <Text style={styles.difficultyDescription}>
            Números del 1 al 100 con pistas limitadas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.difficultyCard, styles.hardCard]}>
          <BrainCircuit size={32} color="#FFFFFF" />
          <Text style={styles.difficultyTitle}>Difícil</Text>
          <Text style={styles.difficultyDescription}>
            Números del 1 al 200 con pocas pistas
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Trophy size={24} color="#6A5ACD" />
          <Text style={styles.statTitle}>Niveles</Text>
          <Text style={styles.statValue}>5</Text>
        </View>
        <View style={styles.statCard}>
          <Star size={24} color="#6A5ACD" />
          <Text style={styles.statTitle}>Dificultades</Text>
          <Text style={styles.statValue}>3</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: '#6A5ACD',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 32,
    marginVertical: 24,
    elevation: 5,
    shadowColor: '#6A5ACD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  difficultyCard: {
    width: '30%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  easyCard: {
    backgroundColor: '#4CAF50',
  },
  mediumCard: {
    backgroundColor: '#FF9800',
  },
  hardCard: {
    backgroundColor: '#F44336',
  },
  difficultyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  difficultyDescription: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '45%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statTitle: {
    color: '#666666',
    fontSize: 14,
    marginTop: 8,
  },
  statValue: {
    color: '#333333',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
});