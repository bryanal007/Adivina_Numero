import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export function CustomSplash() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const numberAnim = useRef(new Animated.Value(0)).current;
  const questionMarkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Fade in and scale up the circle
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Animate the number counter
      Animated.timing(numberAnim, {
        toValue: 100,
        duration: 1500,
        useNativeDriver: true,
      }),
      // Bounce in the question mark
      Animated.spring(questionMarkAnim, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Interpolate number animation for display
  const displayNumber = numberAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0', '100'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6A5ACD', '#9370DB']}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.circle,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.Text style={[styles.number, { opacity: fadeAnim }]}>
            {displayNumber}
          </Animated.Text>
          <Animated.Text
            style={[
              styles.questionMark,
              {
                transform: [
                  { scale: questionMarkAnim },
                  {
                    rotate: questionMarkAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            ?
          </Animated.Text>
        </Animated.View>
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })}],
            },
          ]}
        >
          Adivina el Número
        </Animated.Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  number: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6A5ACD',
    fontFamily: 'Inter-Bold',
  },
  questionMark: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6A5ACD',
    fontFamily: 'Inter-Bold',
  },
  title: {
    marginTop: 40,
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
});