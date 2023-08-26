/*  setupRemoteMedia : This function will be used when call established and set media streams. */

import { requestMediaPermissions } from 'mic-check'
import { SessionState } from 'sip.js'

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const setupRemoteMedia = (session: any, has_video: boolean = false) => {
  const mediaElement: HTMLAudioElement | any = document.getElementById('mediaElement')
  const remoteStream = new MediaStream()
  // console.log('remoteStream', session.sessionDescriptionHandler.peerConnection.getReceivers());
  session.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver: any) => {
    // console.log('receiver track', receiver.track);
    if (receiver.track) {
      remoteStream.addTrack(receiver.track)
    }
  })
  if (!has_video) {
    mediaElement.srcObject = remoteStream
    mediaElement.play()
  } else {
    const remoteVideoElement: HTMLVideoElement | any = document.getElementById('remoteVideoElement')
    const localVideoElement: HTMLVideoElement | any = document.getElementById('localVideoElement')
    console.debug('remoteVideoElement', remoteVideoElement)
    console.debug('localVideoElement', localVideoElement)
    if (typeof remoteVideoElement !== 'undefined' && remoteVideoElement !== null) {
      remoteVideoElement.srcObject = remoteStream
      remoteVideoElement.play()
    }

    const senderStream = new MediaStream()
    session.sessionDescriptionHandler.peerConnection.getSenders().forEach((sender: any) => {
      if (sender.track) {
        senderStream.addTrack(sender.track)
      }
    })
    if (typeof localVideoElement !== 'undefined' && localVideoElement !== null) {
      localVideoElement.srcObject = senderStream
      localVideoElement.play()
    }
  }
}

/*   getObjectCount : This function will Give count of how many data store in Object. */
export const getObjectCount = (obj: any) => Object.keys(obj).length

/// This function used for clean media when call hangup or session is terminated
export const cleanupMedia = () => {
  const mediaElement: HTMLAudioElement | any = document.getElementById('mediaElement')
  // mediaElement.srcObject = remoteVideoElement.srcObject = localVideoElement.srcObject = null;
  const remoteVideoElement: HTMLVideoElement | any = document.getElementById('remoteVideo')

  if (typeof remoteVideoElement !== 'undefined' && remoteVideoElement != null) {
    remoteVideoElement.srcObject = null
  }
  const localVideoElement: HTMLVideoElement | any = document.getElementById('localVideo')
  if (typeof localVideoElement !== 'undefined' && localVideoElement != null) {
    localVideoElement.srcObject = null
  }
  // If it isn't "undefined" and it isn't "null", then it exists.
  mediaElement.srcObject = null
  mediaElement.pause()
}

///  Check to user Allow audio and video permission

/*eslint newline-before-return: "error"*/
export const detectAudioVideoPermission = async (video = false) => {
  try {
    const res = await requestMediaPermissions({ audio: true, video })

    return res
  } catch (err: any) {
    let message = ''
    switch (err?.type) {
      case 'UserPermissionDenied':
        message = video ? 'Please Allow Audio and video Permission' : 'Please Allow Audio Permission'
        break
      case 'Generic':
        message = err?.message
        break
      default:
        message = err?.message
    }

    return message
  }
}

/* pad - calculates whether a number needs leading zero padding or not */

export const pad = (val: number) => (val > 9 ? val : '0' + val) // eslint-disable-line prefer-template

export const genrateObjectInitalStateKey = (object: any) => {
  const newObj: any = {}
  Object.keys(object).forEach((key: any) => {
    newObj[key] = key
  })

  return Object.freeze(newObj)
}

/*  eslint-disable prefer-template  */
export const formatPhoneNumber = (phoneNumberString: any) => {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  const match = cleaned.match(/^(\d{1,3}|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    const intlCode = match[1] ? `+${match[1]} ` : ''

    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
  }

  return phoneNumberString
}

export const secondsToHms = (seconds: string | number) => {
  const d = Number(seconds)
  /* eslint-disable no-else-return */
  if (d <= 0) {
    return '00:00:00'
  } else {
    const h = Math.floor(d / 3600)
    const m = Math.floor((d % 3600) / 60)
    const s = Math.floor((d % 3600) % 60)

    const hDisplay = h <= 9 ? '0' + h + ':' : h + ':'
    const mDisplay = m <= 9 ? '0' + m + ':' : m + ':'
    const sDisplay = s <= 9 ? '0' + s : s

    return hDisplay + mDisplay + sDisplay
  }
}
// this function used for call rington play or pause when call establishing or terminated
export const connectingCallRigton = (option: string) => {
  const ringtone: HTMLAudioElement | any = document.getElementById('connectingRingTone')

  if (option === 'play') {
    ringtone.play()
  }
  if (option === 'pause') {
    ringtone.pause()
    ringtone.currentTime = null
  }
}

// this function used for call rington play or pause when call establishing or terminated
export const InComingCallRington = (option: string) => {
  const ringtone: HTMLAudioElement | any = document.getElementById('InComingConnectingRingTone')

  if (option === 'play') {
    ringtone.play()
  }
  if (option === 'pause') {
    ringtone.pause()
    ringtone.currentTime = null
  }
}

export const CallHangupHandler = (ongoingSession: any, callDirection: string) => {
  console.debug('CallHangupHandler ==>Calling')
  switch (ongoingSession?.state) {
    case SessionState.Establishing:
      // if (callDirection === CallDirection.Outbound) {
      //   ongoingSession.cancel()
      // }
      // if (callDirection === CallDirection.Inbound) {
      //   ongoingSession.reject(603)
      // }
      cleanupMedia()
      break
    case SessionState.Established:
      // mediaElement.currentTime = null;
      ongoingSession.bye()
      // mediaElement.srcObject = null;
      cleanupMedia()
      break
    case SessionState.Terminating:
      ongoingSession.bye()
      cleanupMedia()
      break
    case SessionState.Terminated:
      cleanupMedia()
      break
    default:
      cleanupMedia()
      break
  }
}
