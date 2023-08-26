import { useContext } from 'react'
import { CallTimerContext } from 'src/context/CallTimerContext'

export const useCallTimerContext = () => useContext(CallTimerContext)
