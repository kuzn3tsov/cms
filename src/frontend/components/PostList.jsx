import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PostList.css';

const PostList = ({ posts, onDelete, onEdit, currentUser, isPublic = false }) => {
    const [filter, setFilter] = useState('svi');

    const getDisplayPosts = () => {
        // NEPRIJAVLJENI KORISNICI - vide sve OBJAVLJENE članke
        if (!currentUser) {
            return posts.filter(post => post.status === 'objavljen');
        }

        // PRIJAVLJENI KORISNICI
        if (currentUser.role === 'admin') {
            return posts; // Admin vidi sve članke
        }
        if (currentUser.role === 'editor') {
            return posts; // Editor vidi sve članke
        }
        return posts.filter(post => post.authorId === currentUser.id); // Autor vidi samo svoje
    };

    const displayPosts = getDisplayPosts();

    const filteredPosts = displayPosts.filter(post => {
        if (filter === 'svi') return true;
        return post.status === filter;
    });

    const handleStatusChange = (id, newStatus) => {
        onEdit(id, { status: newStatus });
    };

    const canEditPost = (post) => {
        if (!currentUser) return false;

        // Admin može uređivati sve članke
        if (currentUser.role === 'admin') return true;

        // Editor može uređivati svoje i autorove članke
        if (currentUser.role === 'editor') {
            return post.authorId === currentUser.id || post.author === 'author';
        }

        // Autor može uređivati samo svoje članke
        return post.authorId === currentUser.id;
    };

    const canDeletePost = (post) => {
        if (!currentUser) return false;

        // SAMO ADMIN može brisati sve članke
        if (currentUser.role === 'admin') return true;

        // Editor može brisati svoje i autorove članke
        if (currentUser.role === 'editor') {
            return post.authorId === currentUser.id || post.author === 'author';
        }

        // Autor može brisati samo svoje članke
        return post.authorId === currentUser.id;
    };

    const canChangeStatus = (post) => {
        if (!currentUser) return false;

        // Admin može mijenjati status svih članaka
        if (currentUser.role === 'admin') return true;

        // Editor može mijenjati status svojih i autorovih članaka
        if (currentUser.role === 'editor') {
            return post.authorId === currentUser.id || post.author === 'author';
        }

        // Autor može mijenjati status samo svojih članaka
        return post.authorId === currentUser.id;
    };

    return (
        <div className={`post-list ${!currentUser ? 'public-view' : ''}`}>
            <div className="page-header">
                <div className="page-header-row">
                    <h1>
                        {!currentUser ? 'Najnoviji članci' :
                            currentUser ? `Dobrodošao/la, ${currentUser.username}` : 'Članci'}
                    </h1>
                </div>

                {!currentUser ? (
                    <p className="header-description">
                        Otkrijte najnovije članke i uvide iz naše zajednice.
                    </p>
                ) : currentUser ? (
                    <div className="header-content">
                        <p className="header-description">
                            {currentUser.role === 'admin' ? 'Upravljajte svim člancima i korisnicima' :
                                currentUser.role === 'editor' ? 'Uređujte i upravljajte svojim i autorovim člancima' :
                                    'Stvarajte i upravljajte svojim člancima'}
                        </p>
                        {(currentUser.role === 'admin' || currentUser.role === 'editor' || currentUser.role === 'author') && (
                            <div className="header-actions">
                                <Link to="/uredjivac" className="btn btn-primary">
                                    <i className="fas fa-plus"></i>
                                    Novi članak
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="header-description">
                        Pročitajte naše najnovije članke. Prijavite se za stvaranje i upravljanje vlastitim člancima.
                    </p>
                )}
            </div>

            {/* FILTERI - SAMO ZA PRIJAVLJENE KORISNIKE */}
            {currentUser && (
                <div className="filters">
                    <button
                        className={filter === 'svi' ? 'active' : ''}
                        onClick={() => setFilter('svi')}
                    >
                        <i className="fas fa-list"></i>
                        Svi ({displayPosts.length})
                    </button>
                    <button
                        className={filter === 'objavljen' ? 'active' : ''}
                        onClick={() => setFilter('objavljen')}
                    >
                        <i className="fas fa-eye"></i>
                        Objavljeni ({displayPosts.filter(p => p.status === 'objavljen').length})
                    </button>
                    <button
                        className={filter === 'skica' ? 'active' : ''}
                        onClick={() => setFilter('skica')}
                    >
                        <i className="fas fa-edit"></i>
                        Skice ({displayPosts.filter(p => p.status === 'skica').length})
                    </button>
                </div>
            )}

            <div className="posts-grid">
                {filteredPosts.map(post => (
                    <div key={post.id} className="post-card">
                        <div className="post-header">
                            <h3>{post.title}</h3>
                            {/* STATUS I AUTOR - SAMO ZA PRIJAVLJENE KORISNIKE */}
                            {currentUser && (
                                <div className="post-status">
                                    <span className={`status ${post.status}`}>
                                        {post.status === 'objavljen' ? <i className="fas fa-eye"></i> : <i className="fas fa-edit"></i>}
                                        {post.status}
                                    </span>
                                    {(currentUser.role === 'admin' || currentUser.role === 'editor') && (
                                        <span className="post-author">
                                            <i className="fas fa-user"></i>
                                            Autor: {post.author}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {post.excerpt && (
                            <p className="post-excerpt">{post.excerpt}</p>
                        )}

                        <p className="post-content-preview">
                            {post.content ? post.content.substring(0, 200) + '...' : 'Nema sadržaja...'}
                        </p>

                        <div className="post-meta">
                            <span>
                                <i className="fas fa-calendar"></i>
                                Objavljeno: {new Date(post.createdAt).toLocaleDateString('hr-HR')}
                            </span>
                            {/* AZURIRANO - SAMO ZA PRIJAVLJENE KORISNIKE */}
                            {currentUser && post.updatedAt && post.updatedAt !== post.createdAt && (
                                <span>
                                    <i className="fas fa-sync"></i>
                                    Ažurirano: {new Date(post.updatedAt).toLocaleDateString('hr-HR')}
                                </span>
                            )}
                        </div>

                        <div className="post-actions">
                            {/* GUMB ZA POGLEDAJ ČLANAK - VIDLJIV SVIMA UVJEK */}
                            <Link
                                to={`/clanak/${post.id}`}
                                className="btn btn-sm btn-view"
                            >
                                <i className="fas fa-eye"></i>
                                Pogledaj članak
                            </Link>

                            {/* OSTALE AKCIJE - SAMO ZA PRIJAVLJENE KORISNIKE */}
                            {currentUser && (
                                <>
                                    {canEditPost(post) && (
                                        <Link to={`/uredjivac/${post.id}`} className="btn btn-sm">
                                            <i className="fas fa-edit"></i>
                                            Uredi
                                        </Link>
                                    )}
                                    {canChangeStatus(post) && (
                                        <select
                                            value={post.status}
                                            onChange={(e) => handleStatusChange(post.id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="skica">Skica</option>
                                            <option value="objavljen">Objavljen</option>
                                        </select>
                                    )}
                                    {canDeletePost(post) && (
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Jeste li sigurni da želite obrisati članak "${post.title}"?`)) {
                                                    onDelete(post.id);
                                                }
                                            }}
                                            className="btn btn-sm btn-danger"
                                        >
                                            <i className="fas fa-trash"></i>
                                            Obriši
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}

                {filteredPosts.length === 0 && (
                    <div className="no-posts">
                        <div className="no-posts-icon">
                            <i className="fas fa-file-alt"></i>
                        </div>
                        {!currentUser ? (
                            <>
                                <h3>Još nema članaka</h3>
                                <p>Vratite se kasnije za nove članke.</p>
                            </>
                        ) : currentUser ? (
                            <>
                                <h3>Nema pronađenih članaka</h3>
                                <p>Još niste stvorili nijedan članak.</p>
                                {(currentUser.role === 'admin' || currentUser.role === 'editor' || currentUser.role === 'author') && (
                                    <Link to="/uredjivac" className="btn btn-primary">
                                        <i className="fas fa-plus"></i>
                                        Stvori prvi članak
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <h3>Nema dostupnih članaka</h3>
                                <p>Trenutno nema objavljenih članaka.</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostList;