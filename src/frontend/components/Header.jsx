import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Login from './Login';
import './Header.css';

const Header = ({ currentUser, users, onLogin, onLogout }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const location = useLocation();

    const handleLogin = (user) => {
        onLogin(user);
        setShowLoginModal(false);
    };

    const handleLogout = () => {
        onLogout();
        setShowLoginModal(false);
    };

    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            <header className="header">
                <div className="header-brand">
                    <Link to="/" className="brand-link">
                        <h1>LemGendarni CMS</h1>
                    </Link>
                </div>

                <nav className="header-nav">
                    <Link
                        to="/"
                        className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
                    >
                        <i className="fas fa-home"></i>
                        Početna
                    </Link>

                    {currentUser && (
                        <>
                            {/* Admin Menu */}
                            {currentUser.role === 'admin' && (
                                <>
                                    <Link
                                        to="/nadzorna-ploca"
                                        className={`nav-link ${isActiveLink('/nadzorna-ploca') ? 'active' : ''}`}
                                    >
                                        <i className="fas fa-tachometer-alt"></i>
                                        Nadzorna ploča
                                    </Link>
                                    <Link
                                        to="/uredjivac"
                                        className={`nav-link ${isActiveLink('/uredjivac') ? 'active' : ''}`}
                                    >
                                        <i className="fas fa-edit"></i>
                                        Uredi članak
                                    </Link>
                                    <Link
                                        to="/korisnici"
                                        className={`nav-link ${isActiveLink('/korisnici') ? 'active' : ''}`}
                                    >
                                        <i className="fas fa-users-cog"></i>
                                        Korisnici
                                    </Link>
                                </>
                            )}

                            {/* Editor Menu */}
                            {currentUser.role === 'editor' && (
                                <>
                                    <Link
                                        to="/nadzorna-ploca"
                                        className={`nav-link ${isActiveLink('/nadzorna-ploca') ? 'active' : ''}`}
                                    >
                                        <i className="fas fa-tachometer-alt"></i>
                                        Nadzorna ploča
                                    </Link>
                                    <Link
                                        to="/uredjivac"
                                        className={`nav-link ${isActiveLink('/uredjivac') ? 'active' : ''}`}
                                    >
                                        <i className="fas fa-edit"></i>
                                        Uredi članak
                                    </Link>
                                </>
                            )}

                            {/* Author Menu */}
                            {currentUser.role === 'author' && (
                                <Link
                                    to="/uredjivac"
                                    className={`nav-link ${isActiveLink('/uredjivac') ? 'active' : ''}`}
                                >
                                    <i className="fas fa-edit"></i>
                                    Uredi članak
                                </Link>
                            )}
                        </>
                    )}
                </nav>

                <div className="header-actions">
                    {currentUser ? (
                        <div className="user-menu">
                            <span className="user-info">
                                <span className="user-role-badge">
                                    <i className={`fas ${currentUser.role === 'admin' ? 'fa-crown' :
                                            currentUser.role === 'editor' ? 'fa-edit' :
                                                'fa-user-edit'
                                        }`}></i>
                                    {currentUser.username}
                                </span>
                            </span>
                            <button onClick={handleLogout} className="btn btn-logout">
                                <i className="fas fa-sign-out-alt"></i>
                                Odjava
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="btn btn-login"
                        >
                            <i className="fas fa-lock"></i>
                            Prijava
                        </button>
                    )}
                </div>
            </header>

            {/* Login Modal */}
            {showLoginModal && (
                <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Prijava u LemGendarni CMS</h2>
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="modal-close"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <Login
                            users={users}
                            onLogin={handleLogin}
                            onClose={() => setShowLoginModal(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;