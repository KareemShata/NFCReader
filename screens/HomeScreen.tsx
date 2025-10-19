import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

/**
 * Type definition for navigation props
 * This provides type safety for navigation methods
 */
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

/**
 * HomeScreen Component
 * 
 * This is the main landing screen that provides navigation to the NFC reader.
 * It demonstrates:
 * - TypeScript props interface for type safety
 * - Typed navigation props
 * - Basic React Native component structure with functional components
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NFC Credit Card Reader</Text>
      <Text style={styles.description}>
        Read credit card information using your device's NFC capability
      </Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('NFCReader')}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Start NFC Scanning</Text>
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How to use:</Text>
        <Text style={styles.infoText}>1. Tap the button above</Text>
        <Text style={styles.infoText}>2. Hold your credit card near the device</Text>
        <Text style={styles.infoText}>3. Wait for the scan to complete</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 60,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
});

export default HomeScreen;

