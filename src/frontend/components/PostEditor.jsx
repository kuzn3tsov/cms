import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostEditor.css';

const PostEditor = ({ onSave, posts, currentUser }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    if (!currentUser) {
        navigate('/');
        return null;
    }

    const [post, setPost] = useState({
        title: '',
        content: '',
        status: 'skica',
        excerpt: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditing) {
            const existingPost = posts.find(p => p.id === parseInt(id));
            if (existingPost) {
                if (currentUser.role !== 'admin' &&
                    currentUser.role !== 'editor' &&
                    existingPost.authorId !== currentUser.id) {
                    navigate('/');
                    return;
                }
                setPost(existingPost);
            }
        }
    }, [id, isEditing, posts, currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            if (isEditing) {
                const updatedPost = {
                    ...post,
                    updatedAt: new Date().toISOString()
                };
                onSave(parseInt(id), updatedPost);
            } else {
                const newPost = {
                    ...post,
                    authorId: currentUser.id,
                    author: currentUser.username
                };
                onSave(newPost);
            }
            navigate('/');
        } catch (error) {
            console.error('Greška pri spremanju članka:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field, value) => {
        setPost(prev => ({ ...prev, [field]: value }));
    };

    const handleCancel = () => {
        if (post.title || post.content) {
            const confirmLeave = window.confirm(
                'Imate nespremljene promjene. Jeste li sigurni da želite napustiti?'
            );
            if (!confirmLeave) return;
        }
        navigate('/');
    };

    return (
        <div className="post-editor">
            <div className="editor-header">
                <h1>
                    <i className={`fas ${isEditing ? 'fa-edit' : 'fa-plus'}`}></i>
                    {isEditing ? 'Uredi članak' : 'Stvori novi članak'}
                </h1>
                {isEditing && (
                    <div className="editor-info">
                        <span>
                            <i className="fas fa-calendar-plus"></i>
                            Stvoreno: {new Date(post.createdAt).toLocaleDateString('hr-HR')}
                        </span>
                        {post.updatedAt && post.updatedAt !== post.createdAt && (
                            <span>
                                <i className="fas fa-sync"></i>
                                Zadnje ažurirano: {new Date(post.updatedAt).toLocaleDateString('hr-HR')}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="post-title">
                        <i className="fas fa-heading"></i>
                        Naslov članka
                    </label>
                    <input
                        id="post-title"
                        type="text"
                        value={post.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="Unesite naslov članka"
                        required
                        autoComplete="off"
                        maxLength={200}
                    />
                    <div className="character-count">
                        {post.title.length}/200 znakova
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="post-excerpt">
                        <i className="fas fa-align-left"></i>
                        Sažetak
                    </label>
                    <textarea
                        id="post-excerpt"
                        value={post.excerpt}
                        onChange={(e) => handleChange('excerpt', e.target.value)}
                        placeholder="Kratki opis članka (opcionalno)"
                        rows="3"
                        maxLength={300}
                    />
                    <div className="character-count">
                        {post.excerpt.length}/300 znakova
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="post-content">
                        <i className="fas fa-file-alt"></i>
                        Sadržaj članka
                    </label>
                    <textarea
                        id="post-content"
                        value={post.content}
                        onChange={(e) => handleChange('content', e.target.value)}
                        placeholder="Napišite sadržaj vašeg članka ovdje..."
                        rows="15"
                        required
                        autoComplete="off"
                    />
                    <div className="character-count">
                        {post.content.length} znakova
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="post-status">
                        <i className="fas fa-tag"></i>
                        Status
                    </label>
                    <select
                        id="post-status"
                        value={post.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                    >
                        <option value="skica">Skica</option>
                        <option value="objavljen">Objavljen</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-secondary"
                        disabled={isSubmitting}
                    >
                        <i className="fas fa-times"></i>
                        Odustani
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        <i className={`fas ${isSubmitting ? 'fa-spinner fa-spin' : isEditing ? 'fa-save' : 'fa-plus'}`}></i>
                        {isSubmitting ? 'Spremanje...' : (isEditing ? 'Spremi promjene' : 'Stvori članak')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostEditor;