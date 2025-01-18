    'use client';
import { useSession, signOut } from 'next-auth/react';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Menubar } from 'primereact/menubar';

export default function Layout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return (
            <div className="flex align-items-center justify-content-center min-h-screen">
                <ProgressSpinner />
            </div>
        );
    }

    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }

    const end = (
        <div className="flex align-items-center gap-3">
            <div className="flex align-items-center gap-2">
                <Avatar
                    image={session?.user?.image}
                    shape="circle"
                    className="border-2 border-primary-50"
                />
                <span className="font-medium text-900">
                    {session?.user?.name}
                </span>
            </div>
            <Button
                icon="pi pi-sign-out"
                severity="secondary"
                rounded
                text
                tooltip="Logout"
                onClick={() => signOut({ callbackUrl: '/login' })}
            />
        </div>
    );

    const start = (
        <div className="flex align-items-center gap-2">
            <i className="pi pi-file text-2xl text-primary"></i>
            <span className="text-2xl font-bold text-900">Docs Editor</span>
        </div>
    );

    return (
        <div>
            {/* <Menubar
                start={start}
                end={end}
                className="border-noround surface-card shadow-2 relative z-1"
            /> */}
            {/* {/* <div className="p-4"> */}
                {children}
            {/* </div> */}
        </div>
    );
}
