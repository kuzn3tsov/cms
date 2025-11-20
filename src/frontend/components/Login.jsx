import React, { useState } from 'react';
import './Login.css';

const Login = ({ users, onLogin, onClose }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        console.log('Login attempt:', credentials);
        console.log('Available users:', users);

        // Koristimo username umjesto korisnickoIme
        const user = users.find(u =>
            u.username.toLowerCase() === credentials.username.toLowerCase() &&
            u.password === credentials.password
        );

        if (user) {
            console.log('Login successful:', user);
            onLogin(user);
        } else {
            const errorMsg = 'Neispravno korisničko ime ili lozinka. Pokušajte: admin/admin123, editor/editor123, ili author/author123';
            console.log('Login failed:', errorMsg);
            setError(errorMsg);
        }
    };

    const handleChange = (field, value) => {
        setCredentials(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="login-modal">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label>Korisničko ime</label>
                    <input
                        type="text"
                        value={credentials.username}
                        onChange={(e) => handleChange('username', e.target.value)}
                        placeholder="Unesite korisničko ime"
                        required
                        autoFocus
                        autoComplete="username"
                    />
                </div>

                <div className="form-group">
                    <label>Lozinka</label>
                    <input
                        type="password"
                        value={credentials.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        placeholder="Unesite lozinku"
                        required
                        autoComplete="current-password"
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                        <i className="fas fa-times"></i>
                        Odustani
                    </button>
                    <button type="submit" className="btn btn-primary">
                        <i className="fas fa-sign-in-alt"></i>
                        Prijavi se
                    </button>
                </div>
            </form>

            <div className="demo-accounts">
                <h3>Demo računi:</h3>
                <div className="account-info">
                    <div className="account-item">
                        <strong>Admin:</strong> admin / admin123
                    </div>
                    <div className="account-item">
                        <strong>Editor:</strong> editor / editor123
                    </div>
                    <div className="account-item">
                        <strong>Author:</strong> author / author123
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;