import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import UsuariosApp from './usuariosapp.jsx';
import EstudiantesApp from './estudiantesapp.jsx';
import MateriasApp from './materiasapp.jsx';
import CursosApp from './cursosapp.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Importamos el ícono de usuario

const ViewAdministrador = () => {
    const [activeComponent, setActiveComponent] = useState('');
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.rol === 1) {
            setUser(userData);
        } else {
            // Si no está logueado o no tiene rol de administrador, redirige al login
            window.location.href = '/login';
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuCollapsed(!isMenuCollapsed);
    };

    const handleLogout = () => {
        // Elimina el usuario de localStorage y redirige al login
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Cierra el menú si se hace clic fuera de él
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
        if (activeComponent === 'usuarios') {
            return <UsuariosApp />;
        } else if (activeComponent === 'estudiantes') {
            return <EstudiantesApp />;
        } else if (activeComponent === 'materias') {
            return <MateriasApp />;
        } else if (activeComponent === 'cursos') {
            return <CursosApp />;
        }
        return <div>Por favor selecciona una opción del menú</div>;
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Menú lateral colapsable */}
            <div>
                {/* Botón para colapsar/expandir el menú */}
                <button onClick={toggleMenu}>
                    {isMenuCollapsed ? '►' : '◄'}
                </button>
                {!isMenuCollapsed && (
                    <div>
                        <h2>Menú</h2>
                        <ul>
                            <li>
                                <button onClick={() => setActiveComponent('usuarios')}>
                                    Usuarios
                                </button>
                            </li>
                            <li>
                                <button onClick={() => setActiveComponent('estudiantes')}>
                                    Estudiantes
                                </button>
                            </li>
                            <li>
                                <button onClick={() => setActiveComponent('materias')}>
                                    Materias
                                </button>
                            </li>
                            <li>
                                <button onClick={() => setActiveComponent('cursos')}>
                                    Cursos
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Contenido dinámico */}
            <div>
                {renderComponent()}
            </div>

            {/* Menú desplegable de usuario */}
            <div ref={dropdownRef}>
                <FontAwesomeIcon icon={faUser} size="2x" onClick={toggleDropdown} />
                {isDropdownOpen && (
                    <div>
                        <p>Usuario: {user.nombre} {user.apellido}</p>
                        <p>Rol: {user.rol === 1 ? 'Administrador' : user.rol}</p>
                        <button onClick={handleLogout}>
                            Cerrar Sesión
                        </button>
                    </div>
                )}
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
