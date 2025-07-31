import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef } from 'react';
import { s, vs, ms } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

const dummyImage = require('../assets/images/dummy.png');

const VoteVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigation = useNavigation();

  const candidates = [
    { id: 1, name: 'Frank Esteban', code: '20324453', image: dummyImage },
    { id: 2, name: 'Frank Esteban', code: '20324453', image: dummyImage },
    { id: 3, name: 'Frank Esteban', code: '20324453', image: dummyImage },
    { id: 4, name: 'Frank Esteban', code: '20324453', image: dummyImage },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>{'←'}</Text>
        </TouchableOpacity>
        <View style={styles.orb} />
        <Text style={styles.header}>Verification</Text>
        <View style={styles.enterContainer}>
          <Text style={styles.enterCode}>Enter code</Text>
          <View style={styles.codeRow}>
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <TextInput
                key={index}
                ref={el => (inputRefs.current[index] = el)}
                style={styles.codeBox}
                maxLength={1}
                keyboardType="numeric"
                value={otp[index]}
                onChangeText={text => {
                  const newOtp = [...otp];
                  newOtp[index] = text;
                  setOtp(newOtp);
                  if (text && index < 5) {
                    inputRefs.current[index + 1]?.focus();
                  }
                }}
              />
            ))}
          </View>
        </View>

        <Text style={styles.subHeader}>Selected For Vote</Text>

        {candidates.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={item.image} style={styles.avatar} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.code}>Member code:{item.code}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('VotingSuccess')}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VoteVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: s(16),
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: ms(20),
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: vs(10),
  },
  enterCode: {
    fontSize: ms(16),
    fontWeight: '500',
    marginTop: vs(20),
    marginBottom: vs(10),
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(20),
  },
  codeBox: {
    width: ms(40),
    height: ms(48),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: ms(8),
    textAlign: 'center',
    fontSize: ms(20),
  },
  subHeader: {
    fontSize: ms(16),
    fontWeight: '600',
    marginBottom: vs(10),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: s(12),
    borderRadius: ms(12),
    marginBottom: vs(10),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
    marginRight: s(12),
  },
  name: {
    fontSize: ms(14),
    fontWeight: '700',
  },
  code: {
    fontSize: ms(12),
    color: '#7A7A7A',
  },
  button: {
    marginTop: vs(20),
    backgroundColor: '#6A00BF',
    paddingVertical: vs(14),
    borderRadius: ms(10),
    alignItems: 'center',
    marginBottom: vs(40),
  },
  buttonText: {
    color: '#fff',
    fontSize: ms(16),
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: vs(10),
    left: s(0),
    zIndex: 10,
    padding: s(8),
  },
  backText: {
    fontSize: ms(22),
    color: '#000',
  },
});
