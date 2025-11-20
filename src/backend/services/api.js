const STORAGE_KEYS = {
    USERS: 'cms-korisnici',
    POSTS: 'cms-clanci'
};

export const storageService = {
    saveData: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Greška pri spremanju podataka:', error);
            return false;
        }
    },

    loadData: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Greška pri učitavanju podataka:', error);
            return null;
        }
    },

    getUsers: () => {
        return storageService.loadData(STORAGE_KEYS.USERS);
    },

    saveUsers: (users) => {
        return storageService.saveData(STORAGE_KEYS.USERS, users);
    },

    getPosts: () => {
        return storageService.loadData(STORAGE_KEYS.POSTS);
    },

    savePosts: (posts) => {
        return storageService.saveData(STORAGE_KEYS.POSTS, posts);
    }
};

export const authService = {
    login: (username, password, users) => {
        const user = users.find(u =>
            u.username.toLowerCase() === username.toLowerCase() &&
            u.password === password
        );
        return user || null;
    },

    hasAccess: (user, requiredRoles) => {
        if (!user) return false;
        return requiredRoles.includes(user.role);
    }
};