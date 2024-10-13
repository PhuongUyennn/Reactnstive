// src/components/AddProductScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDatabase, ref, push, set } from 'firebase/database';
import { auth } from '../firebaseConfig';
import { Picker } from '@react-native-picker/picker'; // Import Picker

const AddProductScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Quyền truy cập thư viện ảnh bị từ chối');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const handleAddProduct = async () => {
    if (!name || !type || !price || !image) {
      Alert.alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
      return;
    }

    const uid = auth.currentUser.uid;
    const productRef = ref(getDatabase(), `products/${uid}`);
    const newProductRef = push(productRef);

    try {
      await set(newProductRef, {
        name,
        type,
        price: parseFloat(price), // Đảm bảo giá là số
        image,
      });
      Alert.alert('Thêm sản phẩm thành công!');
      // Reset form fields
      setName('');
      setType('');
      setPrice('');
      setImage(null);
      navigation.navigate('Home'); // Điều hướng trở lại màn hình chính
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên sản phẩm:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      
      <Text style={styles.label}>Giá:</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Viền cho Picker */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={type}
          style={styles.picker}
          onValueChange={(itemValue) => setType(itemValue)}
        >
          <Picker.Item label="Chọn loại sản phẩm" value="" />
          <Picker.Item label="Đồ chơi trẻ em" value="Đồ chơi trẻ em" />
          <Picker.Item label="Thức ăn nhanh" value="Thức ăn nhanh" />
          <Picker.Item label="Hoa" value="Hoa" />
          <Picker.Item label="Quần áo" value="Quần áo" />
          <Picker.Item label="Điện thoại" value="Điện thoại" />
          <Picker.Item label="Đồ gia dụng" value="Đồ gia dụng" />
        </Picker>
      </View>

      {/* Ô vuông trống thể hiện cần hình ảnh */}
      <TouchableOpacity style={styles.imagePlaceholder} onPress={handleSelectImage}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
        ) : (
          <Text style={styles.placeholderText}>Chưa chọn hình ảnh</Text>
        )}
      </TouchableOpacity>
      
      {/* Nút chọn hình ảnh tùy chỉnh */}
      <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
        <Text style={styles.buttonText}>Chọn hình ảnh</Text>
      </TouchableOpacity>

      {/* Nút thêm sản phẩm */}
      <TouchableOpacity style={styles.saveButton} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Thêm sản phẩm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#ff1493', // Màu hồng
  },
  input: {
    borderWidth: 1,
    borderColor: '#ff1493', // Màu viền hồng
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ff1493', // Màu viền hồng
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden', // Để loại bỏ viền thừa
  },
  picker: {
    height: 50,
    width: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#ff1493', // Màu viền hồng cho ô vuông
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 16,
  },
  imageButton: {
    backgroundColor: '#ff1493', // Màu hồng cho nút
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#ff1493', // Màu hồng cho nút thêm
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // Màu chữ trắng
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default AddProductScreen;
