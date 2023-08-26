// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type UsersType = {
  id: number
  role: string
  email: string
  status: string
  avatar: string
  billing: string
  company: string
  country: string
  contact: string
  fullName: string
  username: string
  currentPlan: string
  avatarColor?: ThemeColor
}

export type ProjectListDataType = {
  id: number
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}


// ----------------------------------------------------------------------

export type IUserSocialLink = {
  facebookLink: string;
  instagramLink: string;
  linkedinLink: string;
  twitterLink: string;
};

export type IUserProfileFollowers = {
  follower: number;
  following: string;
};

export type IUserProfileCover = {
  name: string;
  cover: string;
  role: string;
};

export type IUserProfileAbout = {
  quote: string;
  country: string;
  email: string;
  role: string;
  company: string;
  school: string;
};

export type IUserProfile = IUserProfileFollowers &
  IUserProfileAbout & {
    id: string;
    socialLinks: IUserSocialLink;
  };

export type IUserProfileFollower = {
  id: string;
  avatarUrl: string;
  name: string;
  country: string;
  isFollowed: boolean;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  postAt: Date | string | number;
  imageUrl: string;
};

export type IUserProfileFriend = {
  id: string;
  avatarUrl: string;
  name: string;
  role: string;
};

export type IUserProfilePost = {
  id: string;
  author: {
    id: string;
    avatarUrl: string;
    name: string;
  };
  isLiked: boolean;
  createdAt: Date | string | number;
  media: string;
  message: string;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    author: {
      id: string;
      avatarUrl: string;
      name: string;
    };
    createdAt: Date | string | number;
    message: string;
  }[];
};

// ----------------------------------------------------------------------

export type IUserCard = {
  id: string;
  avatarUrl: string;
  cover: string;
  name: string;
  follower: number;
  following: number;
  totalPosts: number;
  role: string;
};

// ----------------------------------------------------------------------

export type IUserAccountGeneral = {
  roles: any;
  id: string;
  avatarUrl: string;
  name: string;
  email: string;
  phone: string;
  fullAddress: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  companyName: string;
  isVerified: boolean;
  status: number;
  password: string;
  role: number;
  about: string;
  isPublic: number;
  agentSetting: any;
  adminSetting: any;
  timeZone: string;
};

export type IUserAccountBillingCreditCard = {
  id: string;
  cardNumber: string;
  cardType: string;
};

export type IUserAccountBillingInvoice = {
  id: string;
  createdAt: Date | string | number;
  price: number;
};

export type IUserAccountBillingAddress = {
  id: string;
  name: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  zipCode: string;
};

export type IUserAccountChangePassword = {
  newPassword: string;
  confirmNewPassword: string;
};

// ----------------------------------------------------------------------

export type IUserAccountNotificationSettings = {
  activityComments: boolean;
  activityAnswers: boolean;
  activityFollows: boolean;
  applicationNews: boolean;
  applicationProduct: boolean;
  applicationBlog: boolean;
};
