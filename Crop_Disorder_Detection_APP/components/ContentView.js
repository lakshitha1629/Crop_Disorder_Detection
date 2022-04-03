import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ContentView() {
    return (
        <View style={styles.item}>
            <WebView 
                source={{ uri: 'https://crop-disorder-detection-fe.herokuapp.com/home' }} 
                originWhitelist={['*']}/>
        </View>
    );
  }
  
  const styles = StyleSheet.create({
    item: {
        flex: 1
      }
  });