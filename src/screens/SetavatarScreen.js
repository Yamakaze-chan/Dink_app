import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import style, { navbtn, navbtnin } from '../globals/style'
import { AntDesign } from '@expo/vector-icons';
import { colors, btn2, titles } from '../globals/style';
import * as ImagePicker from 'expo-image-picker';
import { firebase, db } from '../../Firebase/firebaseConfig';
import { doc, setDoc, updateDoc, getDocs } from "firebase/firestore"; 
import { ref,getStorage, getDownloadURL  } from "firebase/storage";

const SetAvatarScreen = ({ navigation }) => {
    const storage = getStorage();
    const [avaimage, setAvaimage] = useState(null);
    const [upload, setUpload] = useState(false);

    const [userloggeduid, setUserloggeduid] = useState(null);
    const [userdata, setUserdata] = useState(null);

    useEffect(() => {
        const checklogin = () => {
            firebase.auth().onAuthStateChanged((user) => {
                // console.log(user);
                if (user) {
                    // navigation.navigate('home');
                    console.log(user);
                    setUserloggeduid(user.uid);
                } else {
                    // No user is signed in.
                    console.log('no user');
                }
            });
        }
        checklogin();
    }, [])

    // console.log(userloggeduid);

    const getuserdata = async () => {
        const docRef = firebase.firestore().collection('UserData').where('uid', '==', userloggeduid)
        const doc = await docRef.get();
        //console.log(doc);
        if (!doc.empty) {
            doc.forEach((doc) => {
                setUserdata(doc.data());
            })
        }
        else {
            console.log('no user data');
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,4],
            quality: 1,
        })
        const source = {uri: result.uri};
        console.log(source);
        setAvaimage(source);
    }

    const uploadImage = async () => {
        setUpload(true);
        const response = await fetch(avaimage.uri)
        const blob_response = await response.blob();
        const filename = avaimage.uri.substring(avaimage.uri.lastIndexOf('/') + 1)
        console.log(filename)
        var imgref = firebase.storage().ref().child("UserImages/"+filename).put(blob_response);
        try{
            await imgref;
        }
        catch (e)
        {
            console.log(e);
        }
        setUpload(false);
        //Insert update ava later
        let id_of_UserData;
        setAvaimage(null);
        //const url = await ref.getDownloadURL().catch((error) => { throw error });
        //getDownloadURL(ref(storage, `UserImages/${filename}`)).then((url)=>{firebase.firestore().ref().child(`/users/${userloggeduid}`).update({userImgUrl: url});});
        //const docRef = firebase.firestore().collection('UserData').where('uid', '==', userloggeduid)
        //docRef.update({userImgUrl: url});
        const querySnapshot = await getDocs(firebase.firestore().collection('UserData').where("uid", "==", userloggeduid));
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            id_of_UserData = doc.id;
            //console.log(doc.id, " => ", doc.data());
          });

        getDownloadURL(ref(storage, `UserImages/${filename}`)).then((url)=>{
            //console.log("URL:  ", url);
        updateDoc(doc(db,`UserData/${id_of_UserData}`),{userImgUrl: url})
        //console.log("Data added successfully ", updateimgref.id);
        })
    }

    const back = () => {
        navigation.goBack();
    }

    return(
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={pickImage}>
                <Text>Pick an image</Text>
            </TouchableOpacity>
            {avaimage&&<Image
                source={{uri : avaimage.uri}}
                style = {{height:300, width: 300}}
            />}
            <TouchableOpacity onPress={uploadImage}>
                <Text>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={back}>
                <Text>Back</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SetAvatarScreen;