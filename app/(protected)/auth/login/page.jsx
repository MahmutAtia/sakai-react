'use client';
import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { useAuth } from '@/app/hooks/useAuth';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const toast = useRef<Toast>(null);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await login(formData.email, formData.password);

        if (!result.success) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: result.error
            });
        }
    };

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <div style={{
                    borderRadius: '56px',
                    padding: '0.3rem',
                    background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="text-center mb-5">
                                <div className="text-900 text-3xl font-medium mb-3">Welcome Back!</div>
                                <span className="text-600 font-medium">Sign in to continue</span>
                            </div>

                            <div className="flex flex-column gap-4">
                                <InputText
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                                <Password
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    feedback={false}
                                    toggleMask
                                />
                                <div className="flex align-items-center justify-content-between">
                                    <div className="flex align-items-center">
                                        <Checkbox
                                            checked={formData.rememberMe}
                                            onChange={(e) => setFormData({...formData, rememberMe: e.checked})}
                                            className="mr-2"
                                        />
                                        <label>Remember me</label>
                                    </div>
                                </div>
                                <Button label="Sign In" type="submit" className="w-full" />

                                <div className="flex align-items-center justify-content-center gap-2">
                                    <Button
                                        type="button"
                                        label="Google"
                                        icon="pi pi-google"
                                        onClick={() => signIn('google')}
                                        className="p-button-secondary"
                                    />
                                    {/* Add other social login buttons as needed */}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
