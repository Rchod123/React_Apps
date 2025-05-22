import {FlatList, Image, View, Text, TouchableOpacity} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/ScreenSize';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation();
  const Screens = [
    {
      image: require('../assets/images/stopwatch_5433499.png'),
      text: 'StopWatch',
    },
  ];
  return (
    <View>
      <FlatList
        data={Screens}
        numColumns={3}
        style={{
          paddingLeft: widthPercentageToDP(8),
          paddingTop: heightPercentageToDP(5),
        }}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => navigation.navigate("StopWatch")} style={{flexDirection: 'column', alignItems: 'center'}}>
            <Image
              style={{
                height: heightPercentageToDP(5),
                width: widthPercentageToDP(10),
              }}
              source={item.image}
              alt="Image"
            />
            <Text>{item.text}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeScreen;
