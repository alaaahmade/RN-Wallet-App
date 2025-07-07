import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {styles} from '@/assets/styles/auth.styles.js'
import {COLORS} from '@/constants/colors.js'
import {Ionicons} from '@expo/vector-icons' 
import { Image } from 'expo-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const[error, setError] = useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) return

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err) {
       if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message || 'An error occurred')
      } else {
        setError('An unexpected error occurred')
      }
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message || 'An error occurred')
      } else {
        setError('An unexpected error occurred')
      }
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ):(null)}
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => {
            setError('')
            setCode(code)}}
          placeholderTextColor='#9A8478'
          style={[styles.verificationInput, error && styles.errorInput]}
        />
        <TouchableOpacity
          style={styles.button}
        onPress={onVerifyPress}>
          <Text style={styles.buttonText} >Verify</Text>
        </TouchableOpacity>
      </View>
    )
  }
  

  return (
    <KeyboardAwareScrollView style={{ flex: 1}}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={50}
    >
      <View style={styles.container}>
      <Image source={require('../../assets/images/revenue-i2.png')} style={styles.illustration} />
      <Text style={styles.title}>Create Account</Text>
      {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ):(null)}
      <TextInput
        style={[styles.input, error && styles.errorInput]}
        autoCapitalize="none"
        value={emailAddress}
        onChangeText={(email) => {
          setError('')
          setEmailAddress(email)}}
        placeholder="Enter email"
        placeholderTextColor='#9A8478'
        secureTextEntry={false}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => {
          setError('')
          setPassword(password)}}
        style={[styles.input, error && styles.errorInput]}
        placeholderTextColor='#9A8478'

      />
      <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account?</Text>
      <TouchableOpacity onPress={() => router.push('/sign-in')}>
          <Text style={styles.linkText}>Sign in</Text>
      </TouchableOpacity>
      </View>
      </View>
    </KeyboardAwareScrollView>
  )
}