"use client"

import { useState } from "react"

interface CalendarPickerProps {
  onSelectDate: (date: Date) => void
  selectedDate?: Date | null
  minDate?: Date
}

export default function CalendarPicker({ onSelectDate, selectedDate, minDate }: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState("12:00")

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const minimumDate = minDate || today

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    date.setHours(0, 0, 0, 0)
    return date < minimumDate
  }

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    )
  }

  const isToday = (day: number) => {
    const now = new Date()
    return (
      now.getDate() === day &&
      now.getMonth() === currentMonth.getMonth() &&
      now.getFullYear() === currentMonth.getFullYear()
    )
  }

  const handleDayClick = (day: number) => {
    if (isDateDisabled(day)) return
    
    const [hours, minutes] = selectedTime.split(":").map(Number)
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, hours, minutes)
    onSelectDate(newDate)
  }

  const handleTimeChange = (time: string) => {
    setSelectedTime(time)
    if (selectedDate) {
      const [hours, minutes] = time.split(":").map(Number)
      const newDate = new Date(selectedDate)
      newDate.setHours(hours, minutes)
      onSelectDate(newDate)
    }
  }

  const isPrevMonthDisabled = () => {
    const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0)
    return prevMonthLastDay < minimumDate
  }

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
  ]

  const renderDays = () => {
    const days = []
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />)
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day)
      const selected = isDateSelected(day)
      const todayClass = isToday(day)
      
      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          disabled={disabled}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
            ${disabled 
              ? "text-text-muted/30 cursor-not-allowed" 
              : selected
                ? "bg-accent text-white"
                : todayClass
                  ? "bg-accent/20 text-accent hover:bg-accent hover:text-white"
                  : "text-text-primary hover:bg-surface-raised"
            }`}
        >
          {day}
        </button>
      )
    }
    
    return days
  }

  return (
    <div className="bg-surface-raised rounded-xl p-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={isPrevMonthDisabled()}
          className="p-2 rounded-lg hover:bg-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-text-primary">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-surface transition-colors"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-text-muted">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {renderDays()}
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="border-t border-border pt-4">
          <p className="text-sm text-text-muted mb-2">Select time</p>
          <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
            {timeSlots.map(time => (
              <button
                key={time}
                onClick={() => handleTimeChange(time)}
                className={`px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedTime === time
                    ? "bg-accent text-white"
                    : "bg-surface text-text-secondary hover:text-text-primary hover:bg-border"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-text-muted">Selected:</p>
          <p className="text-lg font-semibold text-accent">
            {selectedDate.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })} at {selectedTime}
          </p>
        </div>
      )}
    </div>
  )
}
