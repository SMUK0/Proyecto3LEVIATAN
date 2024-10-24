import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import AsistenciasApp from './asistenciasapp.jsx';
import NotasApp from './notasapp.jsx';
import NotificacionesApp from './notificacionesapp.jsx'; // Importamos NotificacionesApp
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

// Contenedor principal
const Container = styled.div`
  display: flex;
  height: 100vh;
`;

// Menú lateral
const Sidebar = styled.div`
  width: ${(props) => (props.collapsed ? '50px' : '250px')};
  background-color: #870e20;
  padding: ${(props) => (props.collapsed ? '10px' : '20px')};
  transition: width 0.3s ease;
  color: white;
`;

// Botón para colapsar el menú
const CollapseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 10px;

  &:hover {
    color: #f4f4f9;
  }
`;

// Lista de opciones del menú
const MenuList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MenuItem = styled.li`
  margin-bottom: 15px;

  button {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    padding: 10px;
    border-radius: 8px;
    width: 100%;
    text-align: left;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #a22835;
    }
  }
`;

// Contenedor del contenido principal
const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f4f4f9;
`;

// Menú desplegable del usuario
const UserDropdown = styled.div`
  position: relative;
  margin-left: auto;
`;

const UserMenu = styled.div`
  background-color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 8px;
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 100;

  p {
    margin: 0;
    margin-bottom: 10px;
    font-size: 16px;
  }

  button {
    background-color: #870e20;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #a22835;
    }
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
      <Sidebar collapsed={isMenuCollapsed}>
        <CollapseButton onClick={toggleMenu}>
          {isMenuCollapsed ? '►' : '◄'}
        </CollapseButton>
        {!isMenuCollapsed && (
          <>
            <h2>Menú</h2>
            <MenuList>
              <MenuItem>
                <button onClick={() => setActiveComponent('asistencias')}>
                  Asistencias
                </button>
              </MenuItem>
              <MenuItem>
                <button onClick={() => setActiveComponent('notas')}>
                  Notas
                </button>
              </MenuItem>
              <MenuItem>
                <button onClick={() => setActiveComponent('notificaciones')}>
                  Notificaciones
                </button>
              </MenuItem>
            </MenuList>
          </>
        )}
      </Sidebar>

      <MainContent>
        {renderComponent()}
      </MainContent>

      <UserDropdown ref={dropdownRef}>
        <FontAwesomeIcon icon={faUser} size="2x" onClick={toggleDropdown} />
        {isDropdownOpen && (
          <UserMenu>
            <p>Usuario: {user?.nombre} {user?.apellido}</p>
            <p>Rol: {user?.rol === 2 ? 'Maestro' : user?.rol}</p>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </UserMenu>
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
