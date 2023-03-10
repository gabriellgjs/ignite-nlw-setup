import { useState, useEffect } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs'
import { generateProgressPercentage } from '../utils/generate-progress-percentage'
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { BackButton } from "../components/BackButton";
import { Loading } from "../components/Loading";
import { HabitEmpty } from "../components/HabitEmpty";
import { api } from "../lib/axios";
import clsx from "clsx";

interface HabitParams {
  date: string
}

interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[];
}

export function Habit() {
  const [loanding, setLoanding] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps>();
  const [completed, setCompleted] = useState<string[]>([]);

  const route = useRoute();
  const { date } = route.params as HabitParams;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date())
  const dayOfWeek = parsedDate.format('dddd')
  const dayOfMonth = parsedDate.format('DD/MM')

  const habitsProgress = dayInfo?.possibleHabits.length 
  ? generateProgressPercentage(dayInfo.possibleHabits.length, completed.length) : 0

  async function fetchHabit() {
    try {
      setLoanding(true);

      const response = await api.get('/day', { params: { date }})
      setDayInfo(response.data);
      setCompleted(response.data.completedHabits)

    } catch (error) {
      console.log(error)

      Alert.alert('Ops', 'Não foi possível carregar as informações do dia')

    } finally {
      setLoanding(false)
    }
  }

  async function handleToggleHabit(habitId: string) {
    try{
      await api.patch(`/habits/${habitId}/toggle`)
      if(completed.includes(habitId)){
        setCompleted(prevState => prevState.filter(habit => habit !== habitId))
      } else {
        setCompleted(prevState => [...prevState, habitId])
      }
    } catch  (error) {
      console.log(error)
      Alert.alert('Ops', 'Não foi possível atualizar o status do hábito.')
    }
  }

  useEffect(() => {
    fetchHabit();
  }, [])

  if(loanding){
    return (
      <Loading />
    )
  }

  return (
    <View
      className="flex-1 bg-background px-8 pt-16"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100}}
      >
        <BackButton />
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white font-extrabold text-3xl">
          {dayOfMonth}
        </Text>

        <ProgressBar progress={habitsProgress}/>
        <View className={clsx("mt-6", {
          "opacity-50": isDateInPast
        })}>
          { dayInfo?.possibleHabits ?
            dayInfo?.possibleHabits.map(habit => (
              <Checkbox 
                key= {habit.id}
                title={habit.title}
                checked={completed.includes(habit.id)}
                disabled={isDateInPast}
                onPress={() => handleToggleHabit(habit.id)}
              /> 
            )) 
            : <HabitEmpty />
          }
          
        </View>

          {
            isDateInPast && (
              <Text className="text-white mt-10 text-center">
                Você não pode editar hábitos de uma data passada.
              </Text>)
          }

      </ScrollView>
    </View>
  )
}