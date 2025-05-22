import React, { useEffect } from 'react';
import { View, StyleSheet, Appearance } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { Colors } from '../utils/Theme';

const AnimatedLine = Animated.createAnimatedComponent(Line);
const colorScheme = Appearance.getColorScheme();
interface ClockAnimationProps {
  isRunning: boolean;
  size?: number;
}

const ClockAnimation: React.FC<ClockAnimationProps> = ({ isRunning, size = 200 }) => {
  const center = size / 2;
  const radius = center - 10;
  const angle = useSharedValue(0);

  useEffect(() => {
    if (isRunning) {
      angle.value = withRepeat(
        withTiming(360, { duration: 60000 }),
        -1,
        false,
      );
    } else {
      cancelAnimation(angle);
      angle.value = 0;
    }
  }, [isRunning]);

  const animatedProps = useAnimatedProps(() => {
    const theta = (angle.value - 90) * (Math.PI / 180);
    const x2 = center + radius * Math.cos(theta);
    const y2 = center + radius * Math.sin(theta);
    return {
      x2,
      y2,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colorScheme ? Colors[colorScheme].subTextColor : "white"}
          strokeWidth={4}
          fill="none"
        />
        <AnimatedLine
          x1={center}
          y1={center}
          animatedProps={animatedProps}
        stroke={colorScheme ? Colors[colorScheme].subTextColor : "white"}
          strokeWidth={4}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ClockAnimation;