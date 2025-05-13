import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storing data
const GAME_PROGRESS_KEY = 'game_progress';
const HIGH_SCORES_KEY = 'high_scores';

// Types
interface GameProgress {
  level: number;
  difficulty: string;
  score: number;
  highScore: number;
  gamesPlayed: number;
  levelsCompleted: number;
  correctGuesses: number;
  wrongGuesses: number;
  hintsUsed: number;
  achievements: string[]; // IDs of unlocked achievements
  lastPlayed: number; // timestamp
}

interface HighScore {
  score: number;
  difficulty: string;
  level: number;
  date: number; // timestamp
}

// Initialize database
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Check if game progress exists, if not, create it
    const progressData = await AsyncStorage.getItem(GAME_PROGRESS_KEY);
    
    if (!progressData) {
      const initialProgress: GameProgress = {
        level: 1,
        difficulty: 'easy',
        score: 0,
        highScore: 0,
        gamesPlayed: 0,
        levelsCompleted: 0,
        correctGuesses: 0,
        wrongGuesses: 0,
        hintsUsed: 0,
        achievements: [],
        lastPlayed: Date.now(),
      };
      
      await AsyncStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(initialProgress));
    }
    
    // Check if high scores exists, if not, create it
    const highScoresData = await AsyncStorage.getItem(HIGH_SCORES_KEY);
    
    if (!highScoresData) {
      await AsyncStorage.setItem(HIGH_SCORES_KEY, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Get game progress
export const getGameProgress = async (): Promise<GameProgress | null> => {
  try {
    const progressData = await AsyncStorage.getItem(GAME_PROGRESS_KEY);
    if (progressData) {
      return JSON.parse(progressData);
    }
    return null;
  } catch (error) {
    console.error('Error getting game progress:', error);
    return null;
  }
};

// Save game progress
export const saveGameProgress = async (progress: Partial<GameProgress>): Promise<void> => {
  try {
    // Get existing progress
    const existingProgressData = await AsyncStorage.getItem(GAME_PROGRESS_KEY);
    let existingProgress: GameProgress;
    
    if (existingProgressData) {
      existingProgress = JSON.parse(existingProgressData);
    } else {
      existingProgress = {
        level: 1,
        difficulty: 'easy',
        score: 0,
        highScore: 0,
        gamesPlayed: 0,
        levelsCompleted: 0,
        correctGuesses: 0,
        wrongGuesses: 0,
        hintsUsed: 0,
        achievements: [],
        lastPlayed: Date.now(),
      };
    }
    
    // Update progress with new values
    const updatedProgress: GameProgress = {
      ...existingProgress,
      ...progress,
      lastPlayed: Date.now(),
    };
    
    // Make sure highScore is always the highest
    if (progress.score && progress.score > updatedProgress.highScore) {
      updatedProgress.highScore = progress.score;
    }
    
    // Save updated progress
    await AsyncStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(updatedProgress));
    
    // If it's a new high score, add it to high scores
    if (progress.score && progress.score > existingProgress.highScore) {
      await addHighScore({
        score: progress.score,
        difficulty: progress.difficulty || existingProgress.difficulty,
        level: progress.level || existingProgress.level,
        date: Date.now(),
      });
    }
  } catch (error) {
    console.error('Error saving game progress:', error);
  }
};

// Reset game progress
export const resetGameProgress = async (): Promise<void> => {
  try {
    const initialProgress: GameProgress = {
      level: 1,
      difficulty: 'easy',
      score: 0,
      highScore: 0,
      gamesPlayed: 0,
      levelsCompleted: 0,
      correctGuesses: 0,
      wrongGuesses: 0,
      hintsUsed: 0,
      achievements: [],
      lastPlayed: Date.now(),
    };
    
    await AsyncStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(initialProgress));
  } catch (error) {
    console.error('Error resetting game progress:', error);
  }
};

// Add a high score
export const addHighScore = async (score: HighScore): Promise<void> => {
  try {
    const highScoresData = await AsyncStorage.getItem(HIGH_SCORES_KEY);
    let highScores: HighScore[] = [];
    
    if (highScoresData) {
      highScores = JSON.parse(highScoresData);
    }
    
    // Add new score
    highScores.push(score);
    
    // Sort by score (descending)
    highScores.sort((a, b) => b.score - a.score);
    
    // Keep only top 10 scores
    if (highScores.length > 10) {
      highScores = highScores.slice(0, 10);
    }
    
    await AsyncStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(highScores));
  } catch (error) {
    console.error('Error adding high score:', error);
  }
};

// Get high scores
export const getHighScores = async (): Promise<HighScore[]> => {
  try {
    const highScoresData = await AsyncStorage.getItem(HIGH_SCORES_KEY);
    if (highScoresData) {
      return JSON.parse(highScoresData);
    }
    return [];
  } catch (error) {
    console.error('Error getting high scores:', error);
    return [];
  }
};

// Update achievement progress
export const unlockAchievement = async (achievementId: string): Promise<void> => {
  try {
    const progressData = await AsyncStorage.getItem(GAME_PROGRESS_KEY);
    if (progressData) {
      const progress: GameProgress = JSON.parse(progressData);
      
      // Check if achievement is already unlocked
      if (!progress.achievements.includes(achievementId)) {
        progress.achievements.push(achievementId);
        await AsyncStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(progress));
      }
    }
  } catch (error) {
    console.error('Error unlocking achievement:', error);
  }
};

// Get unlocked achievements
export const getUnlockedAchievements = async (): Promise<string[]> => {
  try {
    const progressData = await AsyncStorage.getItem(GAME_PROGRESS_KEY);
    if (progressData) {
      const progress: GameProgress = JSON.parse(progressData);
      return progress.achievements;
    }
    return [];
  } catch (error) {
    console.error('Error getting unlocked achievements:', error);
    return [];
  }
};