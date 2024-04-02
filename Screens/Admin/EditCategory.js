import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import baseURL from '../../assets/common/baseurl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [token, setToken] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;

  useEffect(() => {
    AsyncStorage.getItem('jwt')
      .then(res => {
        setToken(res);
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    // Set initial category name when component mounts
    setCategoryName(category.name);
  }, []);

  const updateCategory = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const formData = new FormData();
    formData.append('name', categoryName);

    if (categoryImage) {
      formData.append('image', {
        uri: categoryImage.uri,
        type: 'image/jpeg',
        name: `category_${Date.now()}.jpg`,
      });
    }

    try {
      const response = await axios.put(`${baseURL}categories/${category._id}`, formData, config);
      console.log(response.data);
      // Navigate back to the previous screen after successful update
      navigation.goBack();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setCategoryImage(selectedImage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Category</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Category Name"
          value={categoryName}
          onChangeText={text => setCategoryName(text)}
        />
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {categoryImage ? (
            <Image source={{ uri: categoryImage.uri }} style={{ width: 200, height: 200 }} />
          ) : (
            <Text>Select Image</Text>
          )}
        </TouchableOpacity>
      </View>
      <EasyButton primary large onPress={updateCategory}>
        <Text style={styles.buttonText}>Update Category</Text>
      </EasyButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
  },
});

export default EditCategory;
