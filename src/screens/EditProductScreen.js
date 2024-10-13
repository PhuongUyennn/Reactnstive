// src/screens/EditProductScreen.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Image, TouchableOpacity, Text } from 'react-native';
import { getDatabase, ref, update } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker'; // Sử dụng expo-image-picker
import { Picker } from '@react-native-picker/picker'; // Import Picker

const EditProductScreen = ({ route, navigation }) => {
  const { product, uid } = route.params; // Nhận uid từ params
  const [name, setName] = useState(product.name);
  const [type, setType] = useState(product.type);
  const [price, setPrice] = useState(product.price.toString()); // Chuyển giá thành chuỗi
  const [imageUri, setImageUri] = useState(product.image); // Thêm trạng thái cho ảnh

  const handleEditProduct = async () => {
    if (!name || !type || !price || !imageUri) {
      Alert.alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
      return;
    }

    const updates = {
      name,
      type,
      price: parseFloat(price), // Chuyển đổi giá thành số
      image: imageUri, // Cập nhật đường dẫn ảnh
    };

    const productRef = ref(getDatabase(), `products/${uid}/${product.key}`); // Sử dụng uid
    try {
      await update(productRef, updates);
      Alert.alert('Sửa sản phẩm thành công');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi sửa sản phẩm', error.message);
    }
  };

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Quyền truy cập thư viện ảnh bị từ chối');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      setImageUri(pickerResult.assets[0].uri); // Lưu URI của ảnh vào trạng thái
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Giá sản phẩm"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
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
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>Chưa chọn hình ảnh</Text>
        )}
      </TouchableOpacity>

      {/* Nút chọn hình ảnh tùy chỉnh */}
      <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
        <Text style={styles.buttonText}>Chọn hình ảnh</Text>
      </TouchableOpacity>

      {/* Nút lưu sản phẩm */}
      <TouchableOpacity style={styles.saveButton} onPress={handleEditProduct}>
        <Text style={styles.buttonText}>Lưu thay đổi</Text>
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
    backgroundColor: '#ff1493', // Màu hồng cho nút lưu
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

export default EditProductScreen;
