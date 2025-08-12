import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef } from 'react';
import { s, vs, ms } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BASE_URL, AUTH_USERNAME, AUTH_PASSWORD } from '../config/config';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const VoteVerification = () => {
  const electionList = useSelector(state => state?.electionList?.data || []);
  console.log(electionList);
  const electionId = electionList?.[0]?.id;
  console.log(electionId);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(Array.isArray(parsed) ? parsed[0] : parsed);
        }
      } catch (error) {
        console.error('Failed to load user from async storage:', error);
      }
    };

    fetchUser();
  }, []);

  console.log("user", user)
  console.log(user)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute();
  const {
    selectedCandidates = [],
    selectedCandidateIds = [],
    electionId: paramElectionId,
    regionId,
  } = route.params || {};

  
  // const candidates = route.params?.selectedCandidates || [];
  const candidates = selectedCandidates;
  console.log('candidates', candidates);       
  
const onSubmit = async () => {
    // Logging as requested before try block
    console.log('OTP:', otp);
    console.log('Mobile:', user?.mobile);
    console.log('Election ID:', paramElectionId);
    console.log('Member ID:', user?.id || '');
    console.log('Selected Candidates:', candidates);
    try {
      const requestBody = {
        mobile: user?.mobile,
        otp: otp.join(''),
        election_id: paramElectionId,
        member_id: user?.id || '',
        candidate_ids: candidates.map(item => ({
          candidate_ids: item.candidate_id.toString(),
        })),
      };

      console.log('Request Body:', JSON.stringify(requestBody, null, 2));

      const response = await axios.post(
        `${BASE_URL}/api/vote_submit`,
        requestBody,
        {
          auth: {
            username: AUTH_USERNAME,
            password: AUTH_PASSWORD,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );


      const result = response.data;
      console.log(result);
      

      if (result.status === true) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'VotingSuccess', params: { voteResponse: result } }],
        });
      } else {
        Toast.show({
          type: 'error',
          text1: result.message || 'Something went wrong',
          visibilityTime: 2000,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to submit vote.',
        visibilityTime: 2000,
      });
    }
  };




  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
             <Image
                    source={require('../assets/images/backarrow.png')}
                    style={{ width: 24, height: 24 }}
                  />
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
            <Image
              source={{
                uri: `https://spider.org.in/nlfcs/uploads/${item?.image}`,
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.code}>Member code:{item.member_code}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.button}
          onPress={onSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
      <Toast />
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
    color: '#000',
  },
  enterCode: {
    fontSize: ms(16),
    fontWeight: '500',
    marginTop: vs(20),
    marginBottom: vs(10),
    color: '#000',
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
    color: '#000',
  },
  subHeader: {
    fontSize: ms(16),
    fontWeight: '600',
    marginBottom: vs(10),
    color: '#000',
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
    resizeMode: 'contain',
  },
  name: {
    fontSize: ms(14),
    fontWeight: '700',
    color: '#000',
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
    color: 'white',
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
