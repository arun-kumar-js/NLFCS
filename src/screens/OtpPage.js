import React, { useRef } from 'react';
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
} from 'react-native';
import { ms, s, vs } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
// import illustration from local assets, update the path as needed
const illustration = require('../assets/otp_illustration.png');

const OtpPage = () => {
  const navigation = useNavigation();
  const otpInputs = Array(6).fill('');
  const [otp, setOtp] = React.useState(Array(6).fill(''));
  const inputRefs = useRef([]);

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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
          source={require('../assets/images/otp-page.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>OTP VERIFICATION</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Enter the OTP sent to - +91-8976500001
        </Text>

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
        <Text style={styles.timer}>00:120 Sec</Text>

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Don’t receive code ? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.resendLink}>Re-send</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Onboarding')}
        >
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