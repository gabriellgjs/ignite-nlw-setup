import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import { generateDateFromYearBeginning } from "../utils/generate-dates-from-year-beginning"
import { HabitDay } from "./HabitDay"
import { WeekDay } from "./WeekDay"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const summaryDates = generateDateFromYearBeginning()
const minimumSummaryDatesSize = 18 * 7
const amountOfDaysFill = minimumSummaryDatesSize - summaryDates.length

type Summary = {
  id:string;
  date: string;
  amount: number;
  completed: number;
}[]


export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([])

  useEffect(() => {
    api.get('summary').then(response => {
      setSummary(response.data)
    })
  }, [])

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, i) => {
          return (
            <div key={(`${weekDay}-${i}`)}>
              <WeekDay                 
                title={weekDay} 
              />
            </div>
          )
        })}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 && summaryDates.map(date =>{
          const dayInSummary = summary.find(day => {
            return dayjs(date).isSame(day.date, 'day')
          })

          return (
             <HabitDay 
              key={date.toString()} 
              date={date}
              amount={dayInSummary?.amount} 
              defaultCompleted={dayInSummary?.completed}
            />
          )
        })} 
        {amountOfDaysFill > 0 && Array.from({ length: amountOfDaysFill }).map((_, i) => {
          return (
            <div 
              key={i} 
              className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed" 
            />
          )
        })}
      </div>
    </div>
  )
}