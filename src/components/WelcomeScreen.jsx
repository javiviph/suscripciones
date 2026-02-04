import React, { useState } from 'react';
import { UserCircle, Plus, Users, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { AnimatedButton } from './ui/AnimatedButton';
import { FluidInput } from './ui/FluidInput';

const WelcomeScreen = ({ users, onSelect, onAdd }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newName.trim()) {
            onAdd(newName.trim());
            setNewName('');
            setIsCreating(false); // Go back to user grid
        }
    };

    return (
        <div className="welcome-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="welcome-container"
            >
                <div className="welcome-header">
                    <h1>Suscriptions</h1>
                    <p>Gestiona todas tus cuotas en un solo lugar</p>
                </div>

                <GlassCard className="welcome-card">
                    {users.length > 0 && !isCreating ? (
                        <div className="user-selection">
                            <h3>¿Quién eres hoy?</h3>
                            <div className="users-grid">
                                {users.map(u => (
                                    <motion.button
                                        key={u.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="user-btn"
                                        onClick={() => onSelect(u.id)}
                                    >
                                        <div className="user-avatar">
                                            {u.nombre.charAt(0).toUpperCase()}
                                        </div>
                                        <span>{u.nombre}</span>
                                    </motion.button>
                                ))}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="user-btn add-btn"
                                    onClick={() => setIsCreating(true)}
                                >
                                    <div className="user-avatar add">
                                        <Plus size={24} />
                                    </div>
                                    <span>Nuevo</span>
                                </motion.button>
                            </div>
                        </div>
                    ) : (
                        <div className="create-user">
                            <h3>Crea tu perfil</h3>
                            <form onSubmit={handleSubmit} className="create-form">
                                <FluidInput
                                    label="Tu Nombre"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    autoFocus
                                />
                                <div className="form-buttons">
                                    {users.length > 0 && (
                                        <button type="button" className="back-btn" onClick={() => setIsCreating(false)}>
                                            Volver
                                        </button>
                                    )}
                                    <AnimatedButton type="submit" size="lg" className="submit-btn" disabled={!newName.trim()}>
                                        Empezar <ArrowRight size={18} />
                                    </AnimatedButton>
                                </div>
                            </form>
                        </div>
                    )}
                </GlassCard>
            </motion.div>

            <style>{`
                .welcome-screen {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    background: radial-gradient(circle at top right, var(--accent-color) -50%, transparent 40%),
                                radial-gradient(circle at bottom left, var(--accent-color) -50%, transparent 40%);
                }
                .welcome-container {
                    width: 100%;
                    max-width: 500px;
                }
                .welcome-header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .welcome-header h1 {
                    font-size: 3.5rem;
                    font-weight: 900;
                    margin: 0;
                    background: var(--accent-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    letter-spacing: -0.05em;
                }
                .welcome-header p {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                    margin-top: 8px;
                }
                .welcome-card {
                    padding: 32px !important;
                }
                h3 {
                    margin: 0 0 24px 0;
                    font-size: 1.25rem;
                    text-align: center;
                }
                .users-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 20px;
                }
                .user-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: var(--text-primary);
                }
                .user-avatar {
                    width: 72px;
                    height: 72px;
                    border-radius: 24px;
                    background: var(--accent-gradient);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: white;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                }
                .user-avatar.add {
                    background: rgba(255,255,255,0.1);
                    border: 2px dashed var(--text-secondary);
                    color: var(--text-primary);
                }
                [data-theme='light'] .user-avatar.add {
                    background: rgba(0,0,0,0.05);
                    border-color: rgba(0,0,0,0.3);
                }
                .user-btn span {
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                
                .create-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }
                .form-buttons {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 16px;
                }
                .back-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                }
                .submit-btn {
                    flex: 1;
                }
            `}</style>
        </div>
    );
};

export default WelcomeScreen;
