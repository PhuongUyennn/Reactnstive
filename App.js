import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './src/firebaseConfig';
import HomeScreen from './src/screens/HomeScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import EditProductScreen from './src/screens/EditProductScreen'; // Import màn hình EditProduct
import SignIn from './src/components/SignIn';
import SignUp from './src/components/SignUp';

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);

  // Theo dõi sự thay đổi của user từ Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((loggedInUser) => {
      setUser(loggedInUser);
    });
    return () => unsubscribe(); // Dọn dẹp
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Đăng xuất thành công!');
    } catch (error) {
      Alert.alert('Lỗi đăng xuất', error.message);
    }
  };

  const handleSignIn = useCallback((loggedInUser) => {
    setUser(loggedInUser);
  }, []);

  const handleSignUp = useCallback((loggedInUser) => {
    setUser(loggedInUser);
    setShowSignUp(false);
  }, []);

  const renderScreens = () => {
    if (user) {
      return (
        <>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            initialParams={{ uid: user.uid, email: user.email, onLogout: handleLogout }} // Truyền uid, email và onLogout
          />
          <Stack.Screen name="AddProduct" component={AddProductScreen} />
          <Stack.Screen name="EditProduct" component={EditProductScreen} />
        </>
      );
    } 
    return showSignUp ? (
      <Stack.Screen name="SignUp">
        {props => <SignUp {...props} onSignUp={handleSignUp} />}
      </Stack.Screen>
    ) : (
      <Stack.Screen name="SignIn">
        {props => <SignIn {...props} onSignIn={handleSignIn} />}
      </Stack.Screen>
    );
  };

  const toggleSignUp = () => {
    setShowSignUp(prevShowSignUp => !prevShowSignUp);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {renderScreens()}
      </Stack.Navigator>
      {!user && (
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#FF69B4', 
              borderRadius: 8,
              padding: 15,
              alignItems: 'center',
            }}
            onPress={toggleSignUp}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>
              {showSignUp ? 'Quay lại đăng nhập' : 'Chuyển đến tạo tài khoản'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </NavigationContainer>
  );
};

export default App;
