'use client';
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    // const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login('credentials', {
            username: formData.username,
            password: formData.password
        });
    };

    return (
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <span className="p-float-label">
                        <InputText
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                        <label htmlFor="username">Username</label>
                    </span>
                </div>
                <div className="mb-3">
                    <span className="p-float-label">
                        <Password
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            feedback={false}
                            toggleMask
                        />
                        <label htmlFor="password">Password</label>
                    </span>
                </div>
                <Button label="Sign In" type="submit" className="w-full" />
            </form>
        </div>
    );
};

export default LoginForm;
