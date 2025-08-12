import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import CircularProgress from '../components/CircularProgress';
import { s, vs } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL, AUTH_USERNAME, AUTH_PASSWORD } from '../config/config';

const Timer = () => {
  const navigation = useNavigation();
  const [regionData, setRegionData] = useState();
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const userData = useSelector(state => state.userData.otpVerificationResponse);
  console.log('userData', userData);
  const region = Array.isArray(userData) ? userData[0]?.region_id : userData?.region_id;
  console.log('region', region);
  const startDate = regionData?.data?.[0]?.start_date;
  
  const startTime = regionData?.data?.[0]?.start_time;
  console.log('start time:', startTime);
    useEffect(() => {
      const regionId = Array.isArray(userData) ? userData[0]?.region_id : userData?.region_id;
      if (regionId) {
        timeout(regionId);
      }
    }, [userData]);
  
  
  const timeout = async (regionId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/election_start_countdown`,
        {
          region_id: regionId,
        },
        {
          auth: {
            username: AUTH_USERNAME,
            password: AUTH_PASSWORD,
          },
        },
      );
      console.log('Region ID submitted:', response.data);
      setRegionData(response.data);
    } catch (error) {
      console.error('Failed to send region ID:', error);
    }
  };



  useEffect(() => {
    if (regionData?.data?.[0]?.start_date) {
      const now = new Date();
      const electionStart = new Date(regionData.data[0].start_date);
      console.log('date', regionData.data[0].start_date);
      if (now >= electionStart) {
        setHasStarted(true);
        setTimeLeft(0);
        setProgress(100);
        navigation.replace('Home');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        return;
      }

      const totalSeconds = Math.floor((electionStart - now) / 1000);
      setTimeLeft(totalSeconds);
      setProgress(0);
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setHasStarted(true);
            setProgress(100);
            navigation.replace('Home');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
            return 0;
          }
          const newProgress =
            ((totalSeconds - (prev - 1)) / totalSeconds) * 100;
          setProgress(newProgress);
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [regionData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voting starts in</Text>
      <CircularProgress
        size={250}
        width={14}
        fill={progress}
        tintColor="#8e2de2"
        backgroundColor="#e6e6fa"
        style={styles.progress}
      >
        {(() => {
          const formatTime = seconds => {
            const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
            const m = String(Math.floor((seconds % 3600) / 60)).padStart(
              2,
              '0',
            );
            const s = String(seconds % 60).padStart(2, '0');
            return `${h}:${m}:${s}`;
          };
          return (
            <Text style={styles.timeText}>
              {!hasStarted && timeLeft != null
                ? formatTime(timeLeft)
                : '00:00:00'}
            </Text>
          );
        })()}
      </CircularProgress>
      <Text style={styles.subtitle}>
        {hasStarted ? 'Voting Started' : 'Voting Yet to start'}
      </Text>
      
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
    paddingTop:vs(20),
  },
});
