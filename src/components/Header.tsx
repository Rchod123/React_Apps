import {Appearance, Platform, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/ScreenSize';
import { Colors } from '../utils/Theme';


export const ScreenHeader = ({navigation,theme}:{navigation:any,theme:"dark"|"light"}) => (
  <SafeAreaView style={{backgroundColor: Colors[theme].backgroundColor}}>
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={[
        Platform.OS === 'android' && {
          marginTop: heightPercentageToDP(2),
        },
        {paddingLeft: widthPercentageToDP(5)},
      ]}>
      <Text style={{color:Colors[theme].textColor}}>Back</Text>
    </TouchableOpacity>
  </SafeAreaView>
);


