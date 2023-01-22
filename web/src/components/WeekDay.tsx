interface WeekDayProps {
  title: string;
}

export function WeekDay(props: WeekDayProps) {
  return (
    <div className="text-zinc-400 text-xl h-10 w-10 flex items-center justify-center font-bold">
      {props.title}
    </div>
  )
}