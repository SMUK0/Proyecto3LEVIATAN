import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import AsistenciasApp from './asistenciasapp.jsx';
import NotasApp from './notasapp.jsx';
import NotificacionesApp from './notificacionesapp.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faSignOutAlt, faClipboardCheck, faFileAlt, faBell, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewMaestro = () => {
    const [activeComponent, setActiveComponent] = useState('');
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const dropdownRef = useRef(null);

    // Alternar el menú
    const toggleMenu = () => setIsMenuCollapsed(!isMenuCollapsed);

    // Cerrar sesión y redirigir
    const handleLogout = () => {
        fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' 
        })
        .then(response => {
            if (response.ok) {
                localStorage.removeItem('user');
                window.location.href = '/login';
            } else {
                console.error('Error al cerrar sesión');
            }
        })
        .catch(error => console.error('Error al cerrar sesión:', error));
    };

    // Alternar el menú desplegable del perfil
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    // Validación de usuario y rol
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.rol_id === 2) { 
            setUser(userData);
        } else {
            window.location.href = '/login';
        }
    }, []);

    // Renderizar el componente activo seleccionado
    const renderComponent = () => {
        switch (activeComponent) {
            case 'asistencias':
                return <AsistenciasApp />;
            case 'notas':
                return <NotasApp />;
            case 'notificaciones':
                return <NotificacionesApp />;
            default:
                return (
                    <div className="text-center mt-5">
                            <h4>¡Bienvenido al panel de Maestro {user ? `${user.nombre} ${user.apellido}` : 'Administrador'}!</h4>
                            <p>Seleccione una opción del menú para comenzar.</p>
                    </div>
                );
        }
    };

    return (
        <div className="d-flex">
            {/* Menú lateral */}
            <div className={`bg-primary text-white p-3 ${isMenuCollapsed ? 'collapsed-menu' : 'expanded-menu'}`} style={{ height: '100vh', transition: 'width 0.3s' }}>
                <div className="text-center mb-3">
                    <button className="btn btn-outline-light" onClick={toggleMenu}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </div>
                {!isMenuCollapsed && (
                    <div className="menu-options">
                        <h5 className="text-center mb-4">Menú Maestro</h5>
                        <ul className="nav flex-column">
                            {[{ label: 'Asistencias', value: 'asistencias', icon: faClipboardCheck },
                              { label: 'Notas', value: 'notas', icon: faFileAlt },
                              { label: 'Notificaciones', value: 'notificaciones', icon: faBell }
                            ].map((item) => (
                                <li key={item.value} className="nav-item mb-2">
                                    <button className="btn btn-outline-light w-100 d-flex align-items-center" onClick={() => setActiveComponent(item.value)}>
                                        <FontAwesomeIcon icon={item.icon} className="me-2" />
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Contenido dinámico */}
            <div className="flex-grow-1">
                <header className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-3">
                    <div className="container-fluid">
                        <span className="navbar-brand">
                            <FontAwesomeIcon icon={faChalkboardTeacher} className="me-2" />
                            Panel Maestro
                        </span>
                        <div ref={dropdownRef} className="ml-auto d-flex align-items-center">
                            <FontAwesomeIcon icon={faUser} size="lg" className="me-2" onClick={toggleDropdown} />
                            {isDropdownOpen && (
                                <div className="dropdown-menu dropdown-menu-right show position-absolute" style={{ top: '40px', right: '10px' }}>
                                    {user && (
                                        <div className="px-3 py-2">
                                            <p className="mb-1 fw-bold">{user.nombre} {user.apellido}</p>
                                            <p className="mb-2 text-muted">Rol: Maestro</p>
                                        </div>
                                    )}
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Renderización del componente seleccionado */}
                <div className="p-4">
                    {renderComponent()}
                </div>
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
