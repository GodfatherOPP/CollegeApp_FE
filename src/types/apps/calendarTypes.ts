// ** Types
import { Dispatch } from 'redux'

export type CalendarFiltersType = '1' | '2'

export type EventDateType = Date | null | undefined

export type EventType = {
  id: number
  url: string
  title: string
  allDay: boolean
  end: Date | string
  start: Date | string
  extendedProps: {
    location?: string
    calendar?: string
    description?: string
    guests?: string[] | string | undefined
  }
}

export type CalendarStoreType = {
  events: EventType[]
  selectedEvent: null | EventType
  selectedCalendars: CalendarFiltersType[] | string[]
}

export type CalendarType = {
  calendarApi: any
  dispatch: Dispatch<any>
  store: CalendarStoreType
  direction: 'ltr' | 'rtl'
  calendarsColor: any[]
  setCalendarApi: (val: any) => void
  handleLeftSidebarToggle: () => void
  handleSelectEvent: (event: EventType) => void
  handleOnDateChanged: (event: EventType) => void
}

export type SidebarLeftType = {
  mdAbove?: boolean
  calendarApi: any
  dispatch: Dispatch<any>
  leftSidebarWidth: number
  leftSidebarOpen: boolean
  store: CalendarStoreType
  calendarsColor: any[]
  handleLeftSidebarToggle: () => void
  handleOnButtonClick: () => void
}

