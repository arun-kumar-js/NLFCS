import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { s, vs, ms } from 'react-native-size-matters';

const VotingSuccess = ({ route }) => {
  const navigation = useNavigation();

  const { voteResponse } = route.params || {};
  const endDate = voteResponse?.end_date;
  
  console.log(endDate);
  useEffect(() => {
    if (voteResponse) {
    
      const calculateRemainingTime = () => {
        if (endDate) {
          const end = new Date(endDate).getTime();
          const now = new Date().getTime();
          const diff = Math.max(0, Math.floor((end - now) / 1000));
          setRemainingTime(diff);
        }
      };

      calculateRemainingTime();
    
    } else {
      console.warn('Vote response missing!');
    }
  }, [voteResponse]);

  // Countdown timer state and animation
  const [remainingTime, setRemainingTime] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (remainingTime > 0) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: remainingTime * 1000,
        useNativeDriver: false,
      }).start();
    }

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const rotate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.background, styles.container]}>
      <Text style={styles.title}>Voting Success</Text>
      

      <Text style={styles.resultLabel}>Results available within</Text>

      <Animated.View style={[styles.timerCircle, { transform: [{ rotate }] }]}>
        <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
      </Animated.View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.replace('Home');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }}
      >
        <Text style={styles.buttonText}>GO to Home</Text>
      </TouchableOpacity>

      <ConfettiCannon count={150} origin={{ x: 200, y: 0 }} fadeOut />
    </View>
  );
};

export default VotingSuccess;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(20),
  },
  title: {
    fontSize: ms(24),
    fontWeight: '700',
    color: '#1D1235',
    marginBottom: vs(10),
  },
  subtitle: {
    fontSize: ms(14),
    textAlign: 'center',
    color: '#000',
    marginBottom: vs(20),
  },
  resultLabel: {
    fontSize: ms(18),
    fontWeight: '500',
    color: '#000',
    marginBottom: vs(20),
  },
  timerCircle: {
    width: ms(240),
    height: ms(240),
    borderRadius: ms(120),
    borderWidth: ms(14),
    borderColor: 'rgba(138,43,226,0.4)',
    borderBottomColor: '#6A00BF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(40),
  },
  timerText: {
    fontSize: ms(28),
    fontWeight: '700',
    color: '#1D1235',
  },
  button: {
    backgroundColor: '#6A00BF',
    paddingVertical: vs(14),
    paddingHorizontal: s(90),
    borderRadius: ms(10),
  },
  buttonText: {
    color: '#fff',
    fontSize: ms(16),
    fontWeight: '600',
  },
});