import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCandidates } from '../slice/selectedCandidatesSlice';
import axios from "axios"
import { BASE_URL, AUTH_USERNAME, AUTH_PASSWORD } from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const CandidateList = ({ navigation, route }) => {
  const [electionId, setElectionId] = useState(route?.params?.electionId);
  console.log("electionId",electionId);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [userData, setUserData] = useState(null);

  const [ctionlist,setElectionList]=useState()
  console.log('userData', userData);
  const region_id = userData?.[0]?.region_id;
  const member_id = userData?.[0]?.id;
  console.log(region_id, member_id);
  // If navigation is not passed as prop, fallback to hook (for backward compatibility)
  const nav = navigation || useNavigation();
  const electionList = useSelector(state => state.electionList.data);
  console.log('electionList', electionList);
  const currentElection = electionList?.find(e => e.id === electionId);
console.log(
  'currentElection',
  currentElection.max_count,
  currentElection.min_count,
);
  if (!currentElection) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Election not found</Text>
      </SafeAreaView>
    );
  }

  useEffect(() => {
    if (route?.params?.electionId) {
      setElectionId(route.params.electionId);
    }
  }, [route?.params?.electionId]);
 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('user');
        if (storedData) {
          const parsed = JSON.parse(storedData);
          setUserData(parsed);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const [candidateList, setCandidateList] = useState([]);
console.log(candidateList);
  useEffect(() => {
    if (electionList?.length && electionId) {
      const matchedElection = electionList.find(e => e.id === electionId);
      if (matchedElection?.canditates) {
        setCandidateList(matchedElection.canditates);
      }
    }
  }, [electionList, electionId]);

  
  

  return (
    <SafeAreaView style={styles.container}>
      <Toast />
      <TouchableOpacity
        onPress={() => nav.goBack()}
        style={{ marginBottom: 10 }}
      >
        <Image
          source={require('../assets/images/backarrow.png')}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Candidate list</Text>
        <Text style={styles.subHeader}>Committee Member Selection</Text>
        <Text style={styles.location}>Perak</Text>

        <View style={styles.voteCard}>
          <Text style={styles.totalVotes}>
            Total votes{' '}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                display: 'inline',
              }}
            >
              <Image
                source={require('../assets/images/vote.png')}
                style={{ width: 16, height: 16, marginRight: 6 }}
              />
              <Text style={styles.voteCount}>
                {currentElection?.vote_count || 0}
              </Text>
            </View>
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: vs(6),
            }}
          >
            <Image
              source={require('../assets/images/time2.png')}
              style={{
                width: 16,
                height: 16,
                marginRight: 6,
                alignItems: 'center',
              }}
            />
            <Text style={styles.voteClose}>
              Voting closes at{' '}
              {currentElection?.end_date
                ? new Date(currentElection.end_date).toLocaleString()
                : 'unknown time'}
            </Text>
          </View>
          <View style={styles.entitlementBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/images/vote1.png')}
                style={{ width: 16, height: 16, marginRight: 6 }}
              />
              <Text style={styles.entitlementText}>
                You are entitled to vote for up to {currentElection.max_count}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          {candidateList.map((candidate, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                selectedCandidates.includes(candidate.id) &&
                  styles.selectedCard,
              ]}
              onPress={() => {
                if (selectedCandidates.includes(candidate.id)) {
                  setSelectedCandidates(prev =>
                    prev.filter(id => id !== candidate.id),
                  );
                } else if (
                  selectedCandidates.length <
                  parseInt(currentElection?.max_count)
                ) {
                  setSelectedCandidates(prev => [...prev, candidate.id]);
                }
              }}
            >
              <Image
                source={{
                  uri: `${currentElection?.image_path}${candidate.image}`,
                }}
                style={styles.image}
              />
              <Text style={styles.name}>{candidate.name}</Text>
              <Text style={styles.code}>
                Member code: {candidate.member_code}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.voteButton}
          onPress={async () => {
            const minCount = parseInt(currentElection.min_count);
            const maxCount = parseInt(currentElection.max_count);

            if (selectedCandidates.length < minCount) {
              alert(`Please select at least ${minCount} candidates`);
              return;
            }
            if (selectedCandidates.length > maxCount) {
              alert(`You can select a maximum of ${maxCount} candidates`);
              return;
            }
            const phoneNumber = userData?.[0]?.mobile;

            try {
              const response = await axios.post(
                `${BASE_URL}/api/generate_otp`,
                {
                  mobile: phoneNumber,
                },
                {
                  auth: {
                    username: AUTH_USERNAME,
                    password: AUTH_PASSWORD,
                  },
                },
              );

              const data = response.data;

              if (response.data.status === true) {
                const selectedData = candidateList.filter(candidate =>
                  selectedCandidates.includes(candidate.id),
                );
                console.log(selectedData);
                Toast.show({
                  type: 'success',
                  text1: 'OTP Sent',
                  text2: 'Check your phone for the verification code.',
                  visibilityTime: 1000,
                  position: 'top',
                });

                setTimeout(() => {
                  nav.navigate('VoteVerification', {
                    selectedCandidates: selectedData,
                    electionId: currentElection?.id,
                  });
                }, 1000);
              } else {
                Toast.show({
                  type: 'error',
                  text1: data.message || 'Failed to send OTP',
                  visibilityTime: 2000,
                  position: 'top',
                });
              }
            } catch (error) {
              console.error('API error:', error);
              Toast.show({
                type: 'error',
                text1: 'Something went wrong while sending OTP.',
                visibilityTime: 2000,
                position: 'top',
              });
            }
          }}
        >
          <Text style={styles.voteButtonText}>Confirm your Vote</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CandidateList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: s(16),
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: ms(18),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: vs(10),
  },
  subHeader: {
    fontSize: ms(16),
    fontWeight: '700',
    marginTop: vs(6),
  },
  location: {
    fontSize: ms(14),
    color: '#999',
  },
  voteCard: {
    backgroundColor: '#fff',
    marginVertical: vs(12),
    padding: s(16),
    borderRadius: ms(12),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },
  totalVotes: {
    fontSize: ms(14),
    fontWeight: '500',
    color: '#333',
  },
  voteCount: {
    color: '#003B46',
    fontWeight: '700',
  },
  voteClose: {
    color: '#999',
    fontSize: ms(12),
    marginTop: 0,
  },
  entitlementBox: {
    marginTop: vs(10),
    backgroundColor: '#37474F',
    padding: s(10),
    borderRadius: ms(8),
  },
  entitlementText: {
    color: '#fff',
    fontSize: ms(12),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: ms(10),
    padding: s(10),
    marginBottom: vs(12),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: '#D7A6FF',
  },
  image: {
    width: '100%',
    height: vs(140),
    resizeMode: 'cover',
    borderRadius: ms(10),
    marginBottom: vs(10),
  },
  name: {
    fontSize: ms(14),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: vs(4),
  },
  code: {
    fontSize: ms(12),
    color: '#555',
    textAlign: 'center',
  },
  voteButton: {
    marginTop: vs(20),
    backgroundColor: '#6A00BF',
    paddingVertical: vs(14),
    borderRadius: ms(10),
    alignItems: 'center',
    marginHorizontal: s(16),
  },
  voteButtonText: {
    color: '#fff',
    fontSize: ms(14),
    fontWeight: '600',
  },
});
