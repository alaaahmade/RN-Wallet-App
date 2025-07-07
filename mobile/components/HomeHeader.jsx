import { View, Text, Image, TouchableOpacity } from 'react-native'
import {styles} from '@/assets/styles/home.styles'
import {Ionicons} from '@expo/vector-icons'
import { SignOutButton } from '@/components/SignOutButton'
import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

const HomeHeader = () => {
  const { user } = useUser()
  const router = useRouter()
  
  return (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={require('../assets/images/logo.png')} style={styles.headerLogo} />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>welcome,</Text>
              <Text style={styles.usernameText}>{user?.emailAddresses[0]?.emailAddress.split( '@' )[0]}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => {router.push('/create')}}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>
  )
}

export default HomeHeader