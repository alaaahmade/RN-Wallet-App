import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from '@/assets/styles/auth.styles.js'
import { Image } from 'expo-image'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSignInPress = async () => {
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {

        console.error(JSON.stringify(signInAttempt, null, 2))
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

  return (
    <KeyboardAwareScrollView style={{ flex: 1}}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={50}
    >
      <View style={styles.container}>
      <Image source={require('../../assets/images/revenue-i4.png')} style={styles.illustration} />
      <Text style={styles.title}>Welcome back</Text>
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
      <TouchableOpacity onPress={onSignInPress} style={styles.button}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don&apos;t have an account?</Text>
      <TouchableOpacity onPress={() => router.push('/sign-up')}>
          <Text style={styles.linkText}>Sign up</Text>
      </TouchableOpacity>
      </View>
      </View>
    </KeyboardAwareScrollView>
  )
}