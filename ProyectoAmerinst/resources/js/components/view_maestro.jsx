import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import AsistenciasApp from './asistenciasapp.jsx';
import NotasApp from './notasapp.jsx';
import VerNotasApp from './VerNotasApp.jsx'; 
import VerAsistenciasApp from './VerAsistenciasApp.jsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowLeft, faArrowRight, faSignOutAlt, faClipboardCheck, faFileAlt, faBell, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

// Paleta de colores
const colors = {
  primary: '#007bff', // Azul brillante para elementos interactivos
  secondary: '#f8f9fa', // Fondo claro
  backgroundDark: '#343a40', // Fondo oscuro
  textLight: '#ffffff', // Texto en claro
  textDark: '#212529', // Texto en oscuro
  buttonHover: '#0056b3', // Hover de botones
  dropdown: '#f1f1f1', // Fondo del menú desplegable
  error: '#dc3545', // Rojo de error
};

const ViewMaestro = () => {
    const [activeComponent, setActiveComponent] = useState('');
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.rol_id === 2) { 
            setUser(userData);
        } else {
            window.location.href = '/login';
        }
    }, []);

    const toggleMenu = () => setIsMenuCollapsed(!isMenuCollapsed);

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

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    // Función para volver a la vista principal
    const goBackToHome = () => {
        setActiveComponent('');
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'asistencias':
                return <AsistenciasApp />;
            case 'notas':
                return <NotasApp />;
            case 'vernotas':
                return <VerNotasApp />;
            case 'verasistencias':
                return <VerAsistenciasApp />;
            default:
                return (
                    <div className="text-center mt-5 p-4" style={{
                        backgroundColor: colors.primary,
                        color: colors.textLight,
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                            ¡Bienvenido al panel de Maestro {user ? `${user.nombre} ${user.apellido}` : 'Administrador'}!
                        </h2>
                        <p style={{ fontSize: '1.25rem', marginTop: '20px' }}>
                            Selecciona una opción en el menú para comenzar.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: colors.secondary }}>
            {/* Menú lateral */}
            <div className={`bg-dark text-white p-3 ${isMenuCollapsed ? 'collapsed-menu' : 'expanded-menu'}`} style={{
                width: isMenuCollapsed ? '80px' : '250px',
                height: '100vh',
                transition: 'width 0.3s ease',
                overflow: 'hidden',
            }}>
                <div className="text-center mb-3">
                    <button className="btn btn-outline-light" onClick={toggleMenu} style={{ padding: '10px' }}>
                        <FontAwesomeIcon icon={isMenuCollapsed ? faArrowRight : faArrowLeft} />
                    </button>
                </div>
                {!isMenuCollapsed && (
                    <div className="menu-options">
                        <h5 className="text-center mb-4">Menú</h5>
                        <ul className="nav flex-column">
                            {[{ label: 'Asistencias', value: 'asistencias', icon: faClipboardCheck },
                              { label: 'Notas', value: 'notas', icon: faFileAlt },
                              { label: 'Ver Notas', value: 'vernotas', icon: faBell },
                              { label: 'Ver Asistencias', value: 'verasistencias', icon: faBell }, 
 
                            ].map((item) => (
                                <li key={item.value} className="nav-item mb-3">
                                    <button className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center" 
                                            onClick={() => setActiveComponent(item.value)} 
                                            style={{
                                                fontSize: '1.2rem', // Aumento del tamaño de la fuente
                                                padding: '12px',
                                                transition: 'background-color 0.3s ease',
                                                border: 'none',
                                                borderRadius: '8px',
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = colors.primary}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        <FontAwesomeIcon icon={item.icon} className="me-3" style={{ fontSize: '1.5rem' }} /> {/* Aumento del tamaño del icono */}
                                        <span className="w-100 text-center">{item.label}</span>
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
                        <span className="navbar-brand" 
                            style={{
                                color: colors.primary,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '1.5rem',
                                transition: 'transform 0.3s ease, color 0.3s ease',
                            }}
                            onClick={goBackToHome} // Llamada a la función que vuelve a la vista principal
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.1)';
                                e.target.style.color = '#0056b3';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.color = colors.primary;
                            }}
                        >
                            <FontAwesomeIcon icon={faChalkboardTeacher} className="me-2" />
                            Panel Maestro
                        </span>
                        <div ref={dropdownRef} className="ml-auto d-flex align-items-center">
                            <FontAwesomeIcon icon={faUser} size="lg" className="me-2" onClick={toggleDropdown} style={{
                                cursor: 'pointer',
                                borderRadius: '50%',
                                border: '3px solid black',
                                padding: '7px',
                                backgroundColor: '#fff',
                                transition: 'transform 0.3s ease',
                            }} />
                            {isDropdownOpen && (
                                <div className="dropdown-menu dropdown-menu-right show position-absolute" style={{
                                    top: '40px', 
                                    right: '10px', 
                                    backgroundColor: colors.dropdown,
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                }}>
                                    {user && (
                                        <div className="px-3 py-2">
                                            <p className="mb-1 fw-bold">{user.nombre} {user.apellido}</p>
                                            <p className="mb-2 text-muted">Maestro</p>
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

                {/* Contenido de la vista */}
                <div className="p-4" style={{
                    backgroundColor: colors.secondary,
                    height: 'calc(100vh - 80px)', 
                    overflowY: 'auto'
                }}>
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
};

// Montaje manual para pruebas del maestro
window.onload = () => {
    const rootElement = document.getElementById('app');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<ViewMaestro />);
    } else {
        console.error("No se encontró el contenedor con id 'app'");
    }
};

export default ViewMaestro;
