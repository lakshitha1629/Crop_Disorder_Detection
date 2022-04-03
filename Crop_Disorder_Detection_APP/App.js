import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ContentView from './components/ContentView';

export default function App() {
  return (
    <View style={styles.container}>
      <ContentView  style={styles.content}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:20,
    // backgroundColor: '#000000'
  },
  content: {
    padding: 40,
  },
});