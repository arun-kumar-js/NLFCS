import axios from 'axios';
import { BASE_URL, AUTH_USERNAME, AUTH_PASSWORD } from '../config/config';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { s, vs, ms } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { setIcData } from '../redux/slice/IcSlice';

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [icNumber, setIcNumber] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedData = JSON.parse(userData);
          console.log('User data from async storage:', parsedData);
          navigation.replace('Home');
        } else {
          console.log('No user data found in async storage.');
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleNext = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/ic_verify`,
        {
          ic_number: icNumber,
        },
        {
          auth: {
            username: AUTH_USERNAME,
            password: AUTH_PASSWORD,
          },
        },
      );
      console.log('API Response:', response.data);
      if (response.data.status === true) {
        dispatch(setIcData({ ...response.data, ic_number: icNumber }));
        navigation.navigate('CameraScreen', { icNumber });
      } else {
        Alert.alert('Verification Failed', 'Invalid IC number or not found.');
      }
      
    } catch (error) {
      
      Alert.alert('API Error:', error);
    }
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeText}>
        Hi, Welcome! <Text style={styles.emoji}>👋</Text>
      </Text>

      <Text style={styles.subText}>Hello Good to see you</Text>

      <Text style={styles.label}>IC Number</Text>

      <TextInput
        placeholder="Enter your IC number here"
        placeholderTextColor="#aaa"
        value={icNumber}
        keyboardType="numeric"
        maxLength={14}
        onChangeText={(text) => {
          
          const numeric = text.replace(/\D/g, '');
          let formatted = numeric;
          if (numeric.length > 6) {
            formatted = `${numeric.slice(0, 6)}-${numeric.slice(6, 8)}`;
          }
          if (numeric.length > 8) {
            formatted = `${numeric.slice(0, 6)}-${numeric.slice(6, 8)}-${numeric.slice(8, 12)}`;
          }
          setIcNumber(formatted);
        }}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handleNext}
        activeOpacity={0.8}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Next</Text>
        <Image
          source={require('../assets/images/arrow-right.png')}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: s(25),
    paddingTop: vs(60),
    fontWeight: '500',
  },
  welcomeText: {
    width: s(183),
    height: vs(30),
    fontFamily: 'Inter-SemiBold',
    fontSize: ms(25),
    color: '#000',
  },
  emoji: {
    fontSize: ms(24),
  },
  subText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: ms(14),
    color: '#999EA1',
    width: s(160),
    height: vs(17),
    marginBottom: vs(32),
  },
  label: {
    fontSize: ms(14),
    color: '#6A00BF',
    paddingBottom: vs(10),
  },
  input: {
    height: vs(43),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: ms(12),
    paddingHorizontal: s(16),
    fontFamily: 'Inter-SemiBold',
    fontSize: ms(14),
    color: '#000',
    marginBottom: vs(32),
    width: s(290),
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#6A0DAD',
    paddingVertical: vs(14),
    paddingHorizontal: s(24),
    borderRadius: ms(12),
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: ms(100),
    width: s(290),
    height: vs(45),
  },
  buttonText: {
    color: '#fff',
    fontSize: ms(17),
    fontFamily: 'Inter-SemiBold',
    paddingLeft: s(110),
  },
  arrowIcon: {
    width: ms(20),
    height: ms(20),
    tintColor: '#fff',
    //paddingRight: s(10),
  },
});

export default Login;
