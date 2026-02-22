import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Store } from 'lucide-react';

export default function Login() {
    const [phone, setPhone] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { isNew, user } = await login(phone);
            if (isNew || !user.name) {
                navigate('/onboarding');
            } else {
                navigate('/');
            }
        } catch (err) {
            alert('Login failed. Ensure backend is running.');
        }
    };

    return (
        <div className="flex-center min-h-screen">
            <div className="card login-card text-center slide-up">
                <Store size={48} className="mx-auto text-primary mb-4" />
                <h1 className="text-2xl font-bold mb-2">Vyapaar Saathi</h1>
                <p className="text-muted mb-6">Manage your daily business simply.</p>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="tel"
                        className="input-field mb-0"
                        placeholder="Enter Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary w-full">
                        Login with OTP
                    </button>
                </form>

                <div className="divider text-muted my-6">OR</div>

                <button className="btn-outline w-full flex items-center justify-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="20" />
                    Login with Google
                </button>
            </div>
        </div>
    );
}
