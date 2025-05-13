import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Medal, Star, RotateCcw } from 'lucide-react-native';
import { getGameProgress, resetGameProgress } from '@/utils/database';

export default function ProfileScreen() {
  const [stats, setStats] = useState({
    highScore: 0,
    gamesPlayed: 0,
    levelsCompleted: 0,
    currentLevel: 1,
    currentDifficulty: 'easy',
    correctGuesses: 0,
    wrongGuesses: 0,
    hintsUsed: 0,
  });

  useEffect(() => {
    loadPlayerStats();
  }, []);

  const loadPlayerStats = async () => {
    try {
      const progress = await getGameProgress();
      if (progress) {
        setStats({
          highScore: progress.highScore || 0,
          gamesPlayed: progress.gamesPlayed || 0,
          levelsCompleted: progress.levelsCompleted || 0,
          currentLevel: progress.level || 1,
          currentDifficulty: progress.difficulty || 'easy',
          correctGuesses: progress.correctGuesses || 0,
          wrongGuesses: progress.wrongGuesses || 0,
          hintsUsed: progress.hintsUsed || 0,
        });
      }
    } catch (error) {
      console.error('Error loading player stats:', error);
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reiniciar Progreso',
      '¿Estás seguro que deseas reiniciar todo tu progreso? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: async () => {
            await resetGameProgress();
            loadPlayerStats();
            Alert.alert('Progreso Reiniciado', 'Todo tu progreso ha sido reiniciado correctamente.');
          },
        },
      ]
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#4CAF50';
    }
  };

  const getDifficultyName = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Intermedio';
      case 'hard': return 'Difícil';
      default: return 'Fácil';
    }
  };

  const getAccuracy = () => {
    const total = stats.correctGuesses + stats.wrongGuesses;
    if (total === 0) return 0;
    return Math.round((stats.correctGuesses / total) * 100);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#6A5ACD', '#9370DB']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={styles.profileCard}>
          <Trophy size={64} color="#FFD700" style={styles.profileIcon} />
          <Text style={styles.playerName}>Jugador</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLebel}>Mejor Puntuación:</Text>
            <Text style={styles.scoreValue}>{stats.highScore}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Estadísticas de Juego</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Star size={28} color="#6A5ACD" />
            <Text style={styles.statValue}>{stats.gamesPlayed}</Text>
            <Text style={styles.statLabel}>Partidas Jugadas</Text>
          </View>
          
          <View style={styles.statCard}>
            <Medal size={28} color="#6A5ACD" />
            <Text style={styles.statValue}>{stats.levelsCompleted}</Text>
            <Text style={styles.statLabel}>Niveles Completados</Text>
          </View>
          
          <View style={styles.statCard}>
            <Trophy size={28} color="#6A5ACD" />
            <Text style={styles.statValue}>{getAccuracy()}%</Text>
            <Text style={styles.statLabel}>Precisión</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.hintsUsed}</Text>
            <Text style={styles.statLabel}>Pistas Usadas</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Progreso Actual</Text>
        
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Nivel Actual</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(stats.currentLevel / 5) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{stats.currentLevel}/5</Text>
          </View>
          
          <Text style={styles.progressTitle}>Dificultad</Text>
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(stats.currentDifficulty) }
          ]}>
            <Text style={styles.difficultyText}>
              {getDifficultyName(stats.currentDifficulty)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Logros</Text>
        
        <View style={styles.achievementsGrid}>
          <View style={[
            styles.achievementCard,
            stats.gamesPlayed >= 5 ? styles.achievementUnlocked : styles.achievementLocked
          ]}>
            <Trophy size={28} color={stats.gamesPlayed >= 5 ? "#FFD700" : "#CCCCCC"} />
            <Text style={styles.achievementTitle}>Jugador Novato</Text>
            <Text style={styles.achievementDesc}>Juega 5 partidas</Text>
          </View>
          
          <View style={[
            styles.achievementCard,
            stats.highScore >= 1000 ? styles.achievementUnlocked : styles.achievementLocked
          ]}>
            <Trophy size={28} color={stats.highScore >= 1000 ? "#FFD700" : "#CCCCCC"} />
            <Text style={styles.achievementTitle}>Puntaje Alto</Text>
            <Text style={styles.achievementDesc}>Alcanza 1000 puntos</Text>
          </View>
          
          <View style={[
            styles.achievementCard,
            getAccuracy() >= 80 ? styles.achievementUnlocked : styles.achievementLocked
          ]}>
            <Trophy size={28} color={getAccuracy() >= 80 ? "#FFD700" : "#CCCCCC"} />
            <Text style={styles.achievementTitle}>Precisión</Text>
            <Text style={styles.achievementDesc}>Logra 80% de aciertos</Text>
          </View>
          
          <View style={[
            styles.achievementCard,
            stats.currentDifficulty === 'hard' ? styles.achievementUnlocked : styles.achievementLocked
          ]}>
            <Trophy size={28} color={stats.currentDifficulty === 'hard' ? "#FFD700" : "#CCCCCC"} />
            <Text style={styles.achievementTitle}>Desafiante</Text>
            <Text style={styles.achievementDesc}>Llega a dificultad difícil</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.resetButton} 
        onPress={handleResetProgress}
      >
        <RotateCcw size={20} color="#FFFFFF" />
        <Text style={styles.resetButtonText}>Reiniciar Progreso</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  header: {
    padding: 16,
    paddingBottom: 90,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  profileIcon: {
    marginBottom: 16,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLebel: {
    fontSize: 16,
    color: '#666666',
    marginRight: 8,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6A5ACD',
  },
  statsSection: {
    padding: 16,
    marginTop: -40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  progressSection: {
    padding: 16,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#EEEEEE',
    borderRadius: 6,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6A5ACD',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    width: 40,
    textAlign: 'right',
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  achievementsSection: {
    padding: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  achievementUnlocked: {
    backgroundColor: '#FFF9C4',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  achievementLocked: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});