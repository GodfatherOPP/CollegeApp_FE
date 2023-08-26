import {
  Referral,
  Registerer,
  RegistererOptions,
  RegistererState,
  SessionState,
  UserAgent,
  UserAgentOptions
} from 'sip.js'

import { cleanupMedia, connectingCallRigton, setupRemoteMedia } from 'src/utils/sipUtilsFunc'
import { setSession } from './useDialCall'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { useSelector } from 'react-redux'
import {
  CallDirection,
  CallFunctionalityUsed,
  ConnectingStatus,
  OngoingSessionCount,
  getCustomersDetailsByPhoneNumber,
  getExtensionNumber,
  removeSessionData,
  setCallIncomingOutGoingSession,
  setConnectedInfo,
  setOngoingSessionStatus,
  setRegisterer,
  setRegistererState,
  setUserAgent,
  updateSipState
} from 'src/store/dialer/sips'
import { toast } from 'react-hot-toast'
import {
  DialerOptionMode,
  powerDialerCallRecived,
  updateDialerState,
  DialerSettingSave,
  isAgentOnPowerDialerCall,
  DialerOptionModeType
} from 'src/store/dialer/dialer'
import useCallCampaignDialer from './useCallCampaignDialer'
import { useMemo } from 'react'

type sipConfigType = {
  _logEnable: boolean
  _iceServer: string
}
const sipConfig: sipConfigType = {
  _logEnable: false,
  _iceServer: 'stun:stun.l.google.com:19302'
}

// Number of times to attempt reconnection before giving up
/* eslint-disable  @typescript-eslint/no-inferrable-types */

const reconnectionAttempts: number = 3
// Number of seconds to wait between reconnection attempts
const reconnectionDelay: number = 4

// Used to guard against overlapping reconnection attempts
let attemptingReconnection: boolean = false
// If false, reconnection attempts will be discontinued or otherwise prevented
const shouldBeConnected: boolean = true

let UA: any = {}

const useCreateUa = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedUser } = useSelector((state: any) => state.user)
  const { sip_extention, userAgent, Session_Count } = useSelector((state: any) => state.sip)
  const { dialerModalToggle, settingSave } = useSelector((state: any) => state.dialer)
  const { currentCampaignCustomerId, nextCamapaignCustomerId } = useSelector((state: any) => state.dialer)

  interface UserAgentOptionsType extends UserAgentOptions {
    dtmfType: string
    contactTransport: string
    keepAliveInterval: number
    maxReconnectionAttempts: number
    expires: number
  }

  let acceptCall = false
  if (isAgentOnPowerDialerCall || DialerSettingSave || (isAgentOnPowerDialerCall && DialerSettingSave)) {
    acceptCall = true
  } else {
    acceptCall = false
  }
  const { GetCustomersDetails } = useCallCampaignDialer()
  const startCallHandler = async () => {
    dispatch(updateDialerState({ key: 'startDialing', value: true }))
    dispatch(updateSipState({ key: 'CallFunctionalityUse', value: CallFunctionalityUsed.CallDialer }))
    dispatch(updateDialerState({ key: 'dialerOptionMode', value: DialerOptionMode.PHONEDIAL }))
    dispatch(updateDialerState({ key: 'pauseDialing', value: false }))
    dispatch(updateDialerState({ key: 'isAgentOnCall', value: true }))
    await GetCustomersDetails(currentCampaignCustomerId, 'current')
    await GetCustomersDetails(nextCamapaignCustomerId, 'next')
  }

  const CreateUA = async () => {
    if (![undefined, null, ''].includes(sip_extention)) {
      try {
        const sip_aor = `sip:${sip_extention}@${process.env.AUXOUT_SIP_REALM}`
        const registererOptions: RegistererOptions = {}
        const userAgentOptions: UserAgentOptionsType = {
          uri: UserAgent.makeURI(sip_aor),
          transportOptions: {
            server: process.env.AUXOUT_SIP_WEBSOCKET_PROXY_URL,
            traceSip: true
          },
          userAgentString: process.env.APP_NAME,
          authorizationPassword: process.env.AUXOUT_SIP_PASSWORD,
          authorizationUsername: sip_extention,
          dtmfType: 'info',
          contactTransport: 'wss',
          noAnswerTimeout: 60,
          displayName: selectedUser?.name,
          contactParams: { transport: 'wss' },
          keepAliveInterval: 10,
          maxReconnectionAttempts: 3,
          expires: 3000,
          hackIpInContact: true,
          sessionDescriptionHandlerFactoryOptions: {
            peerConnectionOptions: {
              rtcpMuxPolicy: 'negotiate',
              iceCheckingTimeout: 1000,
              iceTransportPolicy: 'all',
              iceServers: [{ urls: sipConfig?._iceServer }]
            }
          },
          logBuiltinEnabled: sipConfig?._logEnable
        }

        const USERAGENT = new UserAgent(userAgentOptions)
        const registerer = new Registerer(USERAGENT, registererOptions)
        USERAGENT.start()
          .then(() => {
            registerer.stateChange.addListener(newState => {
              dispatch(setRegistererState(newState))
              switch (newState) {
                case RegistererState.Initial:
                  console.log('UserAgent ==> Initial')
                  break
                case RegistererState.Registered:
                  console.log('UserAgent ==> Registered')
                  break
                case RegistererState.Unregistered:
                  console.log('UserAgent ==> Unregistered')
                  break
                case RegistererState.Terminated:
                  console.warn('UserAgent ==> Terminated')
                  USERAGENT.stop()
                  break
                default:
                  console.log('UserAgent ==> Unidentified')
                  break
              }
            })
            registerer
              .register()
              .then(() => {
                console.log('Successfully sent REGISTER, object is here')
              })
              .catch(error => {
                console.log('Failed to send REGISTER', error)
              })

            const connectedInfo = {
              connected: true,
              connectingStatus: ConnectingStatus.Connected
            }

            dispatch(setConnectedInfo(connectedInfo))
            dispatch(setRegisterer(registerer))
            dispatch(setUserAgent(USERAGENT))
          })
          .catch(error => {
            const connectedInfo = {
              connected: false,
              connectingStatus: ConnectingStatus.Failed
            }
            dispatch(setConnectedInfo(connectedInfo))
            dispatch(setRegistererState('Unregistered'))
            console.debug('user agent connect error', error)
            toast.error('User Agent Unregistered')
          })

        /*
         * Setup handling for incoming INVITE requests
         */
        USERAGENT.delegate = {
          async onInvite(invitation) {
            console.table({ powerDialerCallRecived, DialerSettingSave, isAgentOnPowerDialerCall, acceptCall })
            console.debug('localIdentity', invitation?.localIdentity)
            // const callFor = invitation?.incomingInviteRequest?.message?.from?._displayName
            // const callFor = invitation?.console.debug('Callerid ==>', callerId)
            updateSipState({ key: 'selectedPhoneNum', value: [] })
            const has_video: boolean = false
            const number = invitation?.remoteIdentity?.uri?.user || ''
            const CallUsedFor = invitation.remoteIdentity?.displayName || ''
            console.debug('CallUsedFor', CallUsedFor)

            dispatch(updateSipState({ key: 'callId', value: number }))
            console.debug('invitations', invitation)
            console.debug('invitation?.request?.callId', invitation?.request?.callId)
            console.debug('invitation?.request?.callId', invitation?.request?.callId)
            dispatch(updateSipState({ key: 'notesAddedd', value: false }))

            console.debug('acceptCall', acceptCall)
            console.debug('number ==> incoimg', number)
            console.debug('number ==> incoimg', invitation?._contact)

            if (CallUsedFor === 'powerdialerauxout') {
              const callerId = invitation?.localIdentity?.uri?.user || ''
              const incomingSession: setSession = {
                callDirection: CallDirection.Inbound,
                session: invitation,
                sessionId: invitation.id
              }
              dispatch(updateSipState({ key: 'powserDialerSession', value: incomingSession }))

              dispatch(updateSipState({ key: 'incoingContactStr', value: callerId }))
              dispatch(updateDialerState({ key: 'agentDialNumber', value: number }))
              dispatch(updateDialerState({ key: 'isAgentOnCall', value: true }))
              invitation.accept()
            } else {
              connectingCallRigton('play')
              if (OngoingSessionCount <= 0) {
                const incomingSession: setSession = {
                  callDirection: CallDirection.Inbound,
                  session: invitation,
                  sessionId: invitation.id
                }

                dispatch(setCallIncomingOutGoingSession(incomingSession))
                dispatch(updateSipState({ key: 'ConnectingCallModalToggle', value: false }))
                dispatch(updateSipState({ key: 'ConnectingStripe', value: true }))
                dispatch(updateDialerState({ key: 'pauseDialing', value: false }))
                dispatch(getCustomersDetailsByPhoneNumber(number))
              } else {
                console.debug('Already One Call Runing')
                connectingCallRigton('pause')
                toast.success(`Missed Call From ${number}`)
                invitation.reject()
              }
            }

            // if (acceptCall && [true, 'true'].includes(acceptCall)) {
            //   console.debug('Power Dialer Mode start')

            // }

            // if (!acceptCall || [false, 'false'].includes(acceptCall)) {
            //   console.debug('No')

            // }

            //  Invitation session delegate
            invitation.delegate = {
              //  Handle incoming onCancel request
              onRefer(referral: Referral): void {
                console.debug('referral', referral)
              },

              onCancel(message) {
                console.debug('ON CANCEL - message ==> ', message)
                connectingCallRigton('pause')
              }
            }

            invitation.stateChange.addListener(state => {
              console.debug(`Session state changed to ${state}`)
              dispatch(setOngoingSessionStatus(state))
              // dispatch(updateSipState({ key: 'incomingSessionState', value: state }))
              switch (state) {
                case 'Initial':
                  console.debug('incomming session state Initial')
                  break
                case 'Establishing':
                  console.debug('Incoming Session state Establishing')
                  break
                case 'Established':
                  connectingCallRigton('pause')
                  console.debug('Incoming Session state Established')
                  dispatch(updateSipState({ key: 'ConnectingCallModalToggle', value: false }))
                  // dispatch(updateSipState({ key: 'IncomingCallModalToggle', value: true }))
                  // setupRemoteMedia(session);
                  CallUsedFor === 'powerdialerauxout' && startCallHandler()
                  CallUsedFor !== 'powerdialerauxout' && setupRemoteMedia(invitation, has_video)
                  break
                case 'Terminating':
                  connectingCallRigton('pause')
                  dispatch(removeSessionData(invitation?.id))
                  break
                case 'Terminated':
                  connectingCallRigton('pause')
                  dispatch(removeSessionData(invitation?.id))
                  cleanupMedia()
                  dispatch(updateSipState({ key: 'ConnectingCallModalToggle', value: false }))
                  dispatch(updateSipState({ key: 'IncomingCallModalToggle', value: false }))
                  console.debug('Incoming Session state Terminated')
                  break
                default:
                  console.debug('Unknow Incomming Session state')
              }
            })
          },

          onConnect() {
            !dialerModalToggle && toast.success('User Agent Connected')
            const connectedInfo = {
              connected: true,
              connectingStatus: ConnectingStatus.Connected
            }
            dispatch(setConnectedInfo(connectedInfo))
          },
          onDisconnect(error: any) {
            registerer
              .unregister()
              .then(() => {
                console.warn('onDisconnect - Unregistered event success')
              })
              .catch(e => {
                console.warn(`onDisconnect - Unregister failed with cause ${e}`)
              })
            if (error) {
              // attemptReconnection();
              console.info('trying to reconnect')
            }
            const connectedInfo = {
              connected: false,
              connectingStatus: ConnectingStatus.Failed
            }
            UA = {}
            dispatch(setRegisterer({}))
            dispatch(setUserAgent({}))
            toast.error('User Agent Disconnected')
            dispatch(setConnectedInfo(connectedInfo))
          }
        }
      } catch (error) {
        console.debug('userAgent create Error', error)
      }
    } else {
      dispatch(getExtensionNumber())
    }
  }

  const DisconnectUA = async () => {
    try {
      // registerer.unregister();
      userAgent.transport.dispose()
      // UA.transport.disconnect();
    } catch (error) {
      console.debug('disconneced')
    }
  }

  return { CreateUA, DisconnectUA }
}

export default useCreateUa

export const attemptReconnection = (reconnectionAttempt: number = 1) => {
  console.debug('reconnection')
  // If not intentionally connected, don't reconnect.
  if (!shouldBeConnected) {
    return
  }

  // Reconnection attempt already in progress
  if (attemptingReconnection) {
    return
  }

  // Reconnection maximum attempts reached
  if (reconnectionAttempt > reconnectionAttempts) {
    return
  }

  // We're attempting a reconnection
  attemptingReconnection = true

  setTimeout(
    () => {
      // If not intentionally connected, don't reconnect.
      if (!shouldBeConnected) {
        attemptingReconnection = false

        return
      }
      // Attempt reconnect
      UA?.reconnect()
        .then(() => {
          // Reconnect attempt succeeded
          attemptingReconnection = false
        })
        .catch(() => {
          // Reconnect attempt failed
          attemptingReconnection = false
          attemptReconnection(1 + reconnectionAttempt)
        })
    },
    reconnectionAttempt === 1 ? 0 : reconnectionDelay * 1000
  )
}
