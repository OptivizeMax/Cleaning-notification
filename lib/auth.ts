import { IronSessionOptions } from 'iron-session';

export const sessionOptions: IronSessionOptions = {
  password: process.env.ADMIN_PASSWORD || 'change_me',
  cookieName: 'cleaning_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export type SessionData = {
  loggedIn?: boolean;
};
