import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { s, vs, ms } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = () => {
  const navigation = useNavigation();
  const [icNumber, setIcNumber] = useState('');

  const handleNext = () => {
    navigation.navigate('MobileNumVerify');
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
        onChangeText={setIcNumber}
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
