import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import baseURL from '../../assets/common/baseurl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const Categories = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [token, setToken] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem('jwt')
      .then(res => {
        setToken(res);
      })
      .catch(error => console.log(error));
  }, []);

  const addCategory = async () => {
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
      const response = await axios.post(`${baseURL}categories`, formData, config);
      console.log(response.data);
      setCategoryName('');
      setCategoryImage(null);
    } catch (error) {
      console.error('Error adding category:', error);
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

  const navigateToCharts = () => {
    navigation.navigate('Charts');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Category</Text>
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
      <EasyButton primary large onPress={addCategory} style={styles.button}>
        <Text style={styles.buttonText}>Add Category</Text>
      </EasyButton>
      <EasyButton
        secondary
        medium
        onPress={() => navigation.navigate('CategoriesList')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>See Categories</Text>
      </EasyButton>
      <EasyButton
        secondary
        medium
        onPress={navigateToCharts}
        style={styles.button}
      >
        <Text style={styles.buttonText}>See Charts</Text>
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
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  imagePicker: {
    width: '80%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Categories;
