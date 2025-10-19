import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import NfcManager, { NfcTech, Ndef, TagEvent } from 'react-native-nfc-manager';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

/**
 * Type definition for navigation props
 */
type NFCReaderScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NFCReader'
>;

interface NFCReaderScreenProps {
  navigation: NFCReaderScreenNavigationProp;
}

/**
 * Interface for parsed credit card data
 * This defines the structure of data we extract from NFC tags
 */
interface CardData {
  id: string;
  techTypes: string[];
  type: string;
  cardNumber: string;
  scannedAt: string;
}

/**
 * NFCReaderScreen Component
 * 
 * This component demonstrates:
 * - TypeScript interfaces for props and state objects
 * - useState hook with typed state values
 * - useEffect hook for lifecycle management
 * - Async operations with NFC
 * - Error handling and user feedback
 * - Conditional rendering based on state
 * - Type-safe navigation
 */
const NFCReaderScreen: React.FC<NFCReaderScreenProps> = ({ navigation }) => {
  // State management using hooks with TypeScript types
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [nfcSupported, setNfcSupported] = useState<boolean>(true);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * useEffect: Initialize NFC when component mounts
   * The empty dependency array [] means this runs once on mount
   * The return function is cleanup that runs on unmount
   */
  useEffect(() => {
    checkNfcSupport();

    // Cleanup function: stop NFC and clean up when component unmounts
    return () => {
      cleanUpNfc();
    };
  }, []);

  /**
   * Check if device supports NFC
   */
  const checkNfcSupport = async (): Promise<void> => {
    try {
      const supported = await NfcManager.isSupported();
      setNfcSupported(supported);
      
      if (supported) {
        await NfcManager.start();
      } else {
        Alert.alert(
          'NFC Not Supported',
          'Your device does not support NFC functionality',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (err) {
      console.error('Error checking NFC support:', err);
      setNfcSupported(false);
    }
  };

  /**
   * Clean up NFC manager
   */
  const cleanUpNfc = async (): Promise<void> => {
    try {
      await NfcManager.cancelTechnologyRequest();
    } catch (err) {
      console.log('Cleanup error:', err);
    }
  };

  /**
   * Start scanning for NFC tags
   * This is an async function that demonstrates async/await pattern
   */
  const startScan = async (): Promise<void> => {
    if (!nfcSupported) {
      Alert.alert('Error', 'NFC is not supported on this device');
      return;
    }

    // Reset previous state
    setIsScanning(true);
    setError(null);
    setCardData(null);

    try {
      // Request NFC technology - this waits for a tag to be detected
      await NfcManager.requestTechnology(NfcTech.IsoDep);
      
      // Get tag information
      const tag: TagEvent | null = await NfcManager.getTag();
      
      if (tag) {
        // Parse credit card data from the tag
        const parsedData = parseCardData(tag);
        setCardData(parsedData);
        
        Alert.alert(
          'Success',
          'Credit card scanned successfully!',
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      console.error('NFC Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to read NFC tag';
      setError(errorMessage);
      
      Alert.alert(
        'Scan Failed',
        'Unable to read the card. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      // Always clean up and reset scanning state
      setIsScanning(false);
      await cleanUpNfc();
    }
  };

  /**
   * Parse credit card data from NFC tag
   * Note: This is a simplified parser. Real credit card reading
   * requires EMV protocol implementation which is complex.
   */
  const parseCardData = (tag: TagEvent): CardData => {
    // Extract available data from the tag
    const data: CardData = {
      id: tag.id || 'N/A',
      techTypes: tag.techTypes || [],
      type: tag.type || 'Unknown',
      // In a real implementation, you would parse EMV data here
      cardNumber: maskCardNumber(tag.id),
      scannedAt: new Date().toLocaleString(),
    };

    return data;
  };

  /**
   * Mask card number for security (show only last 4 digits)
   */
  const maskCardNumber = (id: string | undefined): string => {
    if (!id) return '****';
    const lastFour = id.slice(-4);
    return `**** **** **** ${lastFour}`;
  };

  /**
   * Cancel ongoing scan
   */
  const cancelScan = async (): Promise<void> => {
    setIsScanning(false);
    await cleanUpNfc();
  };

  // Conditional rendering based on NFC support
  if (!nfcSupported) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>NFC is not supported on this device</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>NFC Card Reader</Text>
        
        {/* Scanning indicator */}
        {isScanning ? (
          <View style={styles.scanningContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.scanningText}>
              Hold your credit card near the device...
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={cancelScan}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={startScan}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Start Scanning</Text>
          </TouchableOpacity>
        )}

        {/* Error display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}

        {/* Card data display */}
        {cardData && (
          <View style={styles.cardDataContainer}>
            <Text style={styles.cardDataTitle}>Card Information</Text>
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Card Number:</Text>
              <Text style={styles.dataValue}>{cardData.cardNumber}</Text>
            </View>
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Tag ID:</Text>
              <Text style={styles.dataValue}>{cardData.id}</Text>
            </View>
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Tag Type:</Text>
              <Text style={styles.dataValue}>{cardData.type}</Text>
            </View>
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Scanned At:</Text>
              <Text style={styles.dataValue}>{cardData.scannedAt}</Text>
            </View>
            
            {cardData.techTypes.length > 0 && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Technologies:</Text>
                <Text style={styles.dataValue}>
                  {cardData.techTypes.join(', ')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Info section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Important Notes:</Text>
          <Text style={styles.infoText}>
            • This app reads basic NFC tag information
          </Text>
          <Text style={styles.infoText}>
            • Full EMV credit card reading requires additional security measures
          </Text>
          <Text style={styles.infoText}>
            • Keep the card steady near the NFC sensor during scanning
          </Text>
          <Text style={styles.infoText}>
            • Some cards may not be readable due to security restrictions
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginVertical: 10,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  scanningContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  scanningText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
  },
  cardDataContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardDataTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  dataValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  infoContainer: {
    backgroundColor: '#FFF9E6',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    width: '100%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginVertical: 3,
  },
});

export default NFCReaderScreen;

