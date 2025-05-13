// Game configuration constants

// Difficulty levels configuration
export const DIFFICULTIES = {
  easy: {
    maxNumber: 50,
    maxAttempts: 10,
    pointsMultiplier: 1,
    instructions: 'Adivina un número entre 1 y 50 con hasta 10 intentos',
    hintPenalty: 0.7, // 30% penalty when using a hint
  },
  medium: {
    maxNumber: 100,
    maxAttempts: 8,
    pointsMultiplier: 2,
    instructions: 'Adivina un número entre 1 y 100 con hasta 8 intentos',
    hintPenalty: 0.6, // 40% penalty when using a hint
  },
  hard: {
    maxNumber: 200,
    maxAttempts: 6,
    pointsMultiplier: 3,
    instructions: 'Adivina un número entre 1 y 200 con hasta 6 intentos',
    hintPenalty: 0.5, // 50% penalty when using a hint
  }
};

// Game levels configuration
export const LEVELS = [
  {
    level: 1,
    multiplier: 1, // Number range multiplier
    pointsMultiplier: 1, // Score multiplier
    description: 'Nivel Básico',
  },
  {
    level: 2,
    multiplier: 1.2,
    pointsMultiplier: 1.5,
    description: 'Nivel Intermedio',
  },
  {
    level: 3,
    multiplier: 1.5,
    pointsMultiplier: 2,
    description: 'Nivel Avanzado',
  },
  {
    level: 4,
    multiplier: 1.8,
    pointsMultiplier: 2.5,
    description: 'Nivel Experto',
  },
  {
    level: 5,
    multiplier: 2,
    pointsMultiplier: 3,
    description: 'Nivel Maestro',
  }
];

// Achievement definitions
export const ACHIEVEMENTS = [
  {
    id: 'first_win',
    title: 'Primera Victoria',
    description: 'Completa tu primer nivel',
    icon: 'trophy',
    condition: (stats) => stats.levelsCompleted >= 1,
  },
  {
    id: 'rookie',
    title: 'Jugador Novato',
    description: 'Juega 5 partidas',
    icon: 'award',
    condition: (stats) => stats.gamesPlayed >= 5,
  },
  {
    id: 'high_score',
    title: 'Puntaje Alto',
    description: 'Alcanza 1000 puntos',
    icon: 'star',
    condition: (stats) => stats.highScore >= 1000,
  },
  {
    id: 'accuracy',
    title: 'Precisión',
    description: 'Logra 80% de aciertos',
    icon: 'target',
    condition: (stats) => {
      const total = stats.correctGuesses + stats.wrongGuesses;
      return total > 0 && (stats.correctGuesses / total >= 0.8);
    },
  },
  {
    id: 'challenger',
    title: 'Desafiante',
    description: 'Llega a dificultad difícil',
    icon: 'zap',
    condition: (stats) => stats.currentDifficulty === 'hard',
  },
  {
    id: 'master',
    title: 'Maestro del Juego',
    description: 'Completa todos los niveles en dificultad difícil',
    icon: 'award',
    condition: (stats) => 
      stats.currentDifficulty === 'hard' && 
      stats.currentLevel > 5,
  },
];