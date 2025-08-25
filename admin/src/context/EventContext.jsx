import { createContext, useState } from 'react'

export const EventContext = createContext()

export function EventProvider({ children }) {
  const [currentEvent, setCurrentEvent] = useState(null)

  return (
    <EventContext.Provider value={{ currentEvent, setCurrentEvent }}>
      {children}
    </EventContext.Provider>
  )
}