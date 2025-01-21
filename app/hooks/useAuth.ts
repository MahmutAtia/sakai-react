import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const login = async (email: string, password: string) => {
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (!result?.error) {
                router.push('/dashboard');
                return { success: true };
            }
            return { success: false, error: result.error };
        } catch (error) {
            return { success: false, error: 'Login failed' };
        }
    };

    const logout = async () => {
        await signOut({ redirect: true, callbackUrl: '/login' });
    };

    return {
        session,
        status,
        login,
        logout
    };
};
