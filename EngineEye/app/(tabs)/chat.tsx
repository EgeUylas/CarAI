import { Text, View, StyleSheet } from 'react-native';                 //Chat(Yapay Zekanın Kısmı) Sayfası
import Aichat from '@/components/lchat/Aichat';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Aichat/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141F27',
    paddingTop:60,
  },

});
