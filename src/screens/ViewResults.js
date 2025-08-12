import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL, AUTH_USERNAME, AUTH_PASSWORD } from '../config/config';
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
        {electionResults.map((item, index) => {
          const isClosed = new Date(item.end_date) < new Date();
          return (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              navigation.navigate('ViewResultsPages', { result: item })
            }
          >
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
              <View style={styles.cardContent}>
                <Text style={styles.headingText}>{item.name}</Text>
                <Text style={styles.infoText}>
                 
                  {item.region_name}
                </Text>

                <Text style={styles.infoText}>
                  <Text style={styles.label}>Start: </Text>
                  {item.start_date}
                </Text>
                <Text style={styles.infoText}>
                  <Text style={styles.label}>End: </Text>
                  {item.end_date}
                </Text>
                <Text style={{ color: isClosed ? 'red' : 'green', fontWeight: 'bold' }}>
                  {isClosed ? 'Closed' : 'Live'}
                </Text>
              </View>
              <View>
                <Text style={styles.arrowText}>{'>'}</Text>
              </View>
            </View>
          </TouchableOpacity>
          )
        })}
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
    backgroundColor: '#ffffff',
    borderRadius: ms(12),
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: ms(6),
    elevation: 5,
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
    color: '#000',
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
  cardContent: {
    paddingVertical: vs(10),
    paddingHorizontal: s(10),
  },
  headingText: {
    fontSize: ms(18),
    fontWeight: 'bold',

    marginBottom: vs(6),
    color: '#000',
  },
  arrowText: {
    fontSize: ms(22),
    color: '#000',
    fontWeight: 'bold',
  },
});