export const initialUsers = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        username: 'urednik',
        email: 'urednik@example.com',
        password: 'urednik123',
        role: 'editor',
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        username: 'autor',
        email: 'autor@example.com',
        password: 'autor123',
        role: 'author',
        createdAt: new Date().toISOString()
    }
];

export const initialPosts = [];