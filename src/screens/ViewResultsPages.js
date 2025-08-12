import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { AUTH_USERNAME, AUTH_PASSWORD, BASE_URL } from '../config/config';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView } from 'react-native';

const IMAGE_BASE_URL = 'https://spider.org.in/nlfcs/uploads/';

const CARD_COLORS = ['#D69C91', '#DBA89D', '#D5B083', '#E4D28A', '#B3C3A0'];

const ViewResultsPages = ({ route }) => {
  const { result } = route.params;
  const electionId = result?.id;
  const [candidates, setCandidates] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');
  const timerRef = useRef(null);
  console.log(electionId, result);
  // Calculate countdown endtime as a timestamp
  const endtime = new Date(result.end_date).getTime();
console.log(endtime);
  useEffect(() => {
    if (!result?.end_date) return;

    const end = new Date(result.end_date);
    const updateTimer = () => {
      const now = new Date();
      const diff = end - now;
      if (diff <= 0) {
        clearInterval(timerRef.current);
        setTimeLeft('00:00:00');
      } else {
        const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
        setTimeLeft(`${hours}:${minutes}:${seconds}`);
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);
    return () => clearInterval(timerRef.current);
  }, [result]);
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/candidate_result_list`,
          { election_id: electionId },
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
        setCandidates(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    if (electionId) {
      fetchCandidates();
    }
  }, [electionId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Koperasi NLFCS Berhad</Text>
          <View style={styles.subHeader}>
            <Text style={styles.state}>{result?.region_name || 'N/A'}</Text>
            <Text style={styles.time}>{timeLeft}</Text>
          </View>
          <Text style={styles.subtitle}>Result {new Date(result?.start_date).getFullYear()}</Text>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Committee Members</Text>
            <Text style={styles.region}>{result?.region_name || 'Region'}</Text>
          </View>
        </View>
        {candidates.map((item, index) => (
          <View
            key={index}
            style={[
              styles.cardBase,
              { backgroundColor: CARD_COLORS[index % CARD_COLORS.length] },
            ]}
          >
            <View style={styles.leftSection}>
              <Image
                source={{ uri: IMAGE_BASE_URL + item.image }}
                style={styles.profileImage}
                resizeMode="stretch"
              />
            </View>

            <View style={styles.rightSection}>
              <Text style={styles.name}>{item.name}</Text>

              <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                <Text style={styles.code}>Member Code {item.member_code}</Text>
                <Image
                  source={require('../assets/images/star.png')}
                  style={styles.starIcon}
                />
              </View>

              <View style={styles.footerRow}>
                <View style={styles.voteRow}>
                  <Image
                    source={require('../assets/images/vote.png')}
                    style={styles.voteIcon}
                  />
                  <Text style={styles.voteText}>{item.vote_count} Votes</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewResultsPages;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  state: {
    color: 'purple',
    fontSize: 14,
  },
  time: {
    color: 'purple',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 16,
    color: 'purple',
    marginBottom: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  region: {
    fontSize: 14,
    color: 'purple',
    fontWeight: '500',
  },
  cardBase: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  leftSection: {
    marginRight: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  rightSection: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  code: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: '#fff',
  },
  voteText: {
    color: '#fff',
    fontSize: 14,
  },
  starIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
    alignSelf: 'center',
  },
});
