import React, { useState } from 'react';
import {
    Header,
    HeaderName,
    Content,
    Theme,
    Grid,
    Column,
    Button,
    Modal,
    InlineNotification,
    ContentSwitcher,
    Switch
} from '@carbon/react';
import { Settings, Add } from '@carbon/icons-react';
import Dashboard from './components/Dashboard';
import SubscriptionList from './components/SubscriptionList';
import SubscriptionForm from './components/SubscriptionForm';
import CategoryManager from './components/CategoryManager';
import { useSuscripciones } from './hooks/useSuscripciones';
import { useCategorias } from './hooks/useCategorias';

function App() {
    const { suscripciones, addSuscripcion, updateSuscripcion, deleteSuscripcion } = useSuscripciones();
    const { categorias, addCategoria, deleteCategoria } = useCategorias();

    const [activeTab, setActiveTab] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null); // ID of sub to delete
    const [notification, setNotification] = useState(null);

    const handleEdit = (sub) => {
        setEditingSubscription(sub);
        setIsAddModalOpen(true);
    };

    const handleSave = (data) => {
        if (editingSubscription) {
            // Check if price changed to ask history? 
            // For now, auto-save history if price changed is valid logic or we can add that specific interaction later.
            // Let's just pass true for now if price differs, or handle inside hook.
            const priceChanged = data.precio !== editingSubscription.precio;
            updateSuscripcion(editingSubscription.id, data, priceChanged);
            showNotification('success', 'Suscripción actualizada correctamente');
        } else {
            addSuscripcion(data);
            showNotification('success', 'Suscripción añadida correctamente');
        }
        setIsAddModalOpen(false);
        setEditingSubscription(null);
    };

    const handleDeleteClick = (sub) => {
        setDeleteConfirmation(sub);
    };

    const confirmDelete = () => {
        if (deleteConfirmation) {
            deleteSuscripcion(deleteConfirmation.id);
            showNotification('success', 'Suscripción eliminada');
            setDeleteConfirmation(null);
        }
    };

    const showNotification = (kind, message) => {
        setNotification({ kind, message, id: Date.now() });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <Theme theme="white">
            <Header aria-label="Gestor de Suscripciones">
                <HeaderName href="#" prefix="">
                    Gestor de Suscripciones
                </HeaderName>
            </Header>
            <Content>
                <div className="app-container">
                    {notification && (
                        <div className="notification-container">
                            <InlineNotification
                                kind={notification.kind}
                                title={notification.message}
                                onClose={() => setNotification(null)}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '1rem' }}>
                        <Button kind="ghost" renderIcon={Settings} onClick={() => setIsCategoryModalOpen(true)}>
                            Gestionar Categorías
                        </Button>
                        <Button renderIcon={Add} onClick={() => { setEditingSubscription(null); setIsAddModalOpen(true); }}>
                            Añadir Suscripción
                        </Button>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <ContentSwitcher onChange={({ index }) => setActiveTab(index)}>
                            <Switch name="dashboard" text="Dashboard" />
                            <Switch name="subscription-list" text="Mis Suscripciones" />
                        </ContentSwitcher>
                    </div>

                    {activeTab === 0 ? (
                        <Dashboard suscripciones={suscripciones} categorias={categorias} />
                    ) : (
                        <SubscriptionList
                            suscripciones={suscripciones}
                            categorias={categorias}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                            onAdd={() => { setEditingSubscription(null); setIsAddModalOpen(true); }}
                        />
                    )}

                    <SubscriptionForm
                        open={isAddModalOpen}
                        subscription={editingSubscription}
                        categories={categorias}
                        onClose={() => { setIsAddModalOpen(false); setEditingSubscription(null); }}
                        onSave={handleSave}
                    />

                    <CategoryManager
                        open={isCategoryModalOpen}
                        categories={categorias}
                        onClose={() => setIsCategoryModalOpen(false)}
                        onAdd={addCategoria}
                        onDelete={deleteCategoria} // Ideally check for usage
                    />

                    <Modal
                        open={!!deleteConfirmation}
                        danger
                        modalHeading="Eliminar suscripción"
                        modalLabel="Esta acción es irreversible"
                        primaryButtonText="Eliminar"
                        secondaryButtonText="Cancelar"
                        onRequestSubmit={confirmDelete}
                        onSecondarySubmit={() => setDeleteConfirmation(null)}
                        onRequestClose={() => setDeleteConfirmation(null)}
                    >
                        <p>¿Estás seguro de que quieres eliminar la suscripción <strong>{deleteConfirmation?.nombre}</strong>?</p>
                    </Modal>
                </div>
            </Content>
            <style>{`
            .app-container { max-width: 1200px; margin: 0 auto; }
            .notification-container { position: fixed; top: 3.5rem; right: 1rem; z-index: 9000; }
        `}</style>
        </Theme>
    );
}

export default App;
