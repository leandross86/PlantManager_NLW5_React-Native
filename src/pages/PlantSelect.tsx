import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { View, StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native';

import { PlantProps } from '../libs/storage';
import { Header } from '../components/Header';
import { Load } from '../components/Load';
import { EnvironmentButton } from '../components/EnvironmentButton';
import { PlantCardPrimary } from '../components/PlantCardPrimary';

import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnvironmentsProps {
  key: string;
  title: string;
}

export function PlantSelect() {
  const [environments, setEnvironments] = useState<EnvironmentsProps[]>([])
  const [plants, setPlants] = useState<PlantProps[]>()
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>()
  const [environmentsSelected, setEnvironmentSelected] = useState('all')
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  const navigation = useNavigation()

  function handleEnvironmentSelected(environment: string) {
    setEnvironmentSelected(environment)

    if (environment === 'all')
      return setFilteredPlants(plants)

    const filtered = plants?.filter(plant =>
      plant.environments.includes(environment)
    );
    setFilteredPlants(filtered)
  }

  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate('PlantSave', { plant })
  }

  async function fetchPlants() {
    const { data } = await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`)
    if (!data)
      return setLoading(true)

    if (page > 1) {
      setPlants(oldValue => [...oldValue, ...data])
      setFilteredPlants(oldValue => [...oldValue, ...data])
    } else {
      setPlants(data)
      setFilteredPlants(data)
    }
    setLoading(false)
    setLoadingMore(false)
  }

  function handleFetchMore(distance: number) {
    if (distance < 1)
      return;
    setLoadingMore(true)
    setPage(oldValue => oldValue + 1)
    fetchPlants()
  }


  useEffect(() => {
    async function fetchEnvironment() {
      const { data } = await api.get('plants_environments?_sort=title&_order=asc')
      setEnvironments([
        {
          key: 'all',
          title: 'Todos',
        },
        ...data
      ])
    }
    fetchEnvironment();
  }, [])

  useEffect(() => {
    fetchPlants();
  }, [])

  if (loading)
    return <Load />
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>
          Em qual ambiente
        </Text>
        <Text style={styles.subtitle}>
          Você que colocar sua planta?
        </Text>
      </View>

      <View>
        <FlatList
          keyExtractor={item => String(item.key)}
          data={environments}
          contentContainerStyle={styles.environmentList}
          renderItem={({ item }) => (
            <EnvironmentButton
              title={item.title}
              active={item.key === environmentsSelected}
              onPress={() => handleEnvironmentSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          keyExtractor={item => String(item.id)}
          data={filteredPlants}
          renderItem={({ item }) => (
            <PlantCardPrimary
              onPress={() => handlePlantSelect(item)}
              data={item}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
          ListFooterComponent={
            loadingMore
              ? <ActivityIndicator color={colors.green} />
              : <></>
          }
        />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    paddingHorizontal: 30
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading
  },
  environmentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center'
  },

})