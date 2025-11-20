import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './PostView.css';

const PostView = ({ posts, currentUser }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const post = posts.find(p => p.id === parseInt(id));

    if (!post) {
        return (
            <div className="post-not-found">
                <div className="not-found-content">
                    <i className="fas fa-file-exclamation"></i>
                    <h2>Članak nije pronađen</h2>
                    <p>Traženi članak ne postoji ili je obrisan.</p>
                    <Link to="/" className="btn btn-primary">
                        <i className="fas fa-arrow-left"></i>
                        Povratak na popis članaka
                    </Link>
                </div>
            </div>
        );
    }

    // Provjera pristupa - skice su vidljive samo autoriziranim korisnicima
    if (post.status === 'skica' && (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'editor' && post.authorId !== currentUser.id))) {
        return (
            <div className="post-not-found">
                <div className="not-found-content">
                    <i className="fas fa-lock"></i>
                    <h2>Članak nije dostupan</h2>
                    <p>Ovaj članak je u pripremi i trenutno nije javno dostupan.</p>
                    <Link to="/" className="btn btn-primary">
                        <i className="fas fa-arrow-left"></i>
                        Povratak na popis članaka
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="post-view">
            <div className="post-view-header">
                <button onClick={() => navigate(-1)} className="btn btn-secondary back-btn">
                    <i className="fas fa-arrow-left"></i>
                    Natrag na članke
                </button>

                {currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor' || post.authorId === currentUser.id) && (
                    <Link to={`/uredjivac/${post.id}`} className="btn btn-primary">
                        <i className="fas fa-edit"></i>
                        Uredi članak
                    </Link>
                )}
            </div>

            <article className="post-content">
                <header className="post-header">
                    <div className="post-meta">
                        <span className="post-date">
                            <i className="fas fa-calendar"></i>
                            Objavljeno: {new Date(post.createdAt).toLocaleDateString('hr-HR')}
                        </span>
                        <span className="post-author">
                            <i className="fas fa-user"></i>
                            Autor: {post.author}
                        </span>
                        <span className={`post-status ${post.status}`}>
                            {post.status === 'objavljen' ? <i className="fas fa-eye"></i> : <i className="fas fa-edit"></i>}
                            {post.status}
                        </span>
                    </div>
                </header>
                <h1 className="post-title">{post.title}</h1>
                {post.excerpt && (
                    <p className="post-excerpt">{post.excerpt}</p>
                )}
                <div className="post-body">
                    {post.content ? (
                        <div className="post-text">
                            {post.content.split('\n').map((paragraph, index) => (
                                paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-content">
                            <i className="fas fa-file-alt"></i>
                            <p>Ovaj članak još nema sadržaja.</p>
                        </div>
                    )}
                </div>

                <footer className="post-footer">
                    {post.updatedAt && post.updatedAt !== post.createdAt && (
                        <div className="post-updated">
                            <i className="fas fa-sync"></i>
                            Zadnje ažurirano: {new Date(post.updatedAt).toLocaleDateString('hr-HR')}
                        </div>
                    )}
                </footer>
            </article>
        </div>
    );
};

export default PostView;