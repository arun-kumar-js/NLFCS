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

const Notification = () => {
  const [otpResponse, setOtpResponse] = useState(null);

  useEffect(() => {
    const fetchOtpResponse = async () => {
      try {
        const storedOtp = await AsyncStorage.getItem('user');
        if (storedOtp) {
          const parsedOtp = JSON.parse(storedOtp);
          setOtpResponse(parsedOtp);
        }
      } catch (error) {
        console.error('Failed to load OTP response from AsyncStorage:', error);
      }
    };

    fetchOtpResponse();
  }, []);

  const member_code =
    Array.isArray(otpResponse) && otpResponse.length > 0
      ? otpResponse[0].id
      : otpResponse?.id || null;
  console.log(member_code);
  const [electionResults, setElectionResults] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchElectionResults = async () => {
      if (!member_code) return;

      try {
        const response = await axios.post(
          `${BASE_URL}/api/notification_list`,
          { member_id: member_code },
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
      } catch (error) {
        console.error('Error fetching election results:', error);
      }
    };

    fetchElectionResults();
  }, [member_code]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {electionResults.map((item, index) => (
          <View key={index} style={styles.notificationBanner}>
            {item.image ? (
              <Image
                source={{ uri: 'https://spider.org.in/nlfcs/uploads/' + item.image }}
                style={styles.notificationImage}
                resizeMode="cover"
              />
            ) : null}
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationMessage}>{item.message}</Text>
              <Text style={styles.notificationDate}>{item.created}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notification;

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
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: s(12),
    marginVertical: vs(8),
    backgroundColor: '#fff',
    borderRadius: ms(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  notificationImage: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(6),
    marginRight: s(10),
  },

  notificationContent: {
    flex: 1,
  },

  notificationTitle: {
    fontSize: ms(16),
    fontWeight: 'bold',
    marginBottom: vs(2),
    color: '#222',
  },

  notificationMessage: {
    fontSize: ms(14),
    color: '#555',
  },

  notificationDate: {
    fontSize: ms(12),
    color: '#888',
    marginTop: vs(4),
  },
});
