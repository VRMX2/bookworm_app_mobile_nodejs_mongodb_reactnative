import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView} from 'react-native';
import React, { useState } from 'react';
import {Link} from 'expo-router';
import styles from "../../assets/styles/login.styles";
import COLORS from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";


export default function LoginScreen(){
	const [email, setEmail ] = useState("");
	const [password, setPassword ] = useState("");
	const [showPassword, setShowPassword ] = useState(false);
	const [isLoading, setIsLoading ] = useState(false);

	const handleLogin = () => {
		fetch("http://localhost:7500/api/auth/login",{})
	}
	return(
	<KeyboardAvoidingView
style={{ flex: 1 }}
		contentContainerStyle = {{ flexGrow: 1 }}
      enableOnAndroid={true} 
      enableAutomaticScroll={true}
		extraHeight = {90}
	>
	<View style = {styles.container}>
	<View style = {styles.topIllustration}>
		<Image
	source = {require("../../assets/images/i.png")}
	style = {styles.illustrationImage}
    resizeMode="contain"
		/>
	</View>
	<View style = {styles.card}>
	<View style = {styles.formContainer}>
	<View style = {styles.inputGroup}>
		<Text style = {styles.label}>Email</Text>
		<View style = {styles.inputContainer}>
		<Ionicons
		name = "mail-outline"
	size = {20}
	color = {COLORS.primary}
    style={styles.inputIcon}
		/>
		<TextInput
	style = {styles.input}
	placeholder = 'Enter your email'
	placeholderTextColor = {COLORS.placeholderText}
	value = {email}
	onChangeText = {setEmail}
	keyboardType = 'email-address'
    autoCapitalize='none'
		/>
		</View>
      
    </View>
    <View style = {styles.inputGroup}>
		<Text style = {styles.label}>Password</Text>
		<View style = {styles.inputContainer}>
		<Ionicons
		name = "lock-closed-outline"
	size = {20}
	color = {COLORS.primary}
    style={styles.inputIcon}
		/>
		<TextInput
	style = {styles.input}
	placeholder = 'Enter your password'
	placeholderTextColor = {COLORS.placeholderText}
	value = {password}
	onChangeText = {setPassword}
	secureTextEntry={!showPassword}
		/>
	<TouchableOpacity onPress = {() => setShowPassword(!showPassword)} style = {styles.eyeIcon}>
		<Ionicons
	name = {showPassword ? "eye-outline" : "eye-off-outline"}
	size = {20}
    color={COLORS.primary}
		/>
    </TouchableOpacity>
		</View>
      
	</View>
	<TouchableOpacity style = {styles.button} onPress = {handleLogin} disabled={isLoading}>
		{isLoading ? (
        <ActivityIndicator color="#fff" />
		): (
        <Text style={styles.buttonText}>Login</Text>
      )}
	</TouchableOpacity>
	<View style = {styles.footer}>
		<Text style = {styles.footerText}>Don&apos; t have an account? </Text>
		<Link href = "/signup" asChild>
		<TouchableOpacity>
        <Text style={styles.link}>Sign Up</Text>
      </TouchableOpacity>
      </Link>
    </View>
	</View>
  </View>

	</View>
	</KeyboardAvoidingView>
	);
}