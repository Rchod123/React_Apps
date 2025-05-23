import {FlatList, Image, View, Text, TouchableOpacity} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/ScreenSize';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const Screens = [
    {
      image: require('../assets/images/stopwatch_5433499.png'),
      text: 'StopWatch',
    },
    {
      image: require('../assets/images/notes.png'),
      text: 'Notes',
    },
   {
   image: require('../assets/images/Todo.png'),
   text: "ToDo",
   }
  ];


  return (
    <View>
      <FlatList
        data={Screens}
        numColumns={3}
        columnWrapperStyle={{gap: widthPercentageToDP(15)}}
        style={{
          paddingLeft: widthPercentageToDP(8),
          paddingTop: heightPercentageToDP(5),
        }}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate(item.text)}
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              height: heightPercentageToDP(15),
              width: widthPercentageToDP(20),
              justifyContent:"center",
              alignContent:"center",
            }}>
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
