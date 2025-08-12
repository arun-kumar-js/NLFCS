import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';

const profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(Array.isArray(parsedUser) ? parsedUser[0] : parsedUser);
        }
      } catch (error) {
        console.error('Failed to fetch user from async storage:', error);
      }
    };

    fetchUser();
  }, []);

  const navigation = useNavigation();
  console.log(user)
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image
                   source={require('../assets/images/backarrow.png')}
                   style={{ width: 24, height: 24 }}
                 />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.card}>
          {user?.image && (
            <Image
              source={{ uri: `https://spider.org.in/nlfcs/uploads/${user?.image}` }}
              style={styles.profileImage}
            />
          )}
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.info}>
            <Text style={styles.label}>IC Number: </Text>
            {user?.ic_number}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Mobile: </Text>
            {user?.mobile}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Gender: </Text>
            {user?.gender}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Address: </Text>
            {user?.address}
          </Text>
       
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await AsyncStorage.clear();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            );
          }}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default profile

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    marginTop: 20,
  },
  header: {
    backgroundColor: '#7555CE',
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 20,
    padding: 5,
  },
  backButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    resizeMode: 'contain',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  info: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
    alignSelf: 'stretch',
    backgroundColor: '#f9f9fc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  label: {
    color: '#888',
    fontWeight: '600',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#E53935',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});