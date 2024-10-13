// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue, remove } from 'firebase/database';

const HomeScreen = ({ navigation, route }) => {
  const { uid, email } = route.params;
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const productsRef = ref(getDatabase(), `products/${uid}`,);
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const productList = data ? Object.entries(data).map(([key, value]) => ({ key, ...value })) : [];
      setProducts(productList);
      setFilteredProducts(productList);
    });

    return () => unsubscribe();
  }, [uid]);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleDeleteProduct = (productKey) => {
    const productRef = ref(getDatabase(), `products/${uid}/${productKey}`);
    remove(productRef)
      .then(() => Alert.alert('Xóa sản phẩm thành công'))
      .catch((error) => Alert.alert('Lỗi xóa sản phẩm', error.message));
  };

  const handleLogout = () => {
    if (route.params.onLogout) {
      route.params.onLogout();
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtonContainer}>
          <Button title="Đăng xuất" onPress={handleLogout} color="red" />
        </View>
      ),
    });
  }, [navigation]);

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const type = product.type || 'Khác';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(product);
    return acc;
  }, {});

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setShowCategories(false);
  };

  const displayedProducts = selectedCategory === 'Tất cả'
    ? filteredProducts
    : groupedProducts[selectedCategory] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Dữ liệu sản phẩm của bạn</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm sản phẩm theo tên"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Text style={styles.productListTitle}>Danh sách sản phẩm</Text>

      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[styles.categoryButton, selectedCategory === 'Tất cả' && styles.selectedCategory]}
          onPress={() => {
            setSelectedCategory('Tất cả');
            setShowCategories(false);
          }} 
        >
          <Text style={styles.categoryButtonText}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setShowCategories(!showCategories)}
        >
          <Text style={styles.categoryButtonText}>Chọn loại</Text>
        </TouchableOpacity>
        {showCategories && (
          <View style={styles.categoryDropdown}>
            {Object.keys(groupedProducts).map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.categoryButton, selectedCategory === type && styles.selectedCategory]}
                onPress={() => handleCategoryPress(type)}
              >
                <Text style={styles.categoryButtonText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Text style={styles.selectedCategoryText}>Hiện tại đang xem: {selectedCategory}</Text>

      {displayedProducts.length > 0 ? (
        <FlatList
          data={displayedProducts}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              <View style={styles.productRow}>
                {item.image && (
                  <Image source={{ uri: item.image }} style={styles.productImageSmall} />
                )}
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>Tên: {item.name}</Text>
                  <Text style={styles.productPrice}>Giá: {item.price}</Text>
                </View>
              </View>
              <View style={styles.buttonGroup}>
                <Button
                  title="Sửa sản phẩm"
                  onPress={() => navigation.navigate('EditProduct', { product: item, uid })}
                  color="#FF69B4"
                />
                <Button
                  title="Xóa sản phẩm"
                  onPress={() => handleDeleteProduct(item.key)}
                  color="red"
                />
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noProductsText}>Chưa có sản phẩm nào!</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Thêm sản phẩm"
          onPress={() => navigation.navigate('AddProduct', { uid })}
          color="#FF69B4"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF69B4',
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#FF69B4',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  productListTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  categoryContainer: {
    marginVertical: 10,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF69B4',
    borderRadius: 5,
    marginBottom: 5,
  },
  categoryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedCategory: {
    backgroundColor: '#ff1493',
  },
  categoryDropdown: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedCategoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  productContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImageSmall: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  headerButtonContainer: {
    marginRight: 10,
  },
  noProductsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
});

export default HomeScreen;
