import React, { useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, AUTH_USERNAME, AUTH_PASSWORD } from '../config/config';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { ms, s, vs } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { userdata, setUserData } from '../redux/slice/userDataSlice';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
const illustration = require('../assets/otp_illustration.png');

const OtpPage = () => {
  const navigation = useNavigation();
  const mobile = useSelector(state => state.ic.mobile);
  const otpInputs = Array(6).fill('');
  const [otp, setOtp] = React.useState(Array(6).fill(''));
  const inputRefs = useRef([]);
  const scrollViewRef = useRef(null);
  const icData = useSelector(state => state.ic.data);
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = React.useState(90);

  React.useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleOTP = async () => {
    try {
      // Reset OTP values before sending new OTP
      setOtp(Array(6).fill(''));
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
      if (response?.data?.status === true) {
        Toast.show({
          type: ' success',
          text1: response.data.message,
          visibilityTime: 2000,
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Unexpected response from server',
          visibilityTime: 2000,
          position: 'top',
        });
      }
    } catch (error) {
    
    }
  };

  const handleSubmit = async () => {
    try {
      const otpCode = otp.join('');
      console.log(otpCode);
      const response = await axios.post(
        `${BASE_URL}/api/otp_verify`,
        {
          mobile: mobile,
          otp: otpCode,
        },
        {
          auth: {
            username: AUTH_USERNAME,
            password: AUTH_PASSWORD,
          },
        },
      );
      console.log('OTP verification response:', response.data);
      if (response.data.status === true) {
        dispatch(setUserData(response.data.data));
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
        const savedUser = await AsyncStorage.getItem('user');
        console.warn('Saved user data:', savedUser);

        Toast.show({
          type: 'success',
          text1: 'OTP verified',
          visibilityTime: 2000,
          position: 'top',
        });
        setTimeout(() => {
          navigation.navigate('OnBoardingPage1');
        }, 2000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid OTP',
          visibilityTime: 2000,
          position: 'top',
        });
      }
    } catch (error) {
      console.log(error)
    }
  }


  const handleOtpChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      let newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (text.length === 1 && index < 5) {
        inputRefs.current[index + 1].focus();
      }
      if (text.length === 0 && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Example electionList function updated as per instructions
  const electionList = async () => {
    try {
      const otpResponse = useSelector(state => state.userData.otpVerificationResponse);
      const response = await axios.post(
        `${BASE_URL}/api/election_list`,
        {
          id: otpResponse?.id,
          region_id: otpResponse?.region_id,
        },
        {
          auth: {
            username: AUTH_USERNAME,
            password: AUTH_PASSWORD,
          },
        },
      );
      console.log('Election list response:', response.data);
      // Handle response as needed
    } catch (error) {
      console.error('Error fetching election list:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        <SafeAreaView>
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
        </SafeAreaView>

        {/* Illustration */}
        <Image
          source={require('../assets/images/otp-page.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>OTP VERIFICATION</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Enter the OTP sent to +60-{mobile}</Text>

        {/* OTP Inputs */}
        <View style={styles.otpRow}>
          {otpInputs.map((_, idx) => (
            <TextInput
              key={idx}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="number-pad"
              value={otp[idx]}
              onChangeText={text => handleOtpChange(text, idx)}
              ref={ref => (inputRefs.current[idx] = ref)}
              onKeyPress={e => handleBackspace(e, idx)}
              textAlign="center"
              placeholder="•"
              placeholderTextColor="#D0D0D0"
            />
          ))}
        </View>

        {/* Timer */}
        <Text style={styles.timer}>{`00:${timeLeft
          .toString()
          .padStart(2, '0')} Sec`}</Text>

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Don’t receive code ? </Text>
          <TouchableOpacity onPress={handleOTP} disabled={timeLeft > 0}>
            <Text
              style={[
                styles.resendLink,
                { color: timeLeft > 0 ? '#999' : '#6A00BF' },
              ]}
            >
              Re-send
            </Text>
          </TouchableOpacity>
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />
        <Toast />
        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OtpPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: ms(24),
    paddingTop: vs(24),
    paddingBottom: vs(32),
    minHeight: '100%',
  },
  backArrow: {
    position: 'absolute',
    left: ms(0),
    top: vs(16),
    zIndex: 10,
    padding: ms(8),
  },
  backIcon: {
    width: ms(24),
    height: ms(24),
  },
  illustration: {
    alignSelf: 'center',
    width: ms(290),
    height: vs(200),
    marginTop: vs(40),
    marginBottom: vs(32),
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: ms(20),
    color: '#222',
    textAlign: 'center',
    marginBottom: vs(12),
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: ms(14),
    color: '#444',
    textAlign: 'center',
    marginBottom: vs(32),
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: ms(5),
    marginBottom: vs(24),
  },
  otpInput: {
    width: ms(44),
    height: ms(52),
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: ms(8),
    fontSize: ms(20),
    fontFamily: 'Inter-Bold',
    color: '#222',
    backgroundColor: '#F9F9F9',
    marginHorizontal: ms(2),
  },
  timer: {
    fontFamily: 'Inter-Medium',
    fontSize: ms(14),
    color: '#808080',
    textAlign: 'center',
    marginBottom: vs(12),
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(32),
  },
  resendText: {
    fontFamily: 'Inter-Regular',
    fontSize: ms(14),
    color: '#444',
  },
  resendLink: {
    fontFamily: 'Inter-Medium',
    fontSize: ms(14),
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#6A00BF',
    borderRadius: ms(8),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(24),
    marginBottom: vs(8),
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: ms(17),
    color: '#fff',
    letterSpacing: 0.5,
  },
});