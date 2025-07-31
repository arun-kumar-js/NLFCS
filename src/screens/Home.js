import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { requestFormReset } from 'react-dom';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs, ms } from 'react-native-size-matters';

const Home = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileBox}>
            <Image
              source={require('../assets/images/profile.png')}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.name}>Kate Russell</Text>
              <Text style={styles.role}>Project Manager</Text>
            </View>
          </View>
          <View style={styles.notification}>
            <Image
              source={require('../assets/images/bell.png')}
              style={styles.bellIcon}
            />
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
          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewText}>View Results</Text>
          </TouchableOpacity>
        </View>

        {/* Election Info */}
        <Text style={styles.title}>Koperasi NLFCS Berhad</Text>
        <Text style={styles.subtitle}>Reginal Gendral Meeting</Text>

        <View style={styles.card}>
          <View style={styles.candidatesRow}>
            {[...Array(4)].map((_, i) => (
              <Image
                key={i}
                source={require('../assets/images/profile.png')}
                style={[styles.candidate, { marginLeft: i === 0 ? 0 : s(-10) }]}
              />
            ))}
            <View style={styles.moreBox}>
              <Text style={styles.moreText}>+5 more</Text>
            </View>
          </View>
          <Text style={styles.label}>Candidates</Text>
          <Text style={styles.date}>
            Election starts at 2, Jan 2025 8.00AM (MYT)
          </Text>
          <Text style={styles.selection}>Committee Members Selection</Text>
          <Text style={styles.region}>Perak Region</Text>
          <Text style={styles.label}>Voting ends in</Text>
          <View style={{ flexDirection: 'row', paddingTop: 10 }}>
            <View style={styles.timerBox}>
              <Text style={[styles.timerText, { fontSize: 11, height: 20 }]}>
                🕒 2 hours 40 minutes 2 Seconds
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.voteBtn, { fontSize: 10, width: 70 }]}
              onPress={() => navigation.navigate('CandidateList')}
            >
              <Text style={styles.voteText}>Let’s Vote</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Static Chart Placeholder */}
        <View style={styles.chart}>
          <Image
            source={require('../assets/images/chart.png')}
            style={styles.chartImage}
            resizeMode="contain"
          />
          <Image
            source={require('../assets/images/register.png')}
            style={styles.registerImage}
          />
        </View>
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
  },
  profileBox: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: s(40),
    height: vs(40),
    borderRadius: ms(20),
    marginRight: s(10),
  },
  name: { fontSize: ms(16), fontWeight: '700' },
  role: { fontSize: ms(12), color: '#777' },
  notification: { position: 'relative' },
  bellIcon: { width: s(20), height: vs(20), marginRight: s(10) },
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
    backgroundColor: '#a18cd1',
    padding: s(20),
    borderRadius: ms(16),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: vs(5),
  },
  candidatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  candidate: {
    width: s(30),
    height: vs(30),
    borderRadius: ms(15),
    borderWidth: 2,
    borderColor: '#fff',
  },
  moreBox: {
    backgroundColor: '#fff',
    borderRadius: ms(20),
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    marginLeft: s(10),
  },
  moreText: { fontSize: ms(12), fontWeight: '500' },
  label: { color: '#fff', marginTop: vs(5) },
  date: { color: '#fff', fontWeight: '500' },
  selection: {
    fontSize: ms(18),
    fontWeight: '700',
    color: '#fff',
    marginVertical: vs(5),
  },
  region: { color: '#fff', marginBottom: vs(10) },
  timerBox: {
    backgroundColor: '#222',
  width:210,
    borderRadius: ms(10),
    paddingVertical: vs(10),
    alignItems: 'center',
    marginRight:20
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
