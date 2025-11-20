import React from 'react';
import './Dashboard.css';

const Dashboard = ({ posts, currentUser }) => {
    if (!currentUser) {
        return (
            <div className="access-denied">
                <h2>Molimo prijavite se</h2>
                <p>Morate biti prijavljeni za pregled nadzorne ploče.</p>
            </div>
        );
    }

    const getUserPosts = () => {
        if (currentUser.role === 'admin' || currentUser.role === 'editor') {
            return posts;
        }
        return posts.filter(post => post.authorId === currentUser.id);
    };

    const userPosts = getUserPosts();
    const publishedPosts = userPosts.filter(post => post.status === 'objavljen');
    const draftPosts = userPosts.filter(post => post.status === 'skica');

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Nadzorna ploča</h1>
                <div className="user-welcome">
                    <strong>{currentUser.username}</strong>
                    <span className={`role-badge ${currentUser.role}`}>
                        <i className={`fas ${currentUser.role === 'admin' ? 'fa-crown' :
                                currentUser.role === 'editor' ? 'fa-edit' :
                                    'fa-user-edit'
                            }`}></i>
                        {currentUser.role}
                    </span>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-file-alt"></i>
                    </div>
                    <h3>Moji članci</h3>
                    <p className="stat-number">{userPosts.length}</p>
                    <p className="stat-description">Ukupno članaka</p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon published">
                        <i className="fas fa-eye"></i>
                    </div>
                    <h3>Objavljeni</h3>
                    <p className="stat-number">{publishedPosts.length}</p>
                    <p className="stat-description">Vidljivi čitateljima</p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon draft">
                        <i className="fas fa-edit"></i>
                    </div>
                    <h3>Skice</h3>
                    <p className="stat-number">{draftPosts.length}</p>
                    <p className="stat-description">Članci u pripremi</p>
                </div>
                {currentUser.role === 'admin' && (
                    <div className="stat-card">
                        <div className="stat-icon admin">
                            <i className="fas fa-chart-bar"></i>
                        </div>
                        <h3>Ukupno članaka</h3>
                        <p className="stat-number">{posts.length}</p>
                        <p className="stat-description">Svi članci u sustavu</p>
                    </div>
                )}
            </div>

            <div className="recent-posts">
                <div className="section-header">
                    <h3>
                        <i className="fas fa-clock"></i>
                        Nedavni članci
                    </h3>
                    <span className="section-count">{userPosts.length} članaka</span>
                </div>

                {userPosts.slice(0, 5).map(post => (
                    <div key={post.id} className="post-preview">
                        <div className="post-info">
                            <h4>{post.title}</h4>
                            <span className={`status ${post.status}`}>
                                {post.status === 'objavljen' ?
                                    <><i className="fas fa-eye"></i> Objavljen</> :
                                    <><i className="fas fa-edit"></i> Skica</>
                                }
                            </span>
                        </div>
                        <div className="post-meta">
                            <span>
                                <i className="fas fa-calendar"></i>
                                {new Date(post.createdAt).toLocaleDateString('hr-HR')}
                            </span>
                            {currentUser.role === 'admin' && (
                                <span>
                                    <i className="fas fa-user"></i>
                                    {post.author}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
                {userPosts.length === 0 && (
                    <div className="no-posts">
                        <i className="fas fa-file-alt"></i>
                        <p>Još nema članaka. Stvorite svoj prvi članak!</p>
                    </div>
                )}
            </div>

            <div className="quick-actions">
                <h3>Brze radnje</h3>
                <div className="actions-grid">
                    <a href="/uredjivac" className="action-card">
                        <div className="action-icon primary">
                            <i className="fas fa-plus"></i>
                        </div>
                        <h4>Novi članak</h4>
                        <p>Stvorite novi članak</p>
                    </a>
                    <a href="/" className="action-card">
                        <div className="action-icon secondary">
                            <i className="fas fa-list"></i>
                        </div>
                        <h4>Svi članci</h4>
                        <p>Pregledajte sve članke</p>
                    </a>
                    {currentUser.role === 'admin' && (
                        <a href="/korisnici" className="action-card">
                            <div className="action-icon admin">
                                <i className="fas fa-users"></i>
                            </div>
                            <h4>Upravljanje korisnicima</h4>
                            <p>Upravljajte korisničkim računima</p>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;