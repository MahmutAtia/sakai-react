'use client';
import { Button } from 'primereact/button';
import { useAuth } from '@/hooks/useAuth';

const SocialLogin = () => {
    const { login } = useAuth();

    const socialProviders = [
        { name: 'Google', icon: 'pi pi-google', color: '#DB4437' },
        { name: 'Twitter', icon: 'pi pi-twitter', color: '#1DA1F2' },
        { name: 'LinkedIn', icon: 'pi pi-linkedin', color: '#0077B5' },
        { name: 'Facebook', icon: 'pi pi-facebook', color: '#4267B2' }
    ];

    return (
        <div className="flex flex-column gap-2 w-full">
            {socialProviders.map((provider) => (
                <Button
                    key={provider.name}
                    onClick={() => login(provider.name.toLowerCase())}
                    label={`Sign in with ${provider.name}`}
                    icon={provider.icon}
                    className="p-button-outlined w-full"
                    style={{ backgroundColor: 'white', color: provider.color, borderColor: provider.color }}
                />
            ))}
        </div>
    );
};

export default SocialLogin;
