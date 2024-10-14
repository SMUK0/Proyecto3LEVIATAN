import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import AsistenciasApp from './asistenciasapp.jsx';
import NotasApp from './notasapp.jsx';
import NotificacionesApp from './notificacionesapp.jsx'; // Importamos NotificacionesApp
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const ViewMaestro = () => {
    const [activeComponent, setActiveComponent] = useState('');
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.rol === 2) {
            setUser(userData);
        } else {
            window.location.href = '/login';
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuCollapsed(!isMenuCollapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const renderComponent = () => {
        if (activeComponent === 'asistencias') {
            return <div id="crud-asistencias"><AsistenciasApp /></div>;
        } else if (activeComponent === 'notas') {
            return <div id="crud-notas"><NotasApp /></div>;
        } else if (activeComponent === 'notificaciones') {
            return <div id="crud-notificaciones"><NotificacionesApp /></div>;
        }
        return <div>Por favor selecciona una opción del menú</div>;
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{
                width: isMenuCollapsed ? '50px' : '250px',
                backgroundColor: '#f8f9fa',
                padding: isMenuCollapsed ? '10px' : '20px',
                transition: 'width 0.3s ease',
            }}>
                <button onClick={toggleMenu}>
                    {isMenuCollapsed ? '►' : '◄'}
                </button>
                {!isMenuCollapsed && (
                    <div>
                        <h2>Menú</h2>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            <li>
                                <button onClick={() => setActiveComponent('asistencias')}>
                                    Asistencias
                                </button>
                            </li>
                            <li>
                                <button onClick={() => setActiveComponent('notas')}>
                                    Notas
                                </button>
                            </li>
                            <li>
                                <button onClick={() => setActiveComponent('notificaciones')}>
                                    Notificaciones
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div style={{ flex: 1, padding: '20px' }}>
                {renderComponent()}
            </div>

            <div ref={dropdownRef}>
                <FontAwesomeIcon icon={faUser} size="2x" onClick={toggleDropdown} />
                {isDropdownOpen && (
                    <div>
                        <p>Usuario: {user?.nombre} {user?.apellido}</p>
                        <p>Rol: {user?.rol === 2 ? 'Maestro' : user?.rol}</p>
                        <button onClick={handleLogout}>Cerrar Sesión</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Montaje manual para pruebas del componente ViewMaestro
window.onload = () => {
    const rootElement = document.getElementById('app');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<ViewMaestro />);
    } else {
        console.error("No se encontró el contenedor con id 'app'");
    }
};

export default ViewMaestro;
