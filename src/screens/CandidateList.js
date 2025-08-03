import React, { useState } from 'react';
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


const CandidateList = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  console.log(selectedCandidates);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const electionList = useSelector(state => state.electionList.data);

  const candidateList = electionList?.[0]?.canditates || [];
  const userData = useSelector(
    state => state.userData?.otpVerificationResponse,
  );

  return (
    <SafeAreaView style={styles.container}>
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
              <Text style={styles.voteCount}>550</Text>
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
              {electionList?.[0]?.end_date
                ? new Date(electionList[0].end_date).toLocaleString()
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
                You are entitled to vote for up to 16 candidates
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
                } else if (selectedCandidates.length < 4) {
                  setSelectedCandidates(prev => [...prev, candidate.id]);
                }
              }}
            >
              <Image
                source={{
                  uri: `${electionList?.[0]?.image_path}${candidate.image}`,
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
            if (selectedCandidates.length < 2) {
              alert('Please select at least 2 candidates');
              return;
            }
            if (selectedCandidates.length > 4) {
              alert('You can select a maximum of 4 candidates');
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
                }
              );

              const data = response.data; 

              if (response.data.status === true) {
                const selectedData = candidateList.filter(candidate => selectedCandidates.includes(candidate.id));
                navigation.navigate('VoteVerification', { selectedCandidates: selectedData });
                console.log('OTP sent:', data);
              } else {
                alert(data.message || 'Failed to send OTP');
              }
            } catch (error) {
              console.error('API error:', error);
              alert('Something went wrong while sending OTP.');
            }
          }}
        >
          <Text style={styles.voteButtonText}>Conform your Vote</Text>
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
    height: '50%',
    backgroundColor: '#F8F8F8',
    borderRadius: ms(10),
    padding: s(10),
    marginBottom: vs(12),
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#D7A6FF',
  },
  image: {
    width: '100%',
    height: vs(145),
    resizeMode: 'stretch',
    borderRadius: ms(8),
    marginBottom: vs(8),
  },
  name: {
    fontSize: ms(14),
    fontWeight: '700',
    textAlign: 'center',
  },
  code: {
    fontSize: ms(12),
    color: '#6759FF',
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
