import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { SessionState, UserAgent } from 'sip.js'
import { CallDirection, removeSessionData, setOngoingSessionStatus, updateSipState } from 'src/store/dialer/sips'
import { cleanupMedia, connectingCallRigton, getObjectCount } from 'src/utils/sipUtilsFunc'
import { useAuth } from './useAuth'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'

export interface holdUnholdCallSession {
  toggelHoldCall: any
  holdCall: boolean
}
export interface muteUnmuteCallSessions {
  muteCall: boolean
  toggleMuteUnmuteCall: any
}

export interface returnFun {
  callHangUp: any
  muteUnmuteCallSessions: muteUnmuteCallSessions
  holdUnholdCallSession: holdUnholdCallSession
  sendDTMF: any
}

export const TerminateSessions = (session: any, callDirection: CallDirection) => {
  switch (session?.state) {
    case SessionState.Establishing:
      if (callDirection === CallDirection.Outbound) {
        session.cancel()
      }
      if (callDirection === CallDirection.Inbound) {
        session.reject(603)
      }
      cleanupMedia()
      break
    case SessionState.Established:
      console.debug('SessionState.Established')
      // mediaElement.currentTime = null;
      session.bye()
      // mediaElement.srcObject = null;
      cleanupMedia()
      break
    case SessionState.Terminating:
      break
    case SessionState.Terminated:
      console.debug('SessionState.Terminated')
      cleanupMedia()
      break
    default:
      cleanupMedia()
      break
  }
}

const useSipFunctionality = () => {
  const mediaElement: any = typeof document !== 'undefined' && document.querySelector('#mediaElement')
  // const mediaElement: HTMLAudioElement | any = _document.getElementById('mediaElement');
  const { sessions, sessionId, callDirection, outgoingSession, incomingSession, Session_Count, sessionState } =
    useSelector((state: any) => state.sip)
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()

  // useEffect(() => {
  //   if (![undefined, null, ''].includes(sessionId)) {
  //     if (CallDirection.Inbound === callDirection) {
  //       dispatch(updateSipState({ key: 'sessionId',value:incomingSession?._id }))
  //     }else{
  //        dispatch(updateSipState({ key: 'sessionId', value: outgoingSession?._id }))
  //     }
  //   }
  // }, [sessionId, sessions])

  /*
holdCall= false session unhold state  show  hold button
holdCall= true session hold state  show  unhold button
*/
  const [holdCall, setHoldCall] = useState(false) // false session unhold state  show  hold button

  /*
muteCall =  false session unmute show mute button
muteCall   =   true session mute show unmute button
  */
  const [muteCall, setMuteCall] = useState(false)

  useEffect(() => {
    if ([SessionState.Initial, SessionState.Establishing, '', SessionState.Terminated].includes(sessionState)) {
      setHoldCall(false)
      setMuteCall(false)
    }
  }, [sessionState])

  // current ongoing sessions
  const session = sessions[sessionId]

  // this function used for call Hangup
  const callHangUp = (): void => {
    console.debug('Call Hangup Function Calling ..............................')
    connectingCallRigton('pause')
    if (getObjectCount(sessions) > 0) {
      console.debug('main session terminated')
      TerminateSessions(session, callDirection)
      dispatch(removeSessionData(sessionId))
    }
    if (Session_Count === 0 && getObjectCount(outgoingSession) > 0 && callDirection === CallDirection.Outbound) {
      console.debug('outgoingSession session terminated')
      TerminateSessions(outgoingSession, CallDirection.Outbound)
    }
    if (Session_Count === 0 && getObjectCount(incomingSession) > 0 && callDirection === CallDirection.Inbound) {
      console.debug('incomingSession session terminated')
      TerminateSessions(incomingSession, CallDirection.Inbound)
    }
    dispatch(setOngoingSessionStatus(SessionState.Terminated))
    // dispatch(setOngoingSessionStatus(SessionState.Terminated))
  }

  /// this function used for call hold or unhold
  const toggelHoldCall = async (state: boolean) => {
    try {
      if (getObjectCount(sessions) > 0) {
        session.sessionDescriptionHandlerOptionsReInvite = {
          hold: state // true for hold call and false for unhold for call
        }
        console.debug(`Hold Session id${sessionId}`)
        const options = {
          requestDelegate: {
            onAccept: () => {
              if (state) {
                // session is on hold
                console.info('Hold Request Accepted.')
                mediaElement.pause()
                setHoldCall(true)
              } else {
                // session is on unhold
                mediaElement.play()
                console.info('Unhold Request Accepted.')
                setHoldCall(false)
              }
            },
            onReject: () => {
              setHoldCall(false)
              if (state) {
                // session is on hold
                console.debug('Hold Request Rejected.')
              } else {
                // session is on unhold
                console.debug('Unhold Request Accepted.')
              }
              // re-invite request was rejected, call not on unhold
              console.debug('Unhold Request Rejected.')
            }
          }
        }
        await session
          .invite(options)
          .then(() => {
            console.debug('hold / unhold invite send successfully')
          })
          .catch((error: any) => {
            console.debug(`Hold Error: ${error}`)
          })
      }
    } catch (error: any) {
      console.debug('hold unhold hooks function error', error) // eslint-disable-line  prefer-template
    }
  }

  /// this function used for sessions mute and un mute
  const toggleMuteUnmuteCall = (state: boolean) => {
    if (getObjectCount(sessions) > 0) {
      if (state) {
        setMuteCall(true)
      } else {
        setMuteCall(false)
      }
      console.log(`Audio Mute Statue: ${state}`)
      const pc = session.sessionDescriptionHandler.peerConnection

      if (pc.getSenders) {
        pc.getSenders().forEach((sender: any) => {
          if (sender.track) {
            sender.track.enabled = !state
          }
        })
      } else {
        pc.getReceivers().forEach((receiver: any) => {
          if (receiver.track) {
            receiver.track.enabled = !state
          }
        })
      }
    }
  }

  /**    sendDTMF : This function will send DTMF event to server. */
  const sendDTMF = (digit: string) => {
    console.debug(`DTMF Call Event Called with digit${digit}`)
    if (getObjectCount(sessions) > 0) {
      const options = {
        requestOptions: {
          body: {
            contentDisposition: 'render',
            contentType: 'application/dtmf-relay',
            content: `Signal=${digit}\r\nDuration=1000`
          }
        }
      }
      session.info(options)
    }
  }

  /**    blindTx : This function will send event to server for blind transfer. */
  const blindTx = async (number: string) => {
    try {
      const userSession = sessions[sessionId]
      console.debug('sessiions', userSession)
      // Send an outgoing REFER request
      const transferTarget = UserAgent.makeURI(`sip:${number}@${process.env.AUXOUT_SIP_REALM}`)
      console.log('BTXtransfer ==> ', transferTarget)
      if (!transferTarget) {
        throw new Error('Failed to create transfer target URI.')
      }
      userSession.refer(transferTarget, {
        // Example of extra headers in REFER request
        requestOptions: {
          extraHeaders: [`Referred-By : sip:${user?.phone}@${process.env.AUXOUT_SIP_REALM}`]
        },
        requestDelegate: {
          onAccept() {
            console.log('BTXtransfer accepted')
            // callHangUp();
          },
          onReject: () => {
            console.debug('BTXtransfer  Rejected')
          }
        }
      })
    } catch (error) {
      console.log('CATCH found - blindTx ==> ', error)
    }
  }

  /**    attendentTx : This function will send invite to target for attendent transfer. */
  const attendentTx = (referSession: any) => {
    try {
      const userSession = sessions[sessionId]
      userSession.refer(referSession, {
        // Example of extra headers in REFER request
        requestOptions: {
          extraHeaders: []
        },
        requestDelegate: {
          onAccept() {
            console.log('attendent accepted')
          },
          onReject: () => {
            console.debug('attendent  Rejected')
          }
        }
      })
    } catch (e) {
      console.log('Attendant Error:', e)
    }
  }

  /**    acceptIncomingCall : This function will accept incoming call. */
  const acceptIncomingCall = (inboundSession: any) => {
    console.log(`Incoming call accepted.`)
    const sessionObj = inboundSession.incomingInviteRequest.message.data.toString()
    let has_video = false
    if (sessionObj.includes('m=video')) {
      has_video = true
    }
    const options = {
      sessionDescriptionHandlerOptions: {
        constraints: { audio: true, video: has_video }
      }
    }
    inboundSession.accept(options)
  }

  return {
    muteCall,
    toggleMuteUnmuteCall,
    holdCall,
    toggelHoldCall,
    callHangUp,
    sendDTMF,
    blindTx,
    attendentTx,
    acceptIncomingCall
  }
}
export default useSipFunctionality
