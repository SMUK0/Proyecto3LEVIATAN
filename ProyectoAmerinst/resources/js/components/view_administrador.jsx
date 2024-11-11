import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import UsuariosApp from './usuariosapp.jsx';
import EstudiantesApp from './estudiantesapp.jsx';
import MateriasApp from './materiasapp.jsx';
import CursosApp from './cursosapp.jsx';
import MaestroCursosApp from './maestrocursosapp.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faSignOutAlt, faGraduationCap, faChalkboardTeacher, faBook, faClipboard, faSchool } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewAdministrador = () => {
    const [activeComponent, setActiveComponent] = useState('');
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.rol_id === 1) {
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const reloadComponent = () => {
        setActiveComponent('');
        setTimeout(() => setActiveComponent('maestrocurso'), 100);
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'usuarios':
                return <UsuariosApp />;
            case 'estudiantes':
                return <EstudiantesApp />;
            case 'materias':
                return <MateriasApp />;
            case 'cursos':
                return <CursosApp />;
            case 'maestrocurso':
                return <MaestroCursosApp onReload={reloadComponent} />;
            default:
                return <div className="text-center mt-5">
                            <h4>¡Bienvenido al panel de Administrador {user ? `${user.nombre} ${user.apellido}` : 'Administrador'}!</h4>
                            <p>Selecciona una opción en el menú para comenzar.</p>
                       </div>;
        }
    };

    return (
        <div className="d-flex">
            {/* Menú lateral */}
            <div className={`bg-dark text-white p-3 ${isMenuCollapsed ? 'collapsed-menu' : 'expanded-menu'}`} style={{ height: '100vh', transition: 'width 0.3s' }}>
                <div className="text-center mb-3">
                    <button className="btn btn-outline-light" onClick={toggleMenu}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </div>
                {!isMenuCollapsed && (
                    <div className="menu-options">
                        <h5 className="text-center mb-4">Menú</h5>
                        <ul className="nav flex-column">
                            {[{ label: 'Usuarios', value: 'usuarios', icon: faUser },
                              { label: 'Estudiantes', value: 'estudiantes', icon: faGraduationCap },
                              { label: 'Materias', value: 'materias', icon: faBook },
                              { label: 'Cursos', value: 'cursos', icon: faClipboard },
                              { label: 'Asignación de Curso', value: 'maestrocurso', icon: faChalkboardTeacher }
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
                            <FontAwesomeIcon icon={faSchool} className="me-2" />
                            Panel Administrador
                        </span>
                        <div ref={dropdownRef} className="ml-auto d-flex align-items-center">
                            <FontAwesomeIcon icon={faUser} size="lg" className="me-2" onClick={toggleDropdown} />
                            {isDropdownOpen && (
                                <div className="dropdown-menu dropdown-menu-right show position-absolute" style={{ top: '40px', right: '10px' }}>
                                    {user && (
                                        <div className="px-3 py-2">
                                            <p className="mb-1 fw-bold">{user.nombre} {user.apellido}</p>
                                            <p className="mb-2 text-muted">Rol: Administrador</p>
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
                
                <div className="p-4">
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
};

// Montaje manual para pruebas del administrador
window.onload = () => {
    const rootElement = document.getElementById('app');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<ViewAdministrador />);
    } else {
        console.error("No se encontró el contenedor con id 'app'");
    }
};

export default ViewAdministrador;
