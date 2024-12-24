import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, Appbar, BottomNavigation } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import for icons
import { Image } from "react-native"; // Import Image component
import axios from "axios"; // Install axios dengan `npm install axios`

const API_URL = "http://192.168.56.1:3000"; // Ganti dengan IP server backend

// Screens
const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}/register`, { username, password });
      alert(response.data.message);
      navigation.navigate("Login");
    } catch (error) {
      alert("Error registering user: " + error.response.data.error);
    }; 
    if (username && password) {
      await AsyncStorage.setItem("user", JSON.stringify({ username, password }));
      alert("Registration successful!");
      navigation.navigate("Login");
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Register
      </Text>
      <TextInput
        label="Username"
        mode="outlined"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        theme={{ colors: { primary: '#6200ee' } }} // Custom theme color
      />
      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        theme={{ colors: { primary: '#6200ee' } }} // Custom theme color
      />
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const user = await AsyncStorage.getItem("user");
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      alert(response.data.message);
      await AsyncStorage.setItem("loggedInUser", response.data.username);
      navigation.navigate("Main");
    } catch (error) {
      alert("Error logging in: " + error.response.data.error);
    };
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.username === username && parsedUser.password === password) {
        await AsyncStorage.setItem("loggedInUser", username);
        navigation.navigate("Main");
      } else {
        alert("Invalid username or password!");
      }
    } else {
      alert("No user found! Please register.");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Login
      </Text>
      <TextInput
        label="Username"
        mode="outlined"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        theme={{ colors: { primary: '#6200ee' } }} // Custom theme color
      />
      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        theme={{ colors: { primary: '#6200ee' } }} // Custom theme color
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
    </View>
  );
};

const HomeScreen = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  
  // Handle adding a new task
  const addTask = () => {
    if (task) {
      setTasks([...tasks, { id: Date.now().toString(), task: task, completed: false }]);
      setTask("");
    } else {
      alert("Please enter a task!");
    }
  };

  // Handle task completion
  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((item) =>
      item.id === taskId ? { ...item, completed: !item.completed } : item
    );
    setTasks(updatedTasks);
  };

  // Handle task deletion
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((item) => item.id !== taskId);
    setTasks(updatedTasks);
  };

  // Render each task
  const renderTask = ({ item }) => (
    <View style={styles.taskContainer}>
      <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)} style={styles.task}>
        <Text style={[styles.taskText, item.completed && styles.completedTask]}>
          {item.task}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
        <MaterialCommunityIcons name="delete" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>To-Do List</Text>
      <TextInput
        label="Add a task"
        mode="outlined"
        value={task}
        onChangeText={setTask}
        style={styles.input}
      />
      <Button mode="contained" onPress={addTask} style={styles.button}>
        Add Task
      </Button>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.taskList}
      />
    </View>
  );
};

const ExploreScreen = () => {
  const content = [
    { id: "1", title: "Discover Nature", description: "Explore the beauty of nature with hiking, camping, and more.", image: "https://via.placeholder.com/300x200?text=Nature" },
    { id: "2", title: "Tech Innovations", description: "Stay updated with the latest in technology and gadgets.", image: "https://via.placeholder.com/300x200?text=Tech" },
    { id: "3", title: "Food Delights", description: "Find new recipes and exciting food trends to try.", image: "https://via.placeholder.com/300x200?text=Food" },
    { id: "4", title: "Travel Destinations", description: "Discover new places to visit around the world.", image: "https://via.placeholder.com/300x200?text=Travel" },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.exploreItemContainer}>
      <Image source={{ uri: item.image }} style={styles.exploreItemImage} />
      <View style={styles.exploreItemContent}>
        <Text variant="headlineMedium" style={styles.exploreItemTitle}>{item.title}</Text>
        <Text variant="bodyMedium" style={styles.exploreItemDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Explore New Horizons</Text>
      <FlatList
        data={content}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.exploreList}
      />
    </View>
  );
};

const ProfileScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await AsyncStorage.getItem("loggedInUser");
      if (user) {
        setUsername(user);
        // Simulasi email yang terkait dengan pengguna
        setEmail(`${user.toLowerCase()}@example.com`);
      } else {
        setUsername("Guest");
        setEmail("guest@example.com");
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("loggedInUser");
    alert("Logged out successfully!");
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Profile</Text>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }} // Gambar avatar placeholder
          style={styles.avatar}
        />
      </View>

      {/* Username and Email */}
      <Text variant="titleLarge" style={styles.username}>{username}</Text>
      <Text variant="bodyMedium" style={styles.email}>{email}</Text>

      {/* Profile Actions */}
      <View style={styles.profileActions}>
        <Button mode="outlined" onPress={() => alert("Edit Profile clicked")} style={styles.button}>
          Edit Profile
        </Button>
        <Button mode="contained" onPress={handleLogout} style={styles.button}>
          Logout
        </Button>
      </View>

      {/* Optional: Task list or recent activity */}
      <Text variant="titleMedium" style={styles.recentActivityTitle}>Recent Activity</Text>
      <FlatList
        data={[
          { id: "1", task: "Completed To-Do List" },
          { id: "2", task: "Updated Profile Picture" },
        ]}
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <Text variant="bodyMedium" style={styles.activityText}>{item.task}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

// Navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#6200ee', // Active tab color
      tabBarInactiveTintColor: '#888', // Inactive tab color
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={24} />
      }}
    />
    <Tab.Screen
      name="Explore"
      component={ExploreScreen}
      options={{
        tabBarIcon: ({ color }) => <MaterialCommunityIcons name="magnify" color={color} size={24} />
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" color={color} size={24} />
      }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5", // Light background color
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 24,
    color: "#6200ee", // Custom color for title
  },
  avatarContainer: {
    marginBottom: 20,
    borderRadius: 50,
    overflow: "hidden",
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: "#6200ee", // Border color for avatar
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#6200ee",
  },
  email: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  profileActions: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    borderRadius: 30,
  },
  recentActivityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#6200ee",
  },
  activityItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  activityText: {
    fontSize: 16,
  },
  exploreList: {
    paddingBottom: 20,
  },
  exploreItemContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  exploreItemImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  exploreItemContent: {
    padding: 15,
  },
  exploreItemTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  exploreItemDescription: {
    fontSize: 16,
    color: "#666",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "white", // White background for input fields
  },
  button: {
    marginTop: 20,
    borderRadius: 30, // Rounded button
  },
  taskList: {
    marginTop: 20,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 5,
  },
  task: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  taskText: {
    fontSize: 16,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  deleteButton: {
    padding: 5,
  },
});

