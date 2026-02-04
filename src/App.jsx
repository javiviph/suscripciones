import React, { useState, useEffect } from 'react';
import { Plus, Sun, Moon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import SubscriptionList from './components/SubscriptionList';
import SubscriptionForm from './components/SubscriptionForm';
import CategoryManager from './components/CategoryManager';
import { useSuscripciones } from './hooks/useSuscripciones';
import { useCategorias } from './hooks/useCategorias';
import { AnimatedButton } from './components/ui/AnimatedButton';
import { GlassCard } from './components/ui/GlassCard';

function App() {
    const { suscripciones, addSuscripcion, updateSuscripcion, deleteSuscripcion } = useSuscripciones();
    const { categorias, addCategoria, deleteCategoria } = useCategorias();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState(null);
    // Notification state simplified for now (can add Toast component later)

    // Derived state for desktop vs mobile check could be added here or handled via CSS
    // For now, we rely on CSS media queries for layout

    const handleEdit = (sub) => {
        setEditingSubscription(sub);
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingSubscription(null);
    };

    const handleSaveSuscripcion = (data) => {
        if (editingSubscription) {
            updateSuscripcion(editingSubscription.id, data);
        } else {
            addSuscripcion(data);
        }
        handleCloseModal();
    };

    const [theme, setTheme] = useState('light');

    // Theme Effect
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="app-layout">
            <header className="app-header">
                <div className="header-content">
                    <h1>Suscriptions</h1>
                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </header>

            <main className="main-grid">
                <div className="content-column">
                    <section className="dashboard-section">
                        <Dashboard suscripciones={suscripciones} categorias={categorias} />
                    </section>

                    <section className="list-section">
                        <div className="section-header">
                            <h2>Mis Suscripciones</h2>
                        </div>
                        <SubscriptionList
                            suscripciones={suscripciones}
                            categorias={categorias}
                            onEdit={handleEdit}
                            onDelete={(id) => deleteSuscripcion(id)}
                        />
                    </section>
                </div>

                <div className="desktop-form-column">
                    <div className="sticky-form">
                        <GlassCard>
                            <h3>{editingSubscription ? 'Editar Suscripción' : 'Nueva Suscripción'}</h3>
                            <SubscriptionForm
                                key={editingSubscription ? editingSubscription.id : 'new'}
                                categories={categorias}
                                onAdd={handleSaveSuscripcion}
                                onAddCategory={addCategoria}
                                initialData={editingSubscription}
                            />
                        </GlassCard>
                    </div>
                </div>
            </main>

            {/* Mobile FAB */}
            <motion.div
                className="mobile-fab-container"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
            >
                <button className="fab-button" onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={24} />
                </button>
            </motion.div>

            {/* Mobile Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <GlassCard className="modal-content">
                            <div className="modal-header">
                                <h3>{editingSubscription ? 'Editar Suscripción' : 'Nueva Suscripción'}</h3>
                                <button className="close-btn" onClick={handleCloseModal}><X size={20} /></button>
                            </div>
                            <SubscriptionForm
                                key={editingSubscription ? `modal-${editingSubscription.id}` : 'modal-new'}
                                categories={categorias}
                                onAdd={handleSaveSuscripcion}
                                onAddCategory={addCategoria}
                                initialData={editingSubscription}
                            />
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .app-layout {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 24px;
                    min-height: 100vh;
                }
                .app-header {
                    margin-bottom: 40px;
                    padding: 8px 0;
                }
                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .header-content h1 {
                    font-size: 2rem;
                    font-weight: 800;
                    background: var(--accent-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0;
                    letter-spacing: -0.02em;
                }
                .theme-toggle {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    color: var(--text-primary);
                    padding: 12px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: var(--glass-blur);
                }
                .theme-toggle:hover {
                    transform: rotate(12deg) scale(1.1);
                    border-color: var(--accent-color);
                }

                .main-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 32px;
                }

                .desktop-form-column {
                    display: none;
                }

                .sticky-form {
                    position: sticky;
                    top: 24px;
                }

                .dashboard-section {
                    margin-bottom: 48px;
                }

                .section-header h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 24px;
                    color: var(--text-primary);
                }

                /* Mobile FAB */
                .mobile-fab-container {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 90;
                }
                .fab-button {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: var(--accent-gradient);
                    border: none;
                    color: white;
                    box-shadow: 0 8px 32px rgba(255, 87, 34, 0.4);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                .fab-button:active {
                    transform: scale(0.9);
                }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.4);
                    backdrop-filter: blur(12px);
                    z-index: 100;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-content {
                    width: 100%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .modal-header h3 {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 700;
                }

                /* DESKTOP QUERIES */
                @media (min-width: 1024px) {
                    .main-grid {
                        grid-template-columns: 1fr 380px;
                        align-items: start;
                    }
                    .desktop-form-column {
                        display: block;
                    }
                    .mobile-fab-container {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}

export default App;
