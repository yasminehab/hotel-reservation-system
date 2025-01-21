import  React from "react"
import { type DateRange, DayPicker } from "react-day-picker"
import { addDays, format } from "date-fns"
import "react-day-picker/dist/style.css"

interface RoomCalendarProps {
  bookedDates: Date[]
  onRangeSelect: (range: DateRange | undefined) => void
}

const RoomCalendar: React.FC<RoomCalendarProps> = ({ bookedDates, onRangeSelect }) => {
  const disabledDays = bookedDates.map((date) => new Date(date))
  const today = new Date()

  return (
    <DayPicker
      mode="range"
      disabled={disabledDays}
      onSelect={onRangeSelect}
      fromDate={today}
      toDate={addDays(today, 365)}
      className="border rounded-md p-4 bg-white shadow-md"
      classNames={{
        day_disabled: "text-gray-400 line-through",
      }}
      footer={<p className="text-sm text-gray-500 mt-4">Greyed out dates are not available.</p>}
    />
  )
}

export default RoomCalendar

