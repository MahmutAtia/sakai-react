'use client';
import { Button } from 'primereact/button';
import { useAuth } from '@/hooks/useAuth';

const LogoutButton = () => {
    const { logout } = useAuth();

    return (
        <Button
            onClick={() => logout()}
            icon="pi pi-sign-out"
            label="Sign Out"
            severity="danger"
            className="p-button-outlined"
        />
    );
};

export default LogoutButton;
