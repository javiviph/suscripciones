import React from 'react';
import { UserCircle, Users } from 'lucide-react';

const UserNavigation = ({ currentUser, onLogout }) => {
    return (
        <div className="user-navigation">
            <div className="current-user-display">
                <UserCircle size={20} />
                <span>{currentUser ? currentUser.nombre : 'Usuario'}</span>
            </div>
            <button className="switch-user-btn" onClick={onLogout}>
                <Users size={18} />
                <span>Cambiar usuario</span>
            </button>

            <style>{`
                .user-navigation {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .current-user-display {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 12px;
                    color: var(--text-primary);
                    font-weight: 600;
                    font-size: 0.9rem;
                    backdrop-filter: var(--glass-blur);
                }
                .switch-user-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 12px;
                    color: var(--text-primary);
                    font-weight: 500;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    backdrop-filter: var(--glass-blur);
                }
                .switch-user-btn:hover {
                    border-color: var(--accent-color);
                    background: rgba(255, 87, 34, 0.1);
                }
                @media (max-width: 640px) {
                    .switch-user-btn span {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default UserNavigation;
