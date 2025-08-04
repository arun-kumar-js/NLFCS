import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setElectionList } from '../redux/slice/ElectionListSlice';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs, ms } from 'react-native-size-matters';
import { BASE_URL, AUTH_USERNAME, AUTH_PASSWORD } from '../config/config';
const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [electionData, setElectionData] = useState();// election list here 
  const [candidateList, setCandidateList] = useState([]);
  const [chartData, setChartData] = useState({});
  const [otpResponse, setOtpResponse] = useState(null);
  const [voteResult, setVoteResult] = useState(null);

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

  console.log('otpResponse', otpResponse);
  console.log(otpResponse?.[0]?.id);
  console.log(otpResponse?.[0]?.region_id);
  const electionListResult = useSelector(
    state => state?.electionList?.data || [],
  );
 
  const voteStatus = electionListResult?.[0]?.vote_status;
//console.log(voteStatus)
  useEffect(() => {
    if (otpResponse?.[0]?.id && otpResponse?.[0]?.region_id) {
      electionList();
    }
  }, [otpResponse]);

  const electionList = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/election_list`,
        {
          member_id: otpResponse?.[0]?.id,
          region_id: otpResponse?.[0]?.region_id,
        },
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
      console.log('Election List :', response.data);

      setElectionData(response.data.data);
      dispatch(setElectionList(response.data.data));
      setCandidateList(response.data?.data?.[0]?.canditates || []);
      // Fetch chart data for all elections
      for (const election of response.data.data) {
        await generateChartData(election.id);
      }
    } catch (error) {
      console.error('Error fetching election list:', error);
    }
  };

  const generateChartData = async (electionId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/voting_graph`,
        {
          member_id: otpResponse?.[0]?.id,
          region_id: otpResponse?.[0]?.region_id,
          election_id: electionId,
        },
        {
          auth: {
            username: AUTH_USERNAME,
            password: AUTH_PASSWORD,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const rawTimeSlots = response.data?.data?.[0]?.timeSlots || [];
      const limitedTimeSlots = rawTimeSlots.slice(0, 15);
      const chartPoints = limitedTimeSlots.map(slot => ({
        time: slot.time,
        votes: slot.votes,
      }));

      setChartData(prev => ({
        ...prev,
        [electionId]: chartPoints
      }));
    } catch (error) {
      console.error(`Error fetching chart data for election ${electionId}:`, error);
    }
  };




  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileBox}>
            <TouchableOpacity onPress={() => navigation.navigate('profile')}>
              <Image
                source={{
                  uri: `${electionData?.[0]?.image_path}1753084380_e294e4eb588cc34acea2.png`,
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.name}>
                {otpResponse?.[0]?.name || 'User'}
              </Text>
            </View>
          </View>
          <View style={styles.notification}>
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Image
                source={require('../assets/images/bell.png')}
                style={styles.bellIcon}
              />
            </TouchableOpacity>
            <View style={styles.redDot}>
              <Text style={styles.dotText}>1</Text>
            </View>
          </View>
        </View>
        {/* Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity style={styles.onGoingBtn}>
            <Text style={styles.onGoingText}>On Going</Text>
          </TouchableOpacity>
         <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => navigation.navigate('ViewResults')}
          >
            <Text style={styles.viewText}>View Results</Text>
          </TouchableOpacity>
        </View>
        {/* Election Info */}
        <Text style={styles.title}>Koperasi NLFCS Berhad</Text>
        <Text style={styles.subtitle}>Reginal Gendral Meeting</Text>
        {electionData?.map((election, index) => (
          <LinearGradient
            key={index}
            colors={['#7555CE', '#8C9CF7']}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.candidatesRow}>
              {election?.canditates?.slice(0, 4).map((candidate, i) => (
                <View key={candidate.id}>
                  <Image
                    source={{
                      uri: `${election?.image_path}${candidate.image}`,
                    }}
                    style={[
                      styles.candidate,
                      { marginLeft: i === 0 ? 0 : s(-10) },
                    ]}
                  />
                </View>
              ))}
              {election?.canditates?.length > 4 && (
                <View style={styles.moreBox}>
                  <Text style={styles.moreText}>
                    +{election?.canditates?.length - 4} more
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.label}>Candidates</Text>
            <Text style={styles.date}>
              Election starts at{' '}
              {new Date(election?.start_date).toLocaleString('en-MY', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kuala_Lumpur',
              })}{' '}
              (MYT)
            </Text>
            <Text style={styles.selection}>Committee Members Selection</Text>
            <Text style={styles.region}>
              {election?.region_name || 'Region'}
            </Text>
            <Text style={styles.label}>Voting ends at</Text>
            <View style={{ flexDirection: 'row', paddingTop: 10, paddingLeft: 10 }}>
              <View style={styles.timerBox}>
                <Text style={[styles.timerText, { fontSize: 11, height: 20 }]}>
                  🕒{' '}
                  {(() => {
                    const end = new Date(election?.end_date);
                    const now = new Date();
                    const diffMs = end - now;
                    if (diffMs <= 0) return 'Voting ended';
                    const hours = Math.floor(diffMs / (1000 * 60 * 60));
                    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
                    return `${hours} hours ${minutes} minutes ${seconds} seconds`;
                  })()}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.voteBtn, { fontSize: 10, width: 70 }]}
                onPress={() => navigation.navigate('CandidateList', { electionId: election.id })}
              >
                <Text style={styles.voteText}>Let’s Vote</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        ))}
        {electionData?.map((election, index) => (
          <View
            key={`chart-${index}`}
            style={{
              height: 300,
              padding: 16,
              backgroundColor: '#f8f9fa',
              borderRadius: 12,
              marginTop: 16,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 0, textAlign: 'center' }}>
                Voting Progress
              </Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#333' }}>
                  Total Votes: {(chartData[election.id] || []).reduce((sum, item) => sum + item.votes, 0)}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', height: 200, position: 'relative' }}>
              <View style={{ width: 60, justifyContent: 'space-between', paddingRight: 10 }}>
                {['400', '300', '200', '100'].map((label, idx) => (
                  <Text
                    key={idx}
                    style={{
                      fontSize: 12,
                      color: idx === 0 ? '#444' : '#666',
                      textAlign: 'right',
                      fontWeight: idx === 0 ? '700' : '600',
                      letterSpacing: 0.15,
                    }}
                  >
                    {label}
                  </Text>
                ))}
              </View>
              <View
                style={{
                  position: 'absolute',
                  left: 60,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  pointerEvents: 'none',
                }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={{
                      height: 1,
                      backgroundColor: i === 0 ? '#d2d2d2' : '#eee',
                      width: '100%',
                    }}
                  />
                ))}
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  height: 200,
                  marginLeft: 0,
                  zIndex: 2,
                }}
              >
                {[...Array(12)].map((_, idx) => {
                  const item = (chartData[election.id] || [])[idx] || { votes: 0 };
                  const barHeight = Math.min(item.votes / 400, 1) * 160;
                  const minLight = 70, maxLight = 53;
                  const lightness =
                    400 === 0
                      ? maxLight
                      : maxLight + (minLight - maxLight) * (1 - Math.min(item.votes / 400, 1));
                  const barColor = `hsl(260, 65%, ${lightness}%)`;
                  const timeLabel = idx === 0 ? '' : `${idx + 1}`;
                  return (
                    <View
                      key={idx}
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        marginHorizontal: 2,
                        marginTop: 6,
                        marginBottom: 6,
                      }}
                    >
                      <View
                        style={{
                          width: 20,
                          height: barHeight,
                          backgroundColor: barColor,
                          borderRadius: 4,
                          marginBottom: 6,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.1,
                          shadowRadius: 2,
                          elevation: 2,
                        }}
                      />
                      {item.votes > 0 && (
                        <Text
                          style={{
                            fontSize: 10,
                            color: '#222',
                            fontWeight: '700',
                            textShadowColor: '#fff',
                            textShadowOffset: { width: 0, height: 1 },
                            textShadowRadius: 1,
                          }}
                        >
                          {item.votes}
                        </Text>
                      )}
                      {timeLabel !== '0' && (
                        <Text
                          style={{
                            fontSize: 9,
                            color: '#555',
                            marginTop: 2,
                            fontWeight: '600',
                            letterSpacing: 0.2,
                          }}
                        >
                          {timeLabel}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
                paddingHorizontal: 10,
              }}
            >
              <Text style={{ fontSize: 12, color: '#666' }}>Vote Count</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>Time (Hours)</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, padding: s(20), backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 17,
    padding: 10,
    // backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 90,
  },
  profileBox: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: s(40),
    height: vs(40),
    borderRadius: ms(25),
    marginRight: s(12),
  },
  name: { fontSize: ms(16), fontWeight: '700' },
  role: { fontSize: ms(12), color: '#777' },
  notification: { position: 'relative' },
  bellIcon: { width: s(20), height: vs(20), marginRight: s(11) },
  redDot: {
    position: 'absolute',
    top: vs(-7),
    right: s(0),
    backgroundColor: 'red',
    width: s(16),
    height: vs(16),
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotText: { color: '#fff', fontSize: ms(10) },
  toggleRow: { flexDirection: 'row', marginVertical: vs(20) },
  onGoingBtn: {
    flex: 1,
    backgroundColor: '#8e2de2',
    padding: vs(12),
    borderRadius: ms(10),
    alignItems: 'center',
  },
  onGoingText: { color: '#fff', fontWeight: '600' },
  viewBtn: {
    flex: 1,
    padding: vs(12),
    borderRadius: ms(10),
    borderColor: '#8e2de2',
    borderWidth: 1,
    marginLeft: s(10),
    alignItems: 'center',
  },
  viewText: { color: '#8e2de2', fontWeight: '600' },
  title: { fontSize: ms(18), fontWeight: '700' },
  subtitle: { color: '#777', marginBottom: vs(10) },
  card: {
    // backgroundColor: '#7555CE',
    padding: s(3),
    borderRadius: ms(16),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: vs(5),
    width: 350,
    height: 269,
  },
  candidatesRow: {
    flexDirection: 'row',

    margin: vs(10),
  },
  candidate: {
    width: s(35),
    height: vs(30),
    borderRadius: ms(17),
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: vs(10),
  },
  moreBox: {
    backgroundColor: '#fff',
    borderRadius: ms(20),
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    marginLeft: s(10),
  },
  moreText: { fontSize: ms(12), fontWeight: '500' },
  label: {
    color: '#fff',
    marginTop: vs(2),
    marginLeft: vs(10),
  },
  date: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: vs(10),
  },
  selection: {
    fontSize: ms(18),
    fontWeight: '700',
    color: '#fff',
    marginVertical: vs(5),
    marginLeft: vs(10),
  },
  region: { color: '#fff', marginLeft: vs(10) },
  timerBox: {
    backgroundColor: '#222',
    width: 210,
    borderRadius: ms(10),
    paddingVertical: vs(10),
    alignItems: 'center',
    marginRight: 20,
  },
  timerText: { color: '#fff' },
  voteBtn: {
    backgroundColor: '#fff',
    borderRadius: ms(10),
    paddingVertical: vs(10),
    alignItems: 'center',
  },
  voteText: { color: '#000', fontWeight: '600' },
  chart: {
    alignItems: 'center',
    position: 'relative',
  },
  chartImage: {
    width: s(316),
    height: vs(316),
  },
  registerImage: {
    position: 'absolute',
    top: 20,
    right: 0,
    width: s(121),
    height: vs(25),
  },
});
