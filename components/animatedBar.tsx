import { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const Bar = ({ delay }:{delay : number}) => {
  const heightAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heightAnim, {
          toValue: 30,
          duration: 300,
          delay,
          useNativeDriver: false,
        }),
        Animated.timing(heightAnim, {
          toValue: 10,
          duration: 300,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [heightAnim]);

  return <Animated.View style={[styles.bar, { height: heightAnim }]} />;
};

const MusicPlayingAnimation = () => (
  <View style={styles.container}>
    <Bar delay={0} />
    <Bar delay={150} />
    <Bar delay={300} />
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end' },
  bar: { width: 5, backgroundColor: 'green', marginHorizontal: 2 },
});

export default MusicPlayingAnimation;
