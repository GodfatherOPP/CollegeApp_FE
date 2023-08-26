/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from 'react-redux'
import { Inviter, RegistererState, SessionState, UserAgent } from 'sip.js'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import {
  CallDirection,
  CallFunctionalityUsed,
  removeSessionData,
  setCallIncomingOutGoingSession,
  setOngoingSessionStatus,
  updateSipState
} from 'src/store/dialer/sips'
import {
  connectingCallRigton,
  detectAudioVideoPermission,
  getObjectCount,
  setupRemoteMedia
} from 'src/utils/sipUtilsFunc'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'

export interface setSession {
  callDirection: string
  session: any
  sessionId: string
}

/* eslint-disable  @typescript-eslint/no-inferrable-types */

const useDialCall = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    userAgent,
    regState,
    toggleTransferCallModal,
    sessionId,
    sessions,
    attendentCallTransfer,
    CallFunctionalityUse
  } = useSelector((state: any) => state.sip)

  useEffect(() => {
    if ([undefined, null, ''].includes(sessionId) && getObjectCount(sessions) > 0) {
      const firstSessions: any = sessions[Object.keys(sessions)[0]]
      dispatch(updateSipState({ key: 'sessionId', value: firstSessions?.id }))
    }
  }, [sessionId, sessions])

  const dialCall = async (number: string, video: boolean = false) => {
    /*eslint newline-before-return: "error"*/
    const check_permission = await detectAudioVideoPermission()
    if (regState === RegistererState.Registered) {
      if ([true, 'TRUE'].includes(check_permission)) {
        if (number !== '') {
          console.debug('Dial Number ==> ', number)
          // _sipServer = "switch.nyerhosmobile.com:7443"

          const Call_type = CallFunctionalityUse === CallFunctionalityUsed.SelectedCall ? 'called' : 'dialer'
          const ENVIRONMENT = `X-Environment:${process.env.ENVIRONMENT}`
          // const _extraHeaders = {};

          const uri: any = UserAgent.makeURI(`sip:${number}@${process.env.AUXOUT_SIP_REALM}`)
          const _headers: any = [`X-call-custom-type:${Call_type}`, ENVIRONMENT]
          const earlyMedia: boolean = true
          const inviteOptions = {
            sessionDescriptionHandlerOptions: {
              constraints: {
                audio: true,
                video
              }
            },
            extraHeaders: _headers,
            earlyMedia
            // contactParams: { transport: 'wss' },
          }

          const session = await new Inviter(userAgent, uri, inviteOptions)

          const setSession: setSession = {
            callDirection: CallDirection.Outbound,
            session,
            sessionId: session.id
          }
          dispatch(updateSipState({ key: 'callId', value: session?.request?.callId }))

          if (
            [undefined, null, false, 'false'].includes(toggleTransferCallModal) ||
            [undefined, null, true, 'true'].includes(attendentCallTransfer)
          ) {
            connectingCallRigton('play')
            dispatch(setCallIncomingOutGoingSession(setSession))
          }

          // Handle outgoing session state changes
          session.stateChange.addListener(newState => {
            dispatch(setOngoingSessionStatus(newState))
            switch (newState) {
              case SessionState.Establishing:
                // Session is establishing
                console.debug('Session is establishing')
                break
              case SessionState.Established:
                connectingCallRigton('pause')
                dispatch(updateSipState({ key: 'showLoaddingTimer', value: false }))
                // Session has been established
                console.debug('Session has been ==> Established  ')
                setupRemoteMedia(session, video)
                break
              case SessionState.Terminated:
                connectingCallRigton('pause')
                console.debug('Session Has Been Terminated')
                dispatch(removeSessionData(session?.id))
                dispatch(updateSipState({ key: 'showDtmf', value: false }))
                break
              default:
                break
            }
          })
          // Setup outgoing session delegate
          session.delegate = {
            // Handle outgoing REFER request
            onRefer(referral) {
              // console.log("Handle outgoing REFER request");
              referral.accept().then(() => {
                referral.makeInviter().invite()
              })
            }
          }

          // Options including delegate to capture response messages
          const inviteOptionsOB = {
            requestDelegate: {
              onReject: () => {
                //  dispatch(removeSessionData(session._id));
                // console.log(response);
                //  cleanupMedia();
              },
              onAccept: () => {
                console.debug('Session Request Is Accepted <===>')
              },
              onProgress: () => {
                console.debug('onpogress Session <===>')
                //  dispatch(toggleConnectingCall(true));
                // console.debug('onpogressing session=========================')
              },
              onCancel: () => {
                console.debug('cancel session====')
              }
            },

            sessionDescriptionHandlerOptions: {
              constraints: {
                audio: true,
                video
              }
            }
          }

          // Send invitation
          session
            .invite(inviteOptionsOB)
            .then(() => {
              console.log('Successfully sent INVITE ....')
              // console.log(request);
            })
            .catch(error => {
              console.log('Failed to send INVITE ==> ', error)
            })
        } else {
          toast.error('please Enter Number')
        }
      } else {
        console.debug('check_permission', check_permission)
        // toast.error(check_permission);
      }
    } else {
      toast.error('User Agent Disconnected')
    }
  }

  return [dialCall]
}

export default useDialCall
