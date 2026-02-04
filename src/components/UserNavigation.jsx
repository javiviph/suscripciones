import React, { useState } from 'react';
import { UserCircle, Plus, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { AnimatedButton } from './ui/AnimatedButton';
import { FluidInput } from './ui/FluidInput';

const UserNavigation = ({ users, currentUser, onSelect, onAdd, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newName.trim()) {
            onAdd(newName.trim());
            setNewName('');
            setIsCreating(false);
            setIsOpen(false);
        }
    };

    return (
        <div className="user-navigation">
            <button className="current-user-tab" onClick={() => setIsOpen(!isOpen)}>
                <UserCircle size={20} />
                <span>{currentUser ? currentUser.nombre : 'Usuario'}</span>
                <ChevronDown size={14} className={isOpen ? 'rotate' : ''} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="user-dropdown"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <GlassCard className="dropdown-content">
                            <div className="users-list">
                                {users.map(u => (
                                    <button
                                        key={u.id}
                                        className={`user-option ${currentUser?.id === u.id ? 'active' : ''}`}
                                        onClick={() => {
                                            onSelect(u.id);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <UserCircle size={16} />
                                        <span>{u.nombre}</span>
                                    </button>
                                ))}
                            </div>

                            {isCreating ? (
                                <form onSubmit={handleSubmit} className="new-user-form">
                                    <FluidInput
                                        label="Nombre"
                                        size="sm"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="mini-actions">
                                        <button type="button" onClick={() => setIsCreating(false)}>X</button>
                                        <button type="submit">OK</button>
                                    </div>
                                </form>
                            ) : (
                                <button className="user-option add-user" onClick={() => setIsCreating(true)}>
                                    <Plus size={16} />
                                    <span>Añadir usuario</span>
                                </button>
                            )}

                            <div className="dropdown-divider" />

                            <button className="user-option logout" onClick={() => {
                                onLogout();
                                setIsOpen(false);
                            }}>
                                <LogOut size={16} />
                                <span>Cerrar sesión</span>
                            </button>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .user-navigation {
                    position: relative;
                }
                .current-user-tab {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 20px;
                    color: var(--text-primary);
                    cursor: pointer;
                    transition: all 0.3s;
                    backdrop-filter: var(--glass-blur);
                }
                .current-user-tab:hover {
                    border-color: var(--accent-color);
                }
                .current-user-tab .rotate {
                    transform: rotate(180deg);
                }
                
                .user-dropdown {
                    position: absolute;
                    top: calc(100% + 12px);
                    right: 0;
                    width: 220px;
                    z-index: 1000;
                }
                .dropdown-content {
                    padding: 8px !important;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
                    background: var(--card-bg) !important;
                    backdrop-filter: blur(20px) !important;
                }
                [data-theme='dark'] .dropdown-content {
                    background: rgba(20, 20, 30, 0.95) !important;
                }
                [data-theme='light'] .dropdown-content {
                    background: rgba(255, 255, 255, 0.95) !important;
                }
                .users-list {
                    max-height: 200px;
                    overflow-y: auto;
                    margin-bottom: 4px;
                }
                .user-option {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    padding: 10px 12px;
                    background: transparent;
                    border: none;
                    border-radius: 8px;
                    color: var(--text-primary);
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                    text-align: left;
                }
                .user-option:hover {
                    background: rgba(255,255,255,0.08);
                }
                .user-option.active {
                    background: var(--accent-gradient);
                    color: white;
                }
                .user-option.active span {
                    font-weight: 600;
                }
                .add-user {
                    color: var(--text-secondary);
                    font-style: italic;
                }
                .logout {
                    color: #ff6b6b;
                    font-weight: 500;
                }
                .dropdown-divider {
                    height: 1px;
                    background: rgba(255,255,255,0.1);
                    margin: 4px 8px;
                }
                
                .new-user-form {
                    padding: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .mini-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                }
                .mini-actions button {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: var(--text-primary);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default UserNavigation;
