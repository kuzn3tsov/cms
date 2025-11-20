import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initialUsers, initialPosts } from './backend/data/mockData';
import { storageService } from './backend/services/api';
import './App.css';

// Frontend komponente
import Header from './frontend/components/Header.jsx';
import Dashboard from './frontend/components/Dashboard.jsx';
import PostList from './frontend/components/PostList.jsx';
import PostEditor from './frontend/components/PostEditor.jsx';
import UserManagement from './frontend/components/UserManagement.jsx';
import PostView from './frontend/components/PostView.jsx';

function App() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Učitaj početne podatke
  useEffect(() => {
    console.log('🔍 Loading initial data...');
    const savedPosts = storageService.getPosts() || initialPosts;
    const savedUsers = storageService.getUsers() || initialUsers;

    console.log('📦 Loaded posts:', savedPosts);
    console.log('👥 Loaded users:', savedUsers);

    setPosts(savedPosts);
    setUsers(savedUsers);
    setIsLoading(false);

    // Spremi demo korisnike ako ne postoje
    if (!storageService.getUsers()) {
      console.log('💾 Saving demo users to localStorage');
      storageService.saveUsers(initialUsers);
    }
  }, []);

  // Spremi članke u localStorage
  useEffect(() => {
    if (posts.length > 0) {
      storageService.savePosts(posts);
    }
  }, [posts]);

  // Spremi korisnike u localStorage
  useEffect(() => {
    if (users.length > 0) {
      storageService.saveUsers(users);
    }
  }, [users]);

  const handleLogin = (user) => {
    console.log('✅ Login successful for user:', user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    console.log('🚪 Logging out');
    setCurrentUser(null);
  };

  const addPost = (post) => {
    const newPost = {
      ...post,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      authorId: currentUser.id,
      author: currentUser.username
    };
    setPosts([...posts, newPost]);
  };

  const updatePost = (id, updatedPost) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, ...updatedPost } : post
    ));
  };

  const deletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  // Zaštićena ruta
  const ProtectedRoute = ({ children, requiredRoles }) => {
    if (!currentUser) {
      return <Navigate to="/" />;
    }

    if (requiredRoles && !requiredRoles.includes(currentUser.role)) {
      return <Navigate to="/" />;
    }

    return children;
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Učitavanje sustava...</p>
      </div>
    );
  }

  return (
    <Router basename="/cms">
      <div className="App">
        <Header
          currentUser={currentUser}
          users={users}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <PostList
                  posts={posts}
                  onDelete={deletePost}
                  onEdit={updatePost}
                  currentUser={currentUser}
                  isPublic={!currentUser}
                />
              }
            />

            <Route
              path="/nadzorna-ploca"
              element={
                <ProtectedRoute requiredRoles={['admin', 'editor']}>
                  <Dashboard posts={posts} currentUser={currentUser} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/uredjivac"
              element={
                <ProtectedRoute requiredRoles={['admin', 'editor', 'author']}>
                  <PostEditor
                    onSave={addPost}
                    posts={posts}
                    currentUser={currentUser}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/uredjivac/:id"
              element={
                <ProtectedRoute requiredRoles={['admin', 'editor', 'author']}>
                  <PostEditor
                    onSave={updatePost}
                    posts={posts}
                    currentUser={currentUser}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/korisnici"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <UserManagement
                    users={users}
                    setUsers={setUsers}
                    currentUser={currentUser}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/clanak/:id"
              element={
                <PostView
                  posts={posts}
                  currentUser={currentUser}
                  isPublic={!currentUser}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;