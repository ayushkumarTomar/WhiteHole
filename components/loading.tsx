import { View, ActivityIndicator , StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { vs } from 'react-native-size-matters'

const Loading = () => {
  return (
    <View style={styles.container}>
        <LinearGradient
        colors={['rgba(14, 14, 14, 0.00)', 'rgba(16, 43, 45, 0.94)', 'rgba(6, 160, 181, 0)']}
        style={styles.gradient}
      />
      <ActivityIndicator size={vs(30)} style={{flex:1}} color={'white'} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1B1B1B',
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '30%',
    }})

export default Loading