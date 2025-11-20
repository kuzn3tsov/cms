import React, { useState } from 'react';
import './UserManagement.css';

const UserManagement = ({ users, setUsers, currentUser }) => {
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        role: 'author'
    });

    if (!currentUser) {
        return (
            <div className="access-denied">
                <h2>Molimo prijavite se</h2>
                <p>Morate biti prijavljeni za pristup ovoj stranici.</p>
            </div>
        );
    }

    if (currentUser.role !== 'admin') {
        return (
            <div className="access-denied">
                <h2>Pristup odbijen</h2>
                <p>Potrebne su administratorske ovlasti za pristup upravljanju korisnicima.</p>
            </div>
        );
    }

    const addUser = (e) => {
        e.preventDefault();
        const user = {
            ...newUser,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };
        setUsers([...users, user]);
        setNewUser({ username: '', email: '', password: '', role: 'author' });
    };

    const deleteUser = (id) => {
        if (id === currentUser.id) {
            alert('Ne možete obrisati vlastiti račun!');
            return;
        }
        setUsers(users.filter(user => user.id !== id));
    };

    return (
        <div className="user-management">
            <div className="user-management-header">
                <h1>
                    <i className="fas fa-users-cog"></i>
                    Upravljanje korisnicima
                </h1>
                <p>Upravljajte korisničkim računima i ovlastima</p>
            </div>

            <div className="user-section">
                <h2>
                    <i className="fas fa-user-plus"></i>
                    Dodaj novog korisnika
                </h2>
                <form onSubmit={addUser} className="user-form">
                    <div className="form-group">
                        <label>Korisničko ime</label>
                        <input
                            type="text"
                            placeholder="Unesite korisničko ime"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email adresa</label>
                        <input
                            type="email"
                            placeholder="Unesite email adresu"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Lozinka</label>
                        <input
                            type="password"
                            placeholder="Unesite lozinku"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="form-group">
                        <label>Uloga</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="admin">Administrator</option>
                            <option value="editor">Urednik</option>
                            <option value="author">Autor</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        <i className="fas fa-plus"></i>
                        Dodaj korisnika
                    </button>
                </form>
            </div>

            <div className="users-list">
                <h2>
                    <i className="fas fa-list"></i>
                    Svi korisnici ({users.length})
                </h2>
                {users.map(user => (
                    <div key={user.id} className="user-card">
                        <div className="user-info">
                            <h4>
                                {user.username}
                                {user.id === currentUser.id && <span className="current-user">(Vi)</span>}
                            </h4>
                            <p>
                                <i className="fas fa-envelope"></i>
                                {user.email}
                            </p>
                            <div className="user-meta">
                                <span className={`role ${user.role}`}>
                                    <i className={`fas ${user.role === 'admin' ? 'fa-crown' :
                                            user.role === 'editor' ? 'fa-edit' :
                                                'fa-user-edit'
                                        }`}></i>
                                    {user.role}
                                </span>
                                {user.createdAt && (
                                    <span className="created-date">
                                        <i className="fas fa-calendar-plus"></i>
                                        Član od: {new Date(user.createdAt).toLocaleDateString('hr-HR')}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => deleteUser(user.id)}
                            className="btn btn-danger"
                            disabled={user.id === currentUser.id}
                        >
                            <i className="fas fa-trash"></i>
                            Obriši
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserManagement;