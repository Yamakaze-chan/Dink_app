import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  SafeAreaView,
  NativeModules,
} from "react-native";
import React, { useEffect, useState } from "react";
import HomeHeadNav from "../components/HomeHeadNav";
import style, { navbtn, navbtnin } from "../globals/style";
import { AntDesign } from "@expo/vector-icons";
import { colors, btn2, titles } from "../globals/style";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "../../Firebase/firebaseConfig";
import { doc, setDoc, updateDoc, getDocs } from "firebase/firestore";
import { ref, getStorage, getDownloadURL } from "firebase/storage";
import AlertAsync from "react-native-alert-async";
import { getAuth, deleteUser } from "firebase/auth";

const Userprofile = ({ navigation }) => {
  const [userloggeduid, setUserloggeduid] = useState(null);
  const [user, setUser] = useState(null);
  const [userdata, setUserdata] = useState(null);
  const [avaimage, setAvaimage] = useState(null);
  let id_of_UserData;
  useEffect(() => {
    const checklogin = () => {
      firebase.auth().onAuthStateChanged((user) => {
        console.log(user);
        if (user) {
          //setUser(user);
          // navigation.navigate('home');
          setUserloggeduid(user.uid);
          //console.log(doc.id, " => ", doc.data());
        } else {
          // No user is signed in.
          console.log("no user");
        }
      });
    };
    checklogin();
  }, []);

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
                setUser(doc.data());
                console.log(doc.data());
                //console.log(doc.data())
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
  const [newname, setNewName] = useState("");
  const [newaddress, setNewAddress] = useState("");

  const updateuser = async () => {
    const docRef = firebase
      .firestore()
      .collection("UserData")
      .where("uid", "==", userloggeduid);
    const doc = await docRef.get();

    if (!doc.empty) {
      if (newname !== "") {
        doc.forEach((doc) => {
          doc.ref.update({
            name: newname,
          });
        });
      }
      if (newaddress !== "") {
        doc.forEach((doc) => {
          doc.ref.update({
            address: newaddress,
          });
        });
      }
      Alert.alert("Th??ng b??o", "Th??ng tin c???a b???n ???? ???????c c???p nh???t");
      getuserdata();
      setEdit(false);
      setPasswordedit(false);
    } else {
      console.log("no user data");
    }
  };

  const [Passwordedit, setPasswordedit] = useState(false);
  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");

  const showAlert = async () => {
    const response = await AlertAsync(
      "Th??ng b??o",
      "B???n c?? mu???n l??u thay ?????i kh??ng?",
      [
        {
          text: "Kh??ng",
          style: "cancel",
        },
        {
          text: "C??",
          onPress: updatepassword,
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const updatepassword = async () => {
    const reauthenticate = (oldpassword) => {
      var user = firebase.auth().currentUser;
      var cred = firebase.auth.EmailAuthProvider.credential(
        user.email,
        oldpassword
      );
      return user.reauthenticateWithCredential(cred);
    };
    let docRef = firebase
      .firestore()
      .collection("UserData")
      .where("uid", "==", userloggeduid);
    let doc = await docRef.get();
    reauthenticate(oldpassword)
      .then(() => {
        var user = firebase.auth().currentUser;
        user
          .updatePassword(newpassword)
          .then(() => {
            // alert("Password updated!");

            if (!doc.empty) {
              doc.forEach((doc) => {
                doc.ref.update({
                  password: newpassword,
                });
              });
              Alert.alert("Th??ng b??o", "M???t kh???u c???a b???n ???? ???????c c???p nh???t");
            }
          })
          .catch((error) => {
            alert("L???i h??? th???ng");
          });
      })
      .catch((error) => {
        Alert.alert("Sai m???t kh???u", "Vui l??ng nh???p ????ng m???t kh???u c???a b???n");
      });
  };
  const logoutuser = () => {
    navigation.navigate('logout')
    NativeModules.DevSettings.reload();
    /** 
    if(userdata.email===null)
    {
      
    }
    else
    {
      
      console.log("/////////////////")
      console.log(userdata);
      firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        Alert.alert("Th??ng b??o", "B???n ???? ????ng xu???t");
        navigation.navigate("login");
        console.log("2")
      })
      .catch((error) => {
        // An error happened.
        alert("L???i server");
      });
      
    }
    */
  };

  const changeavatar = () => {
    navigation.navigate("updateavatar");
  };

  return (
    <View style={styles.containerout}>
      <TouchableOpacity onPress={() => navigation.navigate("home")}>
        <View style={navbtn}>
          <AntDesign name="back" size={24} color="black" style={navbtnin} />
        </View>
      </TouchableOpacity>

      {edit == false && Passwordedit == false && (
        <View style={styles.container}>
          <Text style={styles.head1}>Th??ng tin c?? nh??n</Text>
          <View>
            {userdata && userdata.userImgUrl != "" ? (
              <TouchableOpacity onPress={changeavatar}>
                <Image
                  source={{ uri: userdata.userImgUrl }}
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
            ) : (
              <TouchableOpacity onPress={changeavatar}>
                <Image
                  source={require("../../assets/487498cf-8055-4faa-b835-710d05601f53.png")}
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
            )}
          </View>
          <View style={styles.containerin}>
            <Text style={styles.head2}>
              T??n kh??ch h??ng:{" "}
              {userdata ? (
                <Text style={styles.head2in}>{userdata.name}</Text>
              ) : (
                "loading"
              )}
            </Text>

            <Text style={styles.head2}>
              Email:{" "}
              {userdata ? (
                <Text style={styles.head2in}>{userdata.email}</Text>
              ) : (
                "loading"
              )}
            </Text>

            <Text style={styles.head2}>
              S??T:{" "}
              {userdata ? (
                <Text style={styles.head2in}>{userdata.phone}</Text>
              ) : (
                "loading"
              )}
            </Text>

            <Text style={styles.head2}>
              S??? b??n:{" "}
              {userdata ? (
                <Text style={styles.head2in}>{userdata.address}</Text>
              ) : (
                "loading"
              )}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setEdit(!edit);
              setPasswordedit(false);
            }}
          >
            <View style={btn2}>
              <Text style={styles.btntxt}>S???a th??ng tin</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setPasswordedit(!Passwordedit);
              setEdit(false);
            }}
          >
            <View style={btn2}>
              <Text style={styles.btntxt}>?????i m???t kh???u</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {edit == true && (
        <View style={styles.container}>
          <Text style={styles.head1}>Ch???nh s???a th??ng tin</Text>
          <View style={styles.containerin}>
            <TextInput
              style={styles.input}
              placeholder="H??? v?? t??n"
              defaultValue={userdata.name}
              onChangeText={(e) => setNewName(e)}
            />
            <TextInput
              style={styles.input}
              placeholder="S??? b??n hi???n ??ang ng???i"
              onChangeText={(e) => setNewAddress(e)}
            />
          </View>
          <TouchableOpacity onPress={() => updateuser()}>
            <View style={btn2}>
              <Text style={styles.btntxt}>X??c nh???n</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {Passwordedit == true && (
        <View style={styles.container}>
          <Text style={styles.head1}>?????i m???t kh???u</Text>
          <View style={styles.containerin}>
            <TextInput
              style={styles.input}
              placeholder="M???t kh???u c??"
              onChangeText={(e) => setOldPassword(e)}
            />
            <TextInput
              style={styles.input}
              placeholder="M???t kh???u m???i"
              onChangeText={(e) => setNewPassword(e)}
            />
          </View>
          <TouchableOpacity onPress={() => showAlert()}>
            <View style={btn2}>
              <Text style={styles.btntxt}>?????i m???t kh???u</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {Passwordedit == false && edit == false && (
        <TouchableOpacity onPress={logoutuser}>
          <View style={btn2}>
            <Text style={styles.btntxt}>????ng xu???t</Text>
          </View>
        </TouchableOpacity>
      )}
      {/*
              <TouchableOpacity onPress={() => logoutuser()}>
                  <View style={btn2}>
                      <Text style={styles.btntxt}>Logout</Text>
                  </View>
              </TouchableOpacity>
          */}
    </View>
  );
};

export default Userprofile;

const styles = StyleSheet.create({
  containerout: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: 'center',
    width: "100%",
  },
  head1: {
    fontSize: 40,
    fontWeight: "200",
    marginVertical: 20,
    color: colors.text1,
  },
  containerin: {
    marginBottom: 20,
    width: "90%",
    alignItems: "stretch",
    borderWidth: 1,
    borderColor: colors.text1,
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  head2: {
    fontSize: 20,
    fontWeight: "200",
    marginTop: 20,
  },
  head2in: {
    fontSize: 20,
    fontWeight: "300",
  },
  inputout: {
    flexDirection: "row",
    width: "100%",
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
    fontWeight: "400",
    color: "white",
    textAlign: "center",
    padding: 10,
  },
  input: {
    width: "100%",
    marginVertical: 10,
    backgroundColor: "#FFDFD3",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 20,
  },
});
