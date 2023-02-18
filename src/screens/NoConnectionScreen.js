import react from "react";
import {View, Text, StyleSheet, Image, Button} from 'react-native';
import { colors } from "../globals/style";

const NoConnection = () => {
    console.log("a");
    return(
        
                <View style={styles.container}>
                    <View style = {styles.img}>
                        <Image
                            style = {styles.tinyimg}
                            resizeMode = "contain"
                            source = {require('../../assets/Capture.png')}
                        />
                        <Text style = {styles.txt}>
                            Please check your Internet connection
                        </Text>
                    </View>
                    <Button title="Reload"/>
                </View>
    )
}



const styles = StyleSheet.create({
    container:
    {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: "#ffffff"

    },
    img:
    {
    },
    tinyimg: {
        width: '100%',
        height: '50%',
      },
    txt:
    {
        color: colors.text1,
        fontSize: 24,
        alignItems: 'center',
        alignSelf:'center',
        textAlign:'center'
    }
})

export default NoConnection;