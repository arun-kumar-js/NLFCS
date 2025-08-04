import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, AUTH_USERNAME, AUTH_PASSWORD } from '../config/config';
import { s, vs, ms } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

const ViewResults = () => {
  const [otpResponse, setOtpResponse] = useState([]);
const [VoteResult, setVoteResult] = useState([]);
  useEffect(() => {
    const fetchOtpResponse = async () => {
      try {
        const storedOtp = await AsyncStorage.getItem('user');
        if (storedOtp) {
          const parsedOtp = JSON.parse(storedOtp);
          setOtpResponse(parsedOtp);
          console.log('Fetched otpResponse from async storage:', parsedOtp);
        }

        const storedVote = await AsyncStorage.getItem('vote_result');
        if (storedVote) {
          const parsedVote = JSON.parse(storedVote);
          setVoteResult(parsedVote);
          console.log('Fetched voteResult from async storage:', parsedVote);
        }
      } catch (error) {
        console.error('Failed to fetch data from async storage:', error);
      }
    };

    fetchOtpResponse();
  }, []);

  const election_id =
    Array.isArray(otpResponse) && otpResponse.length > 0
      ? otpResponse[0].id
      : null;
  console.log(otpResponse.region_id);
  
const region_id =
  Array.isArray(otpResponse) && otpResponse.length > 0
    ? otpResponse[0].region_id
    : null;
  const [electionResults, setElectionResults] = useState([]);
  const [imagePath, setImagePath] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const fetchElectionResults = async () => {
      if (!region_id) return;

      try {
        const response = await axios.post(
          `${BASE_URL}/api/election_result_list`,
          { region_id: region_id },
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
        console.log('Election Results:', response.data);
        setElectionResults(response.data.data || []);
        setImagePath(response.data.image_path || '');
      } catch (error) {
        console.error('Error fetching election results:', error);
      }
    };

    fetchElectionResults();
  }, [election_id]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {electionResults.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image
              source={{ uri: imagePath + item.image }}
              style={styles.image}
              resizeMode="stretch"
            />
            <Text style={styles.infoText}>
              <Text style={styles.label}>Name:</Text> {item.name}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Election ID:</Text> {item.election_id}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Vote Count:</Text> {item.vote_count}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Member Code:</Text> {item.member_code}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>IC Number:</Text> {item.ic_number}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewResults;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: s(10),
  },
  backButton: {
    position: 'absolute',
    top: vs(10),
    left: s(10),
    zIndex: 10,
    padding: s(5),
  },
  backImage: {
    width: ms(24),
    height: ms(24),
    resizeMode: 'contain',
  },
  card: {
    marginVertical: vs(10),
    padding: s(15),
    backgroundColor: '#f9f9f9',
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: ms(4),
    elevation: 3,
  },
  image: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(50),
    marginBottom: vs(10),
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  infoText: {
    fontSize: ms(16),
    marginVertical: vs(2),
  },
  label: {
    fontWeight: 'bold',
  },
});
