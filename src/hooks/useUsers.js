import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/storage';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUsers = getFromStorage(STORAGE_KEYS.USERS, []);
        const lastUserId = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);

        setUsers(storedUsers);

        if (lastUserId) {
            const user = storedUsers.find(u => u.id === lastUserId);
            if (user) setCurrentUser(user);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) {
            saveToStorage(STORAGE_KEYS.USERS, users);
        }
    }, [users, loading]);

    useEffect(() => {
        if (!loading) {
            if (currentUser) {
                saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser.id);
            } else {
                saveToStorage(STORAGE_KEYS.CURRENT_USER, null);
            }
        }
    }, [currentUser, loading]);

    const addUser = (nombre) => {
        const newUser = {
            id: uuidv4(),
            nombre,
            fechaCreacion: new Date().toISOString()
        };
        setUsers(prev => [...prev, newUser]);
        // Don't auto-select, stay on selection screen
        return newUser;
    };

    const selectUser = (userId) => {
        const user = users.find(u => u.id === userId);
        if (user) setCurrentUser(user);
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return {
        users,
        currentUser,
        addUser,
        selectUser,
        logout,
        loading
    };
};
