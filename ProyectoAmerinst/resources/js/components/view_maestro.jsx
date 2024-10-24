import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import AsistenciasApp from './asistenciasapp.jsx';
import NotasApp from './notasapp.jsx';
import NotificacionesApp from './notificacionesapp.jsx'; // Importamos NotificacionesApp
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

// Estilos para el contenedor principal
const Container = styled.div`
    display: flex;
    height: 100vh;
    background-color: #f4f4f9;
`;

// Estilos para el menú lateral
const Sidebar = styled.div`
    width: ${({ isCollapsed }) => (isCollapsed ? '50px' : '250px')};
    background-color: #870e20;
    color: white;
    padding: ${({ isCollapsed }) => (isCollapsed ? '10px' : '20px')};
    transition: width 0.3s ease;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

// Estilos para los botones del menú
const MenuButton = styled.button`
    width: 100%;
    background: none;
    border: none;
    padding: 10px;
    text-align: left;
    cursor: pointer;
    font-size: 16px;
    color: white;
    margin-bottom: 10px;
    border-radius: 5px;

    &:hover {
        background-color: #a22835;
    }
`;

// Estilos para el título del menú
const MenuTitle = styled.h2`
    color: white;
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
    text-align: center;
`;

// Estilos para el área principal
const MainArea = styled.div`
    flex: 1;
    padding: 20px;
    background-color: #f4f4f9;
    border-left: 1px solid #ccc;
`;

// Estilos para el contenedor de usuario
const UserDropdown = styled.div`
    position: relative;
    margin-left: auto;
    padding: 10px;
`;

// Estilos para el menú desplegable
const DropdownMenu = styled.div`
    position: absolute;
    top: 40px;
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1;
    padding: 10px;
    border-radius: 5px;
    width: 200px;
`;

// Estilos para el botón de cerrar sesión
const LogoutButton = styled.button`
    background-color: #870e20;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    width: 100%;
    border-radius: 5px;
    margin-top: 10px;

    &:hover {
        background-color: #a22835;
    }
`;

// Estilos para el icono de usuario
const UserIcon = styled(FontAwesomeIcon)`
    color: #870e20;
    cursor: pointer;

    &:hover {
        color: #a22835;
    }
`;

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
        <Container>
            <Sidebar isCollapsed={isMenuCollapsed}>
                <MenuButton onClick={toggleMenu}>
                    {isMenuCollapsed ? '►' : '◄'}
                </MenuButton>
                {!isMenuCollapsed && (
                    <div>
                        <MenuTitle>Menú</MenuTitle>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            <li>
                                <MenuButton onClick={() => setActiveComponent('asistencias')}>
                                    Asistencias
                                </MenuButton>
                            </li>
                            <li>
                                <MenuButton onClick={() => setActiveComponent('notas')}>
                                    Notas
                                </MenuButton>
                            </li>
                            <li>
                                <MenuButton onClick={() => setActiveComponent('notificaciones')}>
                                    Notificaciones
                                </MenuButton>
                            </li>
                        </ul>
                    </div>
                )}
            </Sidebar>

            <MainArea>
                {renderComponent()}
            </MainArea>

            <UserDropdown ref={dropdownRef}>
                <UserIcon icon={faUser} size="2x" onClick={toggleDropdown} />
                {isDropdownOpen && (
                    <DropdownMenu>
                        <p>Usuario: {user?.nombre} {user?.apellido}</p>
                        <p>Rol: {user?.rol === 2 ? 'Maestro' : user?.rol}</p>
                        <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
                    </DropdownMenu>
                )}
            </UserDropdown>
        </Container>
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
