import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import { Colors } from '../utils/Theme';
import { heightPercentageToDP, widthPercentageToDP } from '../utils/ScreenSize';
import ClockAnimation from '../components/clockAnimation';
import TimeList from '../components/TimeList';

const StopWatchScreen = () => {
   const colorScheme = useColorScheme();
   
  const [start,setStart] = useState(false);
  const [timer,setTimer] = useState(0);
  const [laps,setLaps] = useState<string[]>([]);
  const Button = ({text, onClick}: {text: string; onClick: Function}) => (
    <TouchableOpacity onPress={() => onClick()}>
      <Text style={[styles.buttonText,{color: Colors[colorScheme ?? "light"].subTextColor }]}>{text}</Text>
    </TouchableOpacity>
  );


  useEffect(() => {
    if(start){
      const timer = setInterval(() => {
        setTimer((prevTime) => prevTime+1)
      },1000);
      return () => clearInterval(timer);
    }
  },[start]);

  const formatTime = (time:number) => {
    const min = Math.floor(time/60);
    const sec = Math.floor(time %60);
    return `${min.toString().padStart(2,'0')} : ${sec.toString().padStart(2,'0')}`
  }

  const lapSetter = () => {
      setLaps((prev) => [...prev,formatTime(timer)])
  }

  const onClear = () => {
    setStart(false);
    setLaps([]);
    setTimer(0);
  }

  return (
    <SafeAreaView
      style={[
        styles.mainContainer,
        {
          backgroundColor: colorScheme
            ? Colors[colorScheme].backgroundColor
            : 'white',
        },
      ]}>
       
        <View style={{height: heightPercentageToDP(80)}}>

           <ClockAnimation isRunning={start}/>
           <Text style={styles.clockText}>{formatTime(timer)}</Text>
           <FlatList 
           data={laps}
           showsVerticalScrollIndicator={false}
           renderItem={({item,index}) => (
            <TimeList text={item} index={index+1}/>
           )}
           />
          
        </View>
        
      <View
        style={[
          styles.viewContaine,
          {
            backgroundColor: colorScheme
              ? Colors[colorScheme].subContainer
              : 'white',
          },
        ]}>
        <Button text={'CLEAR'} onClick={onClear} />
        <Button text={'LAP'} onClick={() => lapSetter()} />
        <Button text={start ? 'STOP' : 'START'} onClick={() => setStart((prev) => !prev)} />
      </View>
    </SafeAreaView>
  );
};

export default StopWatchScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewContaine: {
    flexDirection: 'row',
    width: widthPercentageToDP(100),
    justifyContent: 'space-around',
    alignItems:"center",
    height: heightPercentageToDP(6),
  },
  buttonText: {
    fontSize: heightPercentageToDP(2),
    fontWeight:"700"
  },
  clockText:{
    textAlign:"center",
    fontSize: heightPercentageToDP(4),
    fontWeight:"700",
  }
});
