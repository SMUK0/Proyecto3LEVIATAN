import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import UsuariosApp from './usuariosapp.jsx';
import EstudiantesApp from './estudiantesapp.jsx';
import MateriasApp from './materiasapp.jsx';
import CursosApp from './cursosapp.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Íconos de usuario y menú
import styled from 'styled-components'; // Importamos styled-components

// Estilos para el contenedor principal
const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f4f4f9;
`;

// Estilos para el menú lateral
const Sidebar = styled.div`
  width: ${(props) => (props.isCollapsed ? '60px' : '250px')};
  background-color: #870e20;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: width 0.3s;
`;

// Estilos para los elementos del menú
const SidebarMenu = styled.div`
  padding: 20px;
`;

const MenuButton = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  width: 100%;
  text-align: left;
  padding: 10px 15px;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #a22835;
  }

  &:focus {
    outline: none;
  }
`;

// Botón para colapsar el menú
const ToggleButton = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  font-size: 24px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #a22835;
  }

  &:focus {
    outline: none;
  }
`;

// Contenedor de contenido
const ContentContainer = styled.div`
  flex: 1;
  padding: 40px;
  background-color: white;
  border-radius: 0 20px 20px 0;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

// Contenedor de usuario
const UserContainer = styled.div`
  position: relative;
  padding: 20px;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 15px;
  width: 200px;
`;

const UserInfo = styled.p`
  color: #870e20;
  margin: 10px 0;
`;

// Botón de cerrar sesión
const LogoutButton = styled.button`
  background-color: #d95b5e;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;

  &:hover {
    background-color: #a22835;
  }

  &:focus {
    outline: none;
  }
`;

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
    <MainContainer>
      <Sidebar isCollapsed={isMenuCollapsed}>
        <ToggleButton onClick={toggleMenu}>
          {isMenuCollapsed ? <FontAwesomeIcon icon={faBars} /> : <FontAwesomeIcon icon={faArrowLeft} />}
        </ToggleButton>
        {!isMenuCollapsed && (
          <SidebarMenu>
            <h2>Menú</h2>
            <MenuButton onClick={() => setActiveComponent('usuarios')}>Usuarios</MenuButton>
            <MenuButton onClick={() => setActiveComponent('estudiantes')}>Estudiantes</MenuButton>
            <MenuButton onClick={() => setActiveComponent('materias')}>Materias</MenuButton>
            <MenuButton onClick={() => setActiveComponent('cursos')}>Cursos</MenuButton>
          </SidebarMenu>
        )}
      </Sidebar>

      <ContentContainer>
        {renderComponent()}
      </ContentContainer>

      <UserContainer ref={dropdownRef}>
        <FontAwesomeIcon icon={faUser} size="2x" onClick={toggleDropdown} style={{ cursor: 'pointer' }} />
        {isDropdownOpen && (
          <Dropdown>
            <UserInfo>Usuario: {user?.nombre} {user?.apellido}</UserInfo>
            <UserInfo>Rol: {user?.rol === 1 ? 'Administrador' : user?.rol}</UserInfo>
            <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
          </Dropdown>
        )}
      </UserContainer>
    </MainContainer>
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
