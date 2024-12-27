import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        refreshToken?: string;
        user: {
            id: string;
            email: string;
            name: string;
        }
    }

    interface User {
        access_token?: string;
        refresh_token?: string;
    }
}
