import { View,Text, StyleSheet, Appearance } from "react-native"
import { heightPercentageToDP, widthPercentageToDP } from "../utils/ScreenSize";
import { Colors } from "../utils/Theme";
const colorScheme = Appearance.getColorScheme();

const TimeList = ({text,index}:{text:string,index:number}) => {
    return(
        <View style={styles.viewContainer}>
            <View style={styles.numberContainer}>
                <Text style={styles.textStyles}>{index}</Text>
            </View>
            <Text>
        {text}
            </Text>
        </View>
    )
};

export default TimeList;

const styles = StyleSheet.create({
    viewContainer: {
        flexDirection: "row",
        justifyContent:"space-between",
        height: heightPercentageToDP(8),
        alignItems:"center",
    },
    numberContainer: {
        height: heightPercentageToDP(3.5),
        width: widthPercentageToDP(8),
        borderRadius: heightPercentageToDP(2),
        borderWidth: widthPercentageToDP(0.7),
        borderColor: colorScheme ? Colors[colorScheme].subTextColor : "white",
        justifyContent:"center",
        alignItems:"center",
    },
    textStyles : {
       color:  colorScheme ? Colors[colorScheme].subTextColor : "white",
       fontSize: heightPercentageToDP(2),
       fontWeight: "700",
    }
})