import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

export default function FullscreenLoader({ visible }: { visible: boolean }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.container}>
        <View>
          <ActivityIndicator size="large"/>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // fond semi-transparent
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'white', // ou ton thème
  },
});
