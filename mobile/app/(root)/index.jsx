import { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useUser } from '@clerk/clerk-expo'
import { Alert, FlatList, RefreshControl, Text, View } from 'react-native'
import { useTransactions } from '../../hooks/useTransactions'
import PageLoader from '../../components/PageLoader'
import {styles} from '../../assets/styles/home.styles'
import HomeHeader from '../../components/HomeHeader'
import { BalanceCard } from '../../components/BalanceCard'
import { TransactionItem } from '../../components/TransactionItem'
import NoTransactionsFound from '../../components/NoTransactionsFound'
import { useCallback } from 'react'

export default function Page() {
  const [refreshing, setRefreshing] = useState(false)
  const { user } = useUser()


  const onRefresh= async () => { 
    setRefreshing(true)
    try {
      await loadData()
    } catch (error) {
      console.error('Error refreshing transactions:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const {
    transactions,
    isLoading,
    summary,
    loadData,
    deleteTransaction
  } = useTransactions(user?.id) 

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteTransaction(id)
          }
          catch (error) {
            console.error('Error deleting transaction:', error)
          }
        }}
      ]

    )
  }


  useEffect(() => {
      loadData()
  }, [user?.id, loadData])

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  )

  if (isLoading && !refreshing) return <PageLoader/>
  

  return (
    <View style={styles.container }>
      <View style={styles.content}>
        <HomeHeader/>

        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>
            Recent Transactions
          </Text>
        </View>
      </View>
      <FlatList 
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (<TransactionItem item={item} onDelete={handleDelete}/>)}
        ListEmptyComponent={() => (<NoTransactionsFound />)}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          
        />}
      />
    </View>
  )
}