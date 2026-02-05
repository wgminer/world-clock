import { useState, useEffect } from 'react'
import ClockCard from './ClockCard'
import { getDarknessLevel, getBackgroundColor, getTextColor } from '../utils/sunTimes'
import { getActualTimezone } from '../utils/timeZoneMapping'
import { Plus, RotateCcw, Share2, Info } from 'lucide-react'
import './ClockGrid.css'
import './Sidebar.css'

function ClockGrid({ timeZones, onAddClick, onDelete, onShareClick, onAboutClick }) {
  const [currentTimes, setCurrentTimes] = useState({})
  const [customTimeDate, setCustomTimeDate] = useState(null) // Date object representing the custom time
  const [invalidTimeInput, setInvalidTimeInput] = useState(false) // Track if current input is invalid
  const [lastValidTimes, setLastValidTimes] = useState({}) // Store last valid times for styling when invalid
  const [isEditingTime, setIsEditingTime] = useState(false) // Track if user is editing any time field

  // Get user's current date for comparison
  const getUserDate = () => {
    const now = new Date()
    const userTz = getUserTimeZone()
    return new Intl.DateTimeFormat('en-US', {
      timeZone: userTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now)
  }

  // Get date in a specific timezone
  const getDateInTimezone = (timeZone) => {
    const now = new Date()
    const actualTz = getActualTimezone(timeZone)
    return new Intl.DateTimeFormat('en-US', {
      timeZone: actualTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now)
  }

  // Get date offset (tomorrow = +1, yesterday = -1, today = 0)
  const getDateOffset = (timeZone) => {
    const userDate = getUserDate() // Format: "MM/DD/YYYY"
    const tzDate = getDateInTimezone(timeZone) // Format: "MM/DD/YYYY"
    
    // Parse dates
    const [userMonth, userDay, userYear] = userDate.split('/').map(Number)
    const [tzMonth, tzDay, tzYear] = tzDate.split('/').map(Number)
    
    // Convert to comparable numbers (YYYYMMDD)
    const userDateNum = userYear * 10000 + userMonth * 100 + userDay
    const tzDateNum = tzYear * 10000 + tzMonth * 100 + tzDay
    
    const diff = tzDateNum - userDateNum
    
    // Normalize to -1, 0, or 1 (yesterday, today, tomorrow)
    if (diff > 1) return 1 // More than 1 day ahead
    if (diff < -1) return -1 // More than 1 day behind
    return diff
  }

  // Parse time string and create Date object in specific timezone
  const parseTimeInTimezone = (timeString, timeZone) => {
    const actualTz = getActualTimezone(timeZone)
    
    // Try to parse 12-hour format (e.g., "3:45 PM")
    let match = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i)
    let hours, minutes
    
    if (match) {
      hours = parseInt(match[1])
      minutes = parseInt(match[2])
      const isPM = match[3].toUpperCase() === 'PM'
      if (isPM && hours !== 12) hours += 12
      if (!isPM && hours === 12) hours = 0
    } else {
      // Try 24-hour format (e.g., "15:45")
      match = timeString.match(/(\d+):(\d+)/)
      if (match) {
        hours = parseInt(match[1])
        minutes = parseInt(match[2])
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
          throw new Error('Invalid time values')
        }
      } else {
        throw new Error('Invalid time format')
      }
    }
    
    // Get current date in the target timezone
    const now = new Date()
    const dateParts = new Intl.DateTimeFormat('en-CA', {
      timeZone: actualTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now)
    
    // Create a date string in ISO format (YYYY-MM-DDTHH:mm:ss)
    // We'll treat this as if it's in the target timezone
    const isoString = `${dateParts}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
    
    // Create a date assuming this is in UTC first
    const baseDate = new Date(isoString + 'Z')
    
    // Now we need to find the UTC time that, when displayed in the target timezone, gives us our desired time
    // We'll use binary search or iteration to find the right UTC time
    const tzFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: actualTz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    
    // Get the timezone offset by comparing what the baseDate looks like in the timezone vs UTC
    const tzTimeStr = tzFormatter.format(baseDate)
    const [tzH, tzM] = tzTimeStr.split(':').map(Number)
    const tzMinutes = tzH * 60 + tzM
    const targetMinutes = hours * 60 + minutes
    
    // Calculate the difference in minutes
    let diffMinutes = targetMinutes - tzMinutes
    
    // Handle wraparound (e.g., if target is 23:00 and tz shows 01:00, diff could be -22 or +2)
    if (diffMinutes > 12 * 60) diffMinutes -= 24 * 60
    if (diffMinutes < -12 * 60) diffMinutes += 24 * 60
    
    // Adjust the date
    const finalDate = new Date(baseDate.getTime() + diffMinutes * 60 * 1000)
    
    // Verify the result
    const verifyTime = tzFormatter.format(finalDate)
    const [verifyH, verifyM] = verifyTime.split(':').map(Number)
    if (verifyH !== hours || verifyM !== minutes) {
      // If verification fails, try a different approach: adjust by the full day offset
      const dayOffset = Math.floor(diffMinutes / (24 * 60))
      const remainingMinutes = diffMinutes % (24 * 60)
      const adjustedDate = new Date(baseDate.getTime() + dayOffset * 24 * 60 * 60 * 1000 + remainingMinutes * 60 * 1000)
      return adjustedDate
    }
    
    return finalDate
  }

  // Convert a Date to all timezones
  const convertDateToAllTimezones = (date) => {
    const times = {}
    timeZones.forEach(tz => {
      try {
        const actualTz = getActualTimezone(tz)
        const timeString = new Intl.DateTimeFormat('en-US', {
          timeZone: actualTz,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }).format(date)
        
        // Get UTC offset for sorting
        const utcOffset = getUTCOffset(actualTz, date)
        
        // Calculate darkness based on the custom date
        const darkness = getDarknessLevelForDate(actualTz, date)
        const backgroundColor = getBackgroundColor(darkness)
        const textColor = getTextColor(darkness)
        const isDay = darkness < 0.5
        
        // Get date offset relative to user's current date
        const dateOffset = getDateOffsetForDate(tz, date)
        
        // Get hour for time of day indicator
        const hour = parseInt(new Intl.DateTimeFormat('en-US', {
          timeZone: actualTz,
          hour: 'numeric',
          hour12: false
        }).format(date))
        
        times[tz] = {
          time: timeString,
          isDay,
          darkness,
          backgroundColor,
          textColor,
          utcOffset,
          dateOffset,
          hour
        }
      } catch (error) {
        console.warn(`Error converting time for ${tz}:`, error)
        times[tz] = {
          time: '--:--:-- --',
          isDay: true,
          darkness: 0,
          backgroundColor: '#ffffff',
          textColor: '#000000',
          utcOffset: 0,
          dateOffset: 0
        }
      }
    })
    return times
  }

  // Get darkness level for a specific date
  const getDarknessLevelForDate = (timeZone, date) => {
    // Use the existing getDarknessLevel but we need to pass the date
    // For now, we'll calculate it based on the hour
    const hour = parseInt(new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      hour12: false
    }).format(date))
    
    // Simple approximation: 6am-6pm = day, otherwise night
    if (hour >= 6 && hour < 18) {
      // Daytime - calculate based on how far from noon
      const distanceFromNoon = Math.abs(hour - 12)
      return Math.min(0.3, distanceFromNoon / 12)
    } else {
      // Nighttime
      if (hour >= 18) {
        return 0.5 + (hour - 18) / 6 * 0.5 // 6pm-12am: 0.5 to 1.0
      } else {
        return 0.5 + (6 - hour) / 6 * 0.5 // 12am-6am: 1.0 to 0.5
      }
    }
  }

  // Get date offset for a specific date
  const getDateOffsetForDate = (timeZone, date) => {
    const userDate = getUserDate() // Format: "MM/DD/YYYY"
    const actualTz = getActualTimezone(timeZone)
    const tzDate = new Intl.DateTimeFormat('en-US', {
      timeZone: actualTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date) // Format: "MM/DD/YYYY"
    
    // Parse dates
    const [userMonth, userDay, userYear] = userDate.split('/').map(Number)
    const [tzMonth, tzDay, tzYear] = tzDate.split('/').map(Number)
    
    // Convert to comparable numbers (YYYYMMDD)
    const userDateNum = userYear * 10000 + userMonth * 100 + userDay
    const tzDateNum = tzYear * 10000 + tzMonth * 100 + tzDay
    
    const diff = tzDateNum - userDateNum
    
    // Normalize to -1, 0, or 1 (yesterday, today, tomorrow)
    if (diff > 1) return 1
    if (diff < -1) return -1
    return diff
  }

  // Validate time format
  const isValidTimeFormat = (timeString) => {
    if (!timeString || !timeString.trim()) return false
    // Try 12-hour format (e.g., "3:45 PM")
    const match12 = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (match12) {
      const hours = parseInt(match12[1])
      const minutes = parseInt(match12[2])
      return hours >= 1 && hours <= 12 && minutes >= 0 && minutes <= 59
    }
    // Try 24-hour format (e.g., "15:45")
    const match24 = timeString.match(/(\d+):(\d+)/)
    if (match24) {
      const hours = parseInt(match24[1])
      const minutes = parseInt(match24[2])
      return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
    }
    return false
  }

  // Handle time input from inline editing
  const handleTimeChange = (timeZone, timeString) => {
    // If empty string, reset to current time
    if (!timeString || !timeString.trim()) {
      setCustomTimeDate(null)
      setInvalidTimeInput(false)
      setIsEditingTime(false)
      return
    }

    // User is editing
    setIsEditingTime(true)

    // Check if valid format
    if (!isValidTimeFormat(timeString)) {
      setInvalidTimeInput(true)
      setCustomTimeDate(null)
      return
    }

    // Try to parse and convert
    try {
      const date = parseTimeInTimezone(timeString.trim(), timeZone)
      setCustomTimeDate(date)
      setInvalidTimeInput(false)
    } catch (error) {
      setInvalidTimeInput(true)
      setCustomTimeDate(null)
    }
  }

  // Update all clocks every second (or use custom time if set)
  useEffect(() => {
    const updateTimes = () => {
      let times = {}
      
      if (invalidTimeInput) {
        // Show invalid time for all clocks, but preserve styling from last valid state
        timeZones.forEach(tz => {
          const lastValid = lastValidTimes[tz] || currentTimes[tz] || {}
          times[tz] = {
            ...lastValid,
            time: '--:-- --'
          }
        })
      } else if (customTimeDate) {
        // Use custom time
        times = convertDateToAllTimezones(customTimeDate)
      } else {
        // Use current time
        timeZones.forEach(tz => {
          try {
            const actualTz = getActualTimezone(tz)
            const now = new Date()
            const timeString = new Intl.DateTimeFormat('en-US', {
              timeZone: actualTz,
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }).format(now)
            
            // Get UTC offset for sorting
            const utcOffset = getUTCOffset(actualTz, now)
            
            const darkness = getDarknessLevel(actualTz)
            const backgroundColor = getBackgroundColor(darkness)
            const textColor = getTextColor(darkness)
            const isDay = darkness < 0.5
            const dateOffset = getDateOffset(tz)
            
            // Get hour for time of day indicator
            const hour = parseInt(new Intl.DateTimeFormat('en-US', {
              timeZone: actualTz,
              hour: 'numeric',
              hour12: false
            }).format(now))
            
            times[tz] = {
              time: timeString,
              isDay,
              darkness,
              backgroundColor,
              textColor,
              utcOffset,
              dateOffset,
              hour
            }
          } catch (error) {
            // Handle invalid timezone
            console.warn(`Invalid timezone: ${tz}`, error)
            times[tz] = {
              time: '--:--:-- --',
              isDay: true,
              darkness: 0,
              backgroundColor: '#ffffff',
              textColor: '#000000',
              utcOffset: 0,
              dateOffset: 0
            }
          }
        })
      }
      
      // Store valid times for use when showing invalid input
      if (!invalidTimeInput) {
        setLastValidTimes(times)
      }
      
      setCurrentTimes(times)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 1000)
    return () => clearInterval(interval)
  }, [timeZones, customTimeDate, invalidTimeInput])

  // Get UTC offset in hours for a timezone (for sorting)
  const getUTCOffset = (timeZone, date) => {
    // Create two dates: one in UTC, one in the timezone
    // Format both as ISO strings and compare
    const utcTime = date.getTime()
    
    // Get time string in the timezone
    const tzTimeStr = date.toLocaleString('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    
    // Get UTC time string
    const utcTimeStr = date.toLocaleString('en-US', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    
    // Parse hours and minutes
    const [tzHours, tzMinutes] = tzTimeStr.split(':').map(Number)
    const [utcHours, utcMinutes] = utcTimeStr.split(':').map(Number)
    
    // Calculate difference
    const tzTotalMinutes = tzHours * 60 + tzMinutes
    const utcTotalMinutes = utcHours * 60 + utcMinutes
    
    let diffMinutes = tzTotalMinutes - utcTotalMinutes
    
    // Handle day wrap-around
    if (diffMinutes > 12 * 60) diffMinutes -= 24 * 60
    if (diffMinutes < -12 * 60) diffMinutes += 24 * 60
    
    return diffMinutes / 60
  }

  // Calculate grid columns and rows based on number of items
  const getGridLayout = (count) => {
    if (count === 1) return { cols: 1, rows: 1 }
    if (count === 2) return { cols: 2, rows: 1 }
    if (count <= 4) return { cols: 2, rows: 2 }
    if (count <= 6) return { cols: 3, rows: 2 }
    if (count <= 9) return { cols: 3, rows: 3 }
    if (count <= 12) return { cols: 4, rows: 3 }
    if (count <= 16) return { cols: 4, rows: 4 }
    if (count <= 20) return { cols: 5, rows: 4 }
    if (count <= 25) return { cols: 5, rows: 5 }
    
    // For larger counts, calculate optimal square-ish grid
    const cols = Math.ceil(Math.sqrt(count))
    const rows = Math.ceil(count / cols)
    return { cols, rows }
  }

  const totalItems = timeZones.length
  const { cols, rows } = getGridLayout(totalItems)

  const getUserTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  const userTz = getUserTimeZone()

  // Sort timezones chronologically (earliest to latest)
  const sortedTimeZones = [...timeZones].sort((a, b) => {
    const timeA = currentTimes[a]
    const timeB = currentTimes[b]
    
    if (!timeA || !timeB) return 0
    
    // First sort by date offset (yesterday < today < tomorrow)
    if (timeA.dateOffset !== timeB.dateOffset) {
      return timeA.dateOffset - timeB.dateOffset
    }
    
    // If same date, sort by actual time
    // Parse time strings to compare (e.g., "3:45 PM" -> 15.75)
    const parseTime = (timeStr) => {
      if (!timeStr || timeStr.includes('--')) return 0
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/)
      if (!match) return 0
      let hours = parseInt(match[1])
      const minutes = parseInt(match[2])
      const isPM = match[3] === 'PM'
      if (isPM && hours !== 12) hours += 12
      if (!isPM && hours === 12) hours = 0
      return hours + minutes / 60
    }
    
    const timeAValue = parseTime(timeA.time)
    const timeBValue = parseTime(timeB.time)
    
    if (timeAValue !== timeBValue) {
      return timeAValue - timeBValue
    }
    
    // If same time, sort by UTC offset as tiebreaker
    if (timeA.utcOffset !== timeB.utcOffset) {
      return timeA.utcOffset - timeB.utcOffset
    }
    
    // If everything is the same, keep original order
    return 0
  })

  // Calculate font size multiplier based on number of clocks - more aggressive scaling
  const getFontMultiplier = (count) => {
    if (count <= 1) return 0.8
    if (count <= 4) return 0.6
    if (count <= 9) return 0.5
    if (count <= 16) return 0.4
    if (count <= 25) return 0.35
    return 0.3
  }

  const fontMultiplier = getFontMultiplier(timeZones.length)

  return (
    <div className="clock-grid-wrapper">
      <div 
        className="clock-grid" 
        style={{ 
          '--grid-cols': cols, 
          '--grid-rows': rows,
          '--total-clocks': timeZones.length,
          '--font-multiplier': fontMultiplier
        }}
      >
        {sortedTimeZones.map((tz, index) => {
        const timeData = currentTimes[tz] || { 
          time: '--:--:-- --', 
          isDay: true, 
          darkness: 0,
          backgroundColor: '#ffffff',
          textColor: '#000000',
          dateOffset: 0,
          hour: 12
        }
          const isUserTz = tz === userTz
          const canDelete = !isUserTz && timeZones.length > 1
          
          return (
            <ClockCard
              key={tz}
              timeZone={tz}
              time={timeData.time}
              dateOffset={timeData.dateOffset}
              hour={timeData.hour}
              isUserTimeZone={isUserTz}
              onDelete={canDelete ? () => onDelete(tz) : null}
              onTimeChange={(timeString) => handleTimeChange(tz, timeString)}
              onEditingChange={setIsEditingTime}
            />
          )
        })}
      </div>
      <div className="sidebar">
        <button className="add-clock-button" onClick={onAddClick} title="Add clock">
          <Plus size={24} />
        </button>
        <button 
          className="share-button" 
          onClick={onShareClick}
          title="Share"
        >
          <Share2 size={20} />
        </button>
        <button 
          className="about-button" 
          onClick={onAboutClick}
          title="About"
        >
          <Info size={20} />
        </button>
        {(customTimeDate || invalidTimeInput) && (
          <button 
            className="reset-time-button" 
            onClick={() => {
              setCustomTimeDate(null)
              setInvalidTimeInput(false)
              setIsEditingTime(false)
            }}
            title="Reset to current time"
          >
            <RotateCcw size={20} />
          </button>
        )}
      </div>
    </div>
  )
}

export default ClockGrid
