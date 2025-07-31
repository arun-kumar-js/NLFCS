import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View,Button } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { s, vs } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

const Timer = () => {
  const navigation = useNavigation();
  const [timeLeft, setTimeLeft] = useState(32 * 60 * 60 + 10 * 60 + 22); // seconds
  const progressRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev > 0 ? prev - 1 : 0;
        const newFill = ((32 * 60 * 60 - newTime) / (32 * 60 * 60)) * 100;
        if (progressRef.current) {
          progressRef.current.animate(newFill, 500);
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voting starts in</Text>
      <AnimatedCircularProgress
        ref={progressRef}
        size={250}
        width={14}
        fill={12}
        tintColor="#8e2de2"
        backgroundColor="#e6e6fa"
        rotation={0}
        duration={500}
        lineCap="round"
        style={styles.progress}
      >
        {() => <Text style={styles.timeText}>{`${hours}:${minutes}:${seconds}`}</Text>}
      </AnimatedCircularProgress>
      <Text style={styles.subtitle}>Voting Yet to start</Text>
     <Button
        title="Next"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: s(20),
    fontWeight: '700',
    color: '#0B0819',
    marginBottom: vs(90),
    fontFamily: 'Outfit',
  },
  progress: {
    marginBottom: vs(90),
  },
  timeText: {
    fontSize: s(28),
    fontWeight: '700',
    color: '#0B0819',
    fontFamily: 'Outfit',
  },
  subtitle: {
    fontSize: s(18),
    fontWeight: '700',
    color: '#0B0819',
    fontFamily: 'Outfit',
  },
});