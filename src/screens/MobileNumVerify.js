import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ms, s, vs } from 'react-native-size-matters';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Pressable,Alert
} from 'react-native';
import { BASE_URL, AUTH_USERNAME, AUTH_PASSWORD } from '../config/config';
import axios from "axios"
const MobileNumVerify = () => {
  const navigation = useNavigation();
  const icData = useSelector(state => state.ic.data);
  const [num,setNum]=useState()
  console.log('IC Slice Data:', icData);

const handleOTP = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/login`,
      {
        ic_number: icData?.ic_number,
        mobile: icData?.mobile,
      },
      {
        auth: {
          username: AUTH_USERNAME,
          password: AUTH_PASSWORD,
        },
      },
    );
    console.log('OTP response:', response.data);
    if (response.data?.status === true) {
      Alert.alert('Success', 'OTP sent successfully', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('OtpPage'),
        },
      ]);
    } else {
      Alert.alert('Error', response.data?.message || 'Failed to send OTP');
    }
  } catch (error) {
    console.error('OTP request error:', error);
  }
}










  return (
    <SafeAreaView style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require('../assets/images/backarrow.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Illustration */}
      <Image
        source={require('../assets/images/num.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.heading}>Enter{'\n'}Mobile number</Text>
        <Text style={styles.subText}>
          Please enter the phone number we will send the OTP in this phone
          number.
        </Text>

        <Text style={styles.label}>Phone Number</Text>

        {/* Phone Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.prefix}>+60</Text>
          {icData?.mobile ? (
            <TextInput
              value={icData.mobile}
              style={styles.input}
              editable={false}
            />
          ) : (
            <TextInput
              placeholder="Enter your phonenumber"
              placeholderTextColor="#B0B0B0"
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={10}
              style={styles.input}
              value={num || ''}
              onChangeText={text => setNum(text)}
              editable={true}
            />
          )}
        </View>

        
        {/* Get OTP Button */}
        <TouchableOpacity style={styles.button} onPress={handleOTP}>
          <Text style={styles.buttonText}>Get OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MobileNumVerify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backArrow: {
    paddingHorizontal: s(20),
    paddingTop: vs(10),
  },
  backText: {
    fontSize: ms(24),
    color: '#000000',
  },
  backIcon: {
    width: s(24),
    height: vs(24),
  },
  image: {
    width: s(250),
    height: vs(250),
    alignSelf: 'center',
    marginTop: 0,
  },
  contentContainer: {
    paddingHorizontal: s(24),
    paddingTop: vs(10),
  },
  heading: {
    fontSize: ms(24),
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    lineHeight: ms(32),
  },
  subText: {
    fontSize: ms(14),
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: ms(20),
    marginTop: vs(10),
  },
  label: {
    fontSize: ms(14),
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#5B2EFF',
    marginTop: vs(20),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DCDCDC',
    borderWidth: 1,
    borderRadius: ms(12),
    height: vs(40),
    width: s(290),
    paddingHorizontal: s(12),
    marginTop: vs(10),
  },
  prefix: {
    fontSize: ms(16),
    color: '#000000',
    borderRightWidth: 1,
    borderRightColor: '#DCDCDC',
    paddingRight: s(8),
    marginRight: s(8),
  },
  input: {
    fontFamily: 'Inter-SemiBold',
    fontSize: ms(14),
    flex: 1,
    color: '#000000',
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginTop: vs(8),
    width: s(345),
    height: vs(48),
  },
  forgotText: {
    fontSize: ms(14),
    fontFamily: 'Inter-SemiBold',
    color: '#6A00BF',
   
    height: vs(18),
    paddingRight: s(60),
  },
  button: {
    marginTop: vs(24),
    height: vs(40),
    width: s(295),
    backgroundColor: '#6A00BF',
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: ms(16),
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});
