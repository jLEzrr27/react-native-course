import React, {useState} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, Alert, Platform} from 'react-native';
/*import image from './assets/diamond-red.png';*/
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing'; 
import uploadToAnonymousFilesAsync from 'anonymous-files';

export const App = () => {

  const [selectedImage, setSelectedImage] = useState(null);

  /*Con esta función gestionamos el acceso a la galería por la app*/
  let openImagePickerAsync = async () => {
    
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(permissionResult.granted == false){
      alert('Permiso para acceder a la cámara son obligatorios!'); return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    /*Sí el usuario no elige una imagen */
    if(pickerResult.cancelled == true){
      return;
    }

    if(Platform.OS == 'web'){
      const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({localUri: pickerResult.uri, remoteUri, messageSelectImage: 'Has elegido una imagen!'});
    }else{
      setSelectedImage({localUri: pickerResult.uri, messageSelectImage: 'Has elegido una imagen!'});
    }
  }

  const openShareDialog = async () => {
    if(!await Sharing.isAvailableAsync()){
      alert(`La imagen está disponible en: ${selectedImage.remoteUri}`); return;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  }

  return( 
    <View style={styles.container}>
      <Text style={styles.title}>{selectedImage ? selectedImage.messageSelectImage : "Selecciona una imagen"}</Text>
      
      <TouchableOpacity onPress={openImagePickerAsync}>
        <Image
          source={{uri: selectedImage !== null ? selectedImage.localUri : 'https://picsum.photos/200/200'}}
          style={styles.image}
        />
      </TouchableOpacity>

    {selectedImage ? 
      <TouchableOpacity  onPress={openShareDialog} style={styles.button}>
        <Text style={styles.buttonText}>Compartir!</Text>
      </TouchableOpacity>
      : <View/>
    }
     
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#292929"
  },
  title:{fontSize: 22, color: "#fff"},
  image:{height: 200, width: 200, borderRadius: 100},
  button: {
    backgroundColor: 'deepskyblue',
    padding: 7,
    marginTop: 10
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20
  }
})

export default App;