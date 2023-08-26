// ** Types
import { Dispatch } from 'redux'
import { ThemeColor } from 'src/@core/layouts/types'

export type StatusType = 'busy' | 'away' | 'online' | 'offline'

export type StatusObjType = {
  busy: ThemeColor
  away: ThemeColor
  online: ThemeColor
  offline: ThemeColor
}

export type ProfileUserType = {
  id: number
  role: string
  about: string
  avatar: string
  fullName: string
  status: StatusType
  settings: {
    isNotificationsOn: boolean
    isTwoStepAuthVerificationEnabled: boolean
  }
}

export type MsgFeedbackType = {
  isSent: boolean
  isSeen: boolean
  isDelivered: boolean
}

export type ChatType = {
  message: string
  senderId: number
  time: Date | string
  feedback: MsgFeedbackType
}

export type ChatsObj = {
  id: number
  userId: number
  chat: ChatType[]
  unseenMsgs: number
  lastMessage?: ChatType
}

export type ContactType = {
  id: number
  role: string
  about: string
  avatar?: string
  fullName: string
  status: StatusType
  avatarColor?: ThemeColor
}

export type ChatsArrType = {
  id: number
  to: string
  from: string
  unread_count: number
  last_msg_type: number
  last_message: string
  last_msg_direction: string
  last_msg_created_at: string
  account_title: string
  content_name: string
}

export type SelectedChatType = null | {
  chat: ChatsObj
  contact: ChatsArrType
}

export type SendMsgParamsType = {
  chat?: ChatsObj
  message: string
  contact?: ChatsArrType
}

export type ChatContentType = {
  hidden: boolean
  mdAbove: boolean
  store: any
  sidebarWidth: number
  dispatch: Dispatch<any>
  statusObj: StatusObjType
  userProfileRightOpen: boolean
  handleLeftSidebarToggle: () => void
  getInitials: (val: string) => string
  handleUserProfileRightSidebarToggle: () => void
}

export type ChatSidebarLeftType = {
  hidden: boolean
  mdAbove: boolean
  store: any
  sidebarWidth: number
  userStatus: StatusType
  dispatch: Dispatch<any>
  leftSidebarOpen: boolean
  statusObj: StatusObjType
  userProfileLeftOpen: boolean
  handleLeftSidebarToggle: () => void
  getInitials: (val: string) => string
  setUserStatus: (status: StatusType) => void
  handleUserProfileLeftSidebarToggle: () => void
  formatDateToMonthShort: (value: string, toTimeForCurrentDay: boolean) => void
}

export type UserProfileLeftType = {
  hidden: boolean
  store: any
  sidebarWidth: number
  userStatus: StatusType
  statusObj: StatusObjType
  userProfileLeftOpen: boolean
  setUserStatus: (status: StatusType) => void
  handleUserProfileLeftSidebarToggle: () => void
}

export type UserProfileRightType = {
  hidden: boolean
  store: any
  sidebarWidth: number
  statusObj: StatusObjType
  userProfileRightOpen: boolean
  getInitials: (val: string) => string
  handleUserProfileRightSidebarToggle: () => void
}

export type SendMsgComponentType = {
  store: any
  dispatch: Dispatch<any>
}

export type ChatLogType = {
  hidden: boolean
  messages: MessageType[]
  dispatch: Dispatch<any>
  store: any
}

export type MessageType = {
  id: number
  conversation_room_id: number
  message_id: string
  to: string
  from: string
  owner: string
  message: string
  direction: string
  time: Date | string
  is_autoreply: number
  type: string
  read_status: string
  delete_status: number
  created_at: Date | string
  firstname: string
  lastname: string
  fullname: string
}

export type ChatLogChatType = {
  msg: string
  time: string | Date
  isSeen: boolean
}

export type FormattedChatsType = {
  direction: string
  messages: ChatLogChatType[]
}

export type MessageGroupType = {
  direction: string
  messages: ChatLogChatType[]
}
