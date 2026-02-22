import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Onboarding() {
    const { updateProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        business_type: 'retail',
        language: 'en',
        location: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to finish setup.');
        }
    };

    return (
        <div className="flex-center min-h-screen">
            <div className="card slide-up w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2">Complete Profile</h2>
                <p className="text-muted mb-6">Tell us about your business.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Full Name</label>
                        <input
                            type="text" className="input-field" required
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Age (Must be 18+)</label>
                        <input
                            type="number" className="input-field" min="18" required
                            onChange={e => setFormData({ ...formData, age: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Business Type</label>
                        <select className="input-field" onChange={e => setFormData({ ...formData, business_type: e.target.value })}>
                            <option value="retail">Retail Shop</option>
                            <option value="freelance">Freelance</option>
                            <option value="food">Food & Beverage</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Preferred Language</label>
                        <select className="input-field" onChange={e => setFormData({ ...formData, language: e.target.value })}>
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary w-full mt-2">
                        Complete Setup
                    </button>
                </form>
            </div>
        </div>
    );
}
