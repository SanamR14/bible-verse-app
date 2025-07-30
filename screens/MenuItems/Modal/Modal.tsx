
import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

type RequestModalProps = {
  visible: boolean;
  onClose: () => void;
  requestText: string;
};

const PrayerModal: React.FC<RequestModalProps> = ({ visible, onClose, requestText }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Submitted Request</Text>
          <Text style={styles.message}>{requestText || 'No content provided.'}</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default PrayerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
