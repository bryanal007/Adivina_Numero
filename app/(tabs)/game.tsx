import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, RotateCcw, ThumbsUp, ThumbsDown, ChevronUp, ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';
import { saveGameProgress, getGameProgress } from '@/utils/database';
import { LEVELS, DIFFICULTIES } from '@/constants/gameConfig';

const COLORS = {
  easy: ['#4CAF50', '#8BC34A'],
  medium: ['#FF9800', '#FFEB3B'],
  hard: ['#F44336', '#FF5722'],
};

export default function GameScreen() {
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(10);
  const [gameState, setGameState] = useState('selecting'); // selecting, playing, won, lost
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    // Load game progress
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const progress = await getGameProgress();
    if (progress) {
      setHighScore(progress.highScore || 0);
      // Could also restore level, difficulty, etc. if needed
    }
  };

  const startGame = () => {
    const difficultyConfig = DIFFICULTIES[selectedDifficulty];
    const levelConfig = LEVELS[currentLevel - 1];
    
    // Generate random number based on difficulty and level
    const min = 1;
    const max = difficultyConfig.maxNumber * levelConfig.multiplier;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    
    setTargetNumber(randomNumber);
    setAttempts(0);
    setMaxAttempts(difficultyConfig.maxAttempts);
    setGameState('playing');
    setFeedback('');
    setGuess('');
    setHintUsed(false);
  };

  const handleGuess = () => {
    if (!guess || isNaN(Number(guess))) {
      Alert.alert('Error', 'Por favor, ingresa un número válido');
      return;
    }

    const userGuess = Number(guess);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (userGuess === targetNumber) {
      // Calculate score based on difficulty, level, and attempts
      const difficultyMultiplier = { easy: 1, medium: 2, hard: 3 }[selectedDifficulty];
      const attemptsBonus = Math.max(1, maxAttempts - newAttempts + 1);
      const levelBonus = currentLevel;
      const hintPenalty = hintUsed ? 0.7 : 1;
      
      const newScore = Math.floor(100 * difficultyMultiplier * levelBonus * attemptsBonus * hintPenalty);
      const totalScore = score + newScore;
      
      setScore(totalScore);
      setGameState('won');
      setFeedback(`¡Correcto! +${newScore} puntos`);
      
      // Save progress
      saveGameProgress({
        level: currentLevel,
        difficulty: selectedDifficulty,
        score: totalScore,
        highScore: Math.max(highScore, totalScore),
      });
      
      // Update high score if needed
      if (totalScore > highScore) {
        setHighScore(totalScore);
      }
    } else if (newAttempts >= maxAttempts) {
      setGameState('lost');
      setFeedback(`¡Se acabaron los intentos! El número era ${targetNumber}`);
    } else if (userGuess < targetNumber) {
      setFeedback(`El número es mayor que ${userGuess}`);
    } else {
      setFeedback(`El número es menor que ${userGuess}`);
    }
    
    setGuess('');
  };

  const useHint = () => {
    if (hintUsed) return;
    
    const hintRange = Math.floor(targetNumber / 4);
    const lowerBound = Math.max(1, targetNumber - hintRange);
    const upperBound = targetNumber + hintRange;
    
    setFeedback(`Pista: El número está entre ${lowerBound} y ${upperBound}`);
    setHintUsed(true);
  };

  const nextLevel = () => {
    if (currentLevel < 5) {
      setCurrentLevel(currentLevel + 1);
      startGame();
    } else if (selectedDifficulty === 'easy') {
      setSelectedDifficulty('medium');
      setCurrentLevel(1);
      setGameState('selecting');
    } else if (selectedDifficulty === 'medium') {
      setSelectedDifficulty('hard');
      setCurrentLevel(1);
      setGameState('selecting');
    } else {
      // Game completed
      Alert.alert(
        '¡Felicidades!',
        `¡Has completado todos los niveles con ${score} puntos!`,
        [{ text: 'OK', onPress: () => router.push('/profile') }]
      );
    }
  };

  const restartLevel = () => {
    startGame();
  };

  const renderDifficultySelector = () => (
    <View style={styles.difficultySelector}>
      <Text style={styles.sectionTitle}>Selecciona la Dificultad</Text>
      
      <View style={styles.difficultyButtons}>
        <TouchableOpacity
          style={[
            styles.difficultyButton,
            selectedDifficulty === 'easy' && styles.selectedButton,
            { backgroundColor: '#4CAF50' }
          ]}
          onPress={() => setSelectedDifficulty('easy')}
        >
          <Text style={styles.difficultyButtonText}>Fácil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.difficultyButton,
            selectedDifficulty === 'medium' && styles.selectedButton,
            { backgroundColor: '#FF9800' }
          ]}
          onPress={() => setSelectedDifficulty('medium')}
        >
          <Text style={styles.difficultyButtonText}>Intermedio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.difficultyButton,
            selectedDifficulty === 'hard' && styles.selectedButton,
            { backgroundColor: '#F44336' }
          ]}
          onPress={() => setSelectedDifficulty('hard')}
        >
          <Text style={styles.difficultyButtonText}>Difícil</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.levelText}>Nivel {currentLevel}</Text>
      
      <TouchableOpacity style={styles.startButton} onPress={startGame}>
        <Text style={styles.startButtonText}>Comenzar Juego</Text>
        <ArrowRight size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderGameInterface = () => (
    <View style={styles.gameInterface}>
      <LinearGradient
        colors={COLORS[selectedDifficulty]}
        style={styles.gameHeader}
      >
        <Text style={styles.gameHeaderText}>
          Nivel {currentLevel} - {selectedDifficulty === 'easy' ? 'Fácil' : 
            selectedDifficulty === 'medium' ? 'Intermedio' : 'Difícil'}
        </Text>
        <Text style={styles.gameSubheader}>
          {DIFFICULTIES[selectedDifficulty].instructions}
        </Text>
      </LinearGradient>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Intentos</Text>
          <Text style={styles.statValue}>{attempts}/{maxAttempts}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Puntuación</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
      </View>
      
      <View style={styles.feedbackContainer}>
        {feedback ? (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>{feedback}</Text>
            {feedback.includes('mayor') && <ChevronUp size={24} color="#F44336" />}
            {feedback.includes('menor') && <ChevronDown size={24} color="#4CAF50" />}
          </View>
        ) : (
          <Text style={styles.instructionText}>
            Adivina un número entre 1 y {DIFFICULTIES[selectedDifficulty].maxNumber * LEVELS[currentLevel - 1].multiplier}
          </Text>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={guess}
          onChangeText={setGuess}
          keyboardType="number-pad"
          placeholder="Tu respuesta..."
          maxLength={4}
        />
        <TouchableOpacity 
          style={styles.guessButton}
          onPress={handleGuess}
        >
          <Text style={styles.guessButtonText}>Adivinar</Text>
        </TouchableOpacity>
      </View>
      
      {!hintUsed && gameState === 'playing' && (
        <TouchableOpacity 
          style={styles.hintButton}
          onPress={useHint}
        >
          <Text style={styles.hintButtonText}>Usar Pista (reduce puntos)</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderGameResults = () => (
    <View style={styles.resultsContainer}>
      <LinearGradient
        colors={gameState === 'won' ? ['#4CAF50', '#8BC34A'] : ['#F44336', '#FF5722']}
        style={styles.resultsHeader}
      >
        <Text style={styles.resultsTitle}>
          {gameState === 'won' ? '¡Nivel Completado!' : 'Nivel Fallido'}
        </Text>
        {gameState === 'won' ? (
          <ThumbsUp size={48} color="#FFFFFF" />
        ) : (
          <ThumbsDown size={48} color="#FFFFFF" />
        )}
      </LinearGradient>
      
      <View style={styles.resultsContent}>
        <Text style={styles.resultText}>Número a adivinar: {targetNumber}</Text>
        <Text style={styles.resultText}>Intentos utilizados: {attempts}/{maxAttempts}</Text>
        {gameState === 'won' && (
          <Text style={styles.scoreText}>+{feedback.split('+')[1]}</Text>
        )}
        
        <View style={styles.resultsButtonsContainer}>
          {gameState === 'won' ? (
            <TouchableOpacity 
              style={[styles.resultButton, styles.nextButton]}
              onPress={nextLevel}
            >
              <Text style={styles.resultButtonText}>
                {currentLevel < 5 ? 'Siguiente Nivel' : 
                 selectedDifficulty !== 'hard' ? 'Siguiente Dificultad' : 'Finalizar Juego'}
              </Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.resultButton, styles.retryButton]}
              onPress={restartLevel}
            >
              <Text style={styles.resultButtonText}>Intentar de Nuevo</Text>
              <RotateCcw size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {gameState === 'selecting' && renderDifficultySelector()}
      {gameState === 'playing' && renderGameInterface()}
      {(gameState === 'won' || gameState === 'lost') && renderGameResults()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  difficultySelector: {
    padding: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    alignSelf: 'center',
  },
  difficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  difficultyButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 3,
  },
  selectedButton: {
    borderWidth: 3,
    borderColor: '#333333',
  },
  difficultyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#6A5ACD',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
  gameInterface: {
    flex: 1,
  },
  gameHeader: {
    padding: 16,
    alignItems: 'center',
  },
  gameHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  gameSubheader: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  feedbackContainer: {
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  feedbackBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  feedbackText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginRight: 8,
  },
  instructionText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginRight: 8,
    elevation: 2,
  },
  guessButton: {
    flex: 2,
    backgroundColor: '#6A5ACD',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  guessButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  hintButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6A5ACD',
    borderRadius: 24,
    padding: 12,
    marginHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  hintButtonText: {
    color: '#6A5ACD',
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    padding: 24,
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  resultsContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    elevation: 3,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 16,
  },
  resultsButtonsContainer: {
    marginTop: 16,
    width: '100%',
  },
  resultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 3,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
  },
  retryButton: {
    backgroundColor: '#FF9800',
  },
  resultButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
});