import { IronSessionOptions } from 'iron-session';

export const sessionOptions: IronSessionOptions = {
  password:
    process.env.SESSION_PASSWORD ||
    'session_password_at_least_32_chars_long',
  cookieName: 'cleaning_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export type SessionData = {
  loggedIn?: boolean;
};
