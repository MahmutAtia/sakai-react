import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    user: {
      id: string
      name: string
      email: string
      image: string
    }
  }

  interface JWT {
    accessToken?: string
    refreshToken?: string
    user?: {
      id: string
      name: string
      email: string
      image: string
    }
  }

  interface User {
    access_token?: string;
    refresh_token?: string;
  }
}
