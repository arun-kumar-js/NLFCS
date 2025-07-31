import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { s, vs, ms } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const dummyImage = require('../assets/images/image11.png');

const candidates = [
  { id: 1, name: 'Kalyana Sundaram', code: '20324453', image: dummyImage },
  { id: 2, name: 'Somu Agarwal', code: '20324453', image: dummyImage },
  { id: 3, name: 'Kalyana Sundaram', code: '20324453', image: dummyImage },
  { id: 4, name: 'Somu Agarwal', code: '20324453', image: dummyImage },
  { id: 5, name: 'Kalyana Sundaram', code: '20324453', image: dummyImage },
  { id: 6, name: 'Somu Agarwal', code: '20324453', image: dummyImage },
  { id: 7, name: 'Kalyana Sundaram', code: '20324453', image: dummyImage },
  { id: 8, name: 'Somu Agarwal', code: '20324453', image: dummyImage },
];

const CandidateList = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Candidate list</Text>
        <Text style={styles.subHeader}>Committee Member Selection</Text>
        <Text style={styles.location}>Perak</Text>

        <View style={styles.voteCard}>
          <Text style={styles.totalVotes}>
            Total votes <Text style={styles.voteCount}>🔷 550</Text>
          </Text>
          <Text style={styles.voteClose}>🕒 Voting closes at 8 pm Apr 3, 2025</Text>
          <View style={styles.entitlementBox}>
            <Text style={styles.entitlementText}>🗳️ You are entitled to vote for up to 16 candidates</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {candidates.map((candidate, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                selectedCandidates.includes(candidate.id) && styles.selectedCard,
              ]}
              onPress={() => {
                if (selectedCandidates.includes(candidate.id)) {
                  setSelectedCandidates(prev => prev.filter(id => id !== candidate.id));
                } else if (selectedCandidates.length < 4) {
                  setSelectedCandidates(prev => [...prev, candidate.id]);
                }
              }}
            >
              <Image source={candidate.image} style={styles.image} />
              <Text style={styles.name}>{candidate.name}</Text>
              <Text style={styles.code}>Member code:{candidate.code}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.voteButton}
          onPress={() => navigation.navigate('VoteVerification', { selectedCandidates })}
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
    marginTop: vs(6),
    color: '#999',
    fontSize: ms(12),
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
    width: ms(160),
    height: vs(145),
    padding: ms(10),
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