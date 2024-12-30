import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextRequest } from "next/server";
import { authOptions } from "./options";
import { NextApiRequest, NextApiResponse } from "next"


// These two values should be a bit less than actual token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60;            // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60;  // 6 days

const getCurrentEpochTime = () => {
  return Math.floor(new Date().getTime() / 1000);
};

// const SIGN_IN_HANDLERS = {
//   "credentials": async (user, account, profile, email, credentials) => {
//     return true;
//   },
// };
// const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);


// Handle GET and POST requests
async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Initialize NextAuth
    return await NextAuth(authOptions)(req, res)
  }



// Export named route handlers
export const GET = handler
export const POST = handler

