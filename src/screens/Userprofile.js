import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import HomeHeadNav from '../components/HomeHeadNav'
import style, { navbtn, navbtnin } from '../globals/style'
import { AntDesign } from '@expo/vector-icons';
import { colors, btn2, titles } from '../globals/style';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../../Firebase/firebaseConfig';
import { doc, setDoc, updateDoc, getDocs } from "firebase/firestore"; 
import { ref,getStorage, getDownloadURL  } from "firebase/storage";


const Userprofile = ({ navigation }) => {
    const [userloggeduid, setUserloggeduid] = useState(null);
    const [userdata, setUserdata] = useState(null);
    const [avaimage,setAvaimage] = useState(null)
    let id_of_UserData;
    useEffect(() => {
        const checklogin = () => {
            firebase.auth().onAuthStateChanged((user) => {
                // console.log(user);
                if (user) {
                    // navigation.navigate('home');
                    setUserloggeduid(user.uid);
                        //console.log(doc.id, " => ", doc.data());
                    
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
        console.log(userloggeduid);
        if(userloggeduid == "y5F8yXDGhjdJDf1PIDbAHesyYqs2")
        {
                Alert.alert("","You have to log in to use this feature",[
                    {
                        text:'Login now',
                        onPress: () => navigation.navigate('login')
                    },
                    {
                        text: 'Maybe later',
                        onPress: () => navigation.goBack(),
                    }
                ])
        }
        else
        {
            const docRef = firebase.firestore().collection('UserData').where('uid', '==', userloggeduid)
            const doc = await docRef.get();
            //console.log(doc);
            if (!doc.empty) {
                doc.forEach((doc) => {
                    setUserdata(doc.data());
                    console.log(doc.data())
                })
            }
            else {
                console.log('no user data');
            }
        }
    }

    useEffect(() => {

        getuserdata();
    }, [userloggeduid]);

    // console.log(userdata);


    const [edit, setEdit] = useState(false);
    const [newname, setNewName] = useState('');
    const [newphone, setPhoneedit] = useState('');


    const updateuser = async () => {
        if(newphone.length  != 10 && newphone.length != 0)
                {
                    Alert.alert('', 'Số điện thoại phải gồm 10 ký tự')
                }
        else
        {
            const docRef = firebase.firestore().collection('UserData').where('uid', '==', userloggeduid)
            const doc = await docRef.get();
            if (!doc.empty) {
                if (newname.length != 0) {
                    doc.forEach((doc) => {
                        doc.ref.update({
                            name: newname
                        })
                    })
                }
                if (newphone.length != 0) {
                    
                        doc.forEach((doc) => {
                            doc.ref.update({
                                phone: newphone
                            })
                        })
                    }
                alert('Thông tin của bạn đã được cập nhật');
                getuserdata();
                setEdit(false);
                setPhoneedit('');
            }
            else {
                console.log('no user data');
            }
        }
    }


    const [Passwordedit, setPasswordedit] = useState(false);
    const [oldpassword, setOldPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');


    const updatepassword = async () => {
        const reauthenticate = (oldpassword) => {
            var user = firebase.auth().currentUser;
            var cred = firebase.auth.EmailAuthProvider.credential(
                user.email, oldpassword);
            return user.reauthenticateWithCredential(cred);
        }
        let docRef = firebase.firestore().collection('UserData').where('uid', '==', userloggeduid)
        let doc = await docRef.get();
        reauthenticate(oldpassword).then(() => {
            var user = firebase.auth().currentUser;
            user.updatePassword(newpassword).then(() => {
                // alert("Password updated!");

                if (!doc.empty) {
                    doc.forEach((doc) => {
                        doc.ref.update({
                            password: newpassword
                        })
                    })
                    alert('Đã cập nhật mật khẩu');
                }
            }).catch((error) => { alert('Đã xảy ra lỗi'); });
        }).catch((error) => { 
            Alert.alert('Sai mật khẩu','Mật khẩu của bạn đã sai hoặc để trống',[{text: 'OK',},]);
         });
    }


    const logoutuser = () => {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            Alert.alert('','Bạn đã đăng xuất');
            navigation.navigate('login');
        }).catch((error) => {
            // An error happened.
            alert('Đã xảy ra lỗi');
        });
    }

    const changeavatar = () => {
        navigation.navigate('updateavatar');
    }

    
    

    return (
        <View style={styles.containerout}>
            <TouchableOpacity onPress={() => navigation.navigate('home')}>
                <View style={navbtn}>
                    <AntDesign name="back" size={24} color="black" style={navbtnin} />
                </View>
            </TouchableOpacity>
            
            {edit == false && Passwordedit == false && <View style={styles.container}>
                <Text style={styles.head1}>Thông tin của bạn</Text>
                <View>
                {userdata && userdata.userImgUrl!="" ?
                <TouchableOpacity onPress={changeavatar}>
                <Image
                    source={{uri: userdata.userImgUrl}}
                    style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 100,
                        width: 100,
                        borderRadius: 180,
                        }}
                    />
                </TouchableOpacity>
                    :
                <TouchableOpacity onPress={changeavatar}>
                <Image source={require("../../assets/487498cf-8055-4faa-b835-710d05601f53.png")}
                    style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 100,
                    width: 100,
                    borderRadius: 180,
                    }}
                    />
                </TouchableOpacity>}
                </View>
                <View style={styles.containerin}>
                    <Text style={styles.head2}>Tên: {userdata ? <Text style={styles.head2in}>
                        {userdata.name}
                    </Text> : 'loading'}</Text>

                    <Text style={styles.head2}>Email: {userdata ? <Text style={styles.head2in}>
                        {userdata.email}
                    </Text> : 'loading'}</Text>

                    <Text style={styles.head2}>Số điện thoại: {userdata ? <Text style={styles.head2in}>
                        {userdata.phone}
                    </Text> : 'loading'}</Text>
                    {/** 
                    <Text style={styles.head2}>Address: {userdata ? <Text style={styles.head2in}>
                        {userdata.address}
                    </Text> : 'loading'}</Text>
                    */}
                </View>
                <TouchableOpacity onPress={() => {
                    setEdit(!edit)
                    setPhoneedit('')
                }}>
                    <View style={btn2}>
                        <Text style={styles.btntxt}>Chỉnh sửa</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    setPasswordedit(!Passwordedit)
                    setEdit(false)
                }
                }>
                    <View style={btn2}>
                        <Text style={styles.btntxt}>Đổi mật khẩu</Text>
                    </View>
                </TouchableOpacity>
            </View>
            }
            {edit == true &&
                <View style={styles.container}>
                    <Text style={styles.head1}>Chỉnh sửa thông tin cá nhân</Text>
                    <View style={styles.containerin}>
                        <TextInput style={styles.input} placeholder='Tên' onChangeText={(e) => setNewName(e)} />
                        
                        <TextInput style={styles.input} placeholder='Số điện thoại' onChangeText={(e) => setPhoneedit(e)} />
                        
                    </View>
                    <TouchableOpacity onPress={() => updateuser()}>
                        <View style={btn2}>
                            <Text style={styles.btntxt}>Xác nhận</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            }

            {Passwordedit == true &&
                <View style={styles.container}>
                    <Text style={styles.head1}>Đổi mật khẩu</Text>
                    <View style={styles.containerin}>
                        <TextInput style={styles.input} placeholder='Mật khẩu cũ' onChangeText={(e) => setOldPassword(e)} />
                        <TextInput style={styles.input} placeholder='Mật khẩu mới' onChangeText={(e) => setNewPassword(e)} />
                    </View>
                    <TouchableOpacity onPress={() => updatepassword()}>
                        <View style={btn2}>
                            <Text style={styles.btntxt}>Xác nhận</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            }
            {Passwordedit == false && edit == false &&
            <TouchableOpacity onPress={logoutuser}>
                    <View style={btn2}>
                        <Text style={styles.btntxt}>Đăng xuất</Text>
                    </View>
                </TouchableOpacity>
            }
            {/*
            <TouchableOpacity onPress={() => logoutuser()}>
                <View style={btn2}>
                    <Text style={styles.btntxt}>Logout</Text>
                </View>
            </TouchableOpacity>
        */}

        </View>
    )
}

export default Userprofile

const styles = StyleSheet.create({
    containerout: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        width: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'center',
        width: '100%',
    },
    head1: {
        fontSize: 40,
        fontWeight: '200',
        marginVertical: 20,
        color: colors.text1,
        textAlign: 'center',
    },
    containerin: {
        width: '90%',
        alignItems: 'stretch',
        borderWidth: 1,
        borderColor: colors.text1,
        borderRadius: 10,
        padding: 20,
        marginTop: 20,
    },
    head2: {
        fontSize: 20,
        fontWeight: '200',
        marginTop: 20,

    },
    head2in: {
        fontSize: 20,
        fontWeight: '300',
    },
    inputout: {
        flexDirection: 'row',
        width: '100%',
        marginVertical: 10,
        backgroundColor: colors.col1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        // alignSelf: 'center',
        elevation: 20,
    },
    btntxt: {
        fontSize: 20,
        fontWeight: '400',
        color: 'white',
        textAlign: 'center',
        padding: 10
    },
    input: {
        width: '100%',
        marginVertical: 10,
        backgroundColor: colors.col1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        elevation: 20,
    }
})