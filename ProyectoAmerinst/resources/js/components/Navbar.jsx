import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faBars, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

// Animación para el cambio de tamaño y sombra en el botón de cambio de modo
const ButtonHoverAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.7);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }
`;

// Animación para el botón de inicio de sesión (cambio de tamaño y color de fondo)
const LoginButtonHoverAnimation = keyframes`
  0% {
    transform: scale(1);
    background-color: ${({ darkMode }) => (darkMode ? '#f47573' : '#870e20')};
  }
  50% {
    transform: scale(1.05);
    background-color: ${({ darkMode }) => (darkMode ? '#ff6f61' : '#a22835')};
  }
  100% {
    transform: scale(1);
    background-color: ${({ darkMode }) => (darkMode ? '#f47573' : '#870e20')};
  }
`;

// Contenedor principal del Navbar
const NavbarContainer = styled.nav`
  background: ${({ darkMode }) =>
    darkMode
      ? 'linear-gradient(135deg, rgba(33, 33, 33, 0.8), rgba(34, 34, 34, 0.7))' // Color de fondo para dark mode
      : 'linear-gradient(135deg, rgba(135, 14, 32, 0.8), rgba(135, 14, 32, 0.8))'};  // Rojo oscuro
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px); /* Fondo translúcido */
  border-bottom: 2px solid ${({ darkMode }) => (darkMode ? '#444' : '#f56c56')}; /* Rojo claro */
`;

// Contenedor del logo
const Logo = styled.div`
  font-size: 3rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  color: white;
  transition: font-size 0.3s ease;

  img {
    height: 80px;
    margin-right: 20px;
    transition: transform 0.3s ease;
  }

  &:hover {
    font-size: 3.5rem;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4);
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

// Contenedor de botones derecho
const RightMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
`;

// Botón de cambio de modo oscuro/claro con animación al hacer hover
const ToggleButton = styled.button`
  background-color: ${({ darkMode }) => (darkMode ? '#f47573' : '#870e20')}; /* Rojo claro */
  color: white;
  border: none;
  padding: 14px;
  border-radius: 50%;
  font-size: 1.8rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  width: 60px;
  height: 60px;
  
  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#ff6f61' : '#a22835')}; /* Rojo más claro */
    animation: ${ButtonHoverAnimation} 0.6s ease-in-out infinite;
  }

  svg {
    /* No se necesita animación del ícono */
  }
`;

// Botón de inicio de sesión con animación al hacer hover
const LoginButton = styled.a`
  background-color: ${({ darkMode }) => (darkMode ? '#f47573' : '#870e20')}; /* Rojo claro */
  color: white;
  padding: 14px 35px;
  border-radius: 8px;
  font-size: 1.4rem;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  /* Animación cuando el cursor está sobre el botón */
  &:hover {
    animation: ${LoginButtonHoverAnimation} 0.6s ease-in-out infinite; /* Animación continua */
  }

  svg {
    font-size: 1.8rem; /* Aumentamos el tamaño del ícono */
  }
`;

// Botón hamburguesa para pantallas pequeñas
const HamburgerButton = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    color: white;
  }
`;

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Alternar el menú hamburguesa
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <NavbarContainer darkMode={darkMode}>
      {/* Logo */}
      <Logo>
        <img
          src="https://amerinst.edu.bo/wp-content/uploads/2022/01/LOGOpng_AMERINST-1024x1024.png"
          alt="Logo Colegio Amerinst"
        />
        Colegio Amerinst
      </Logo>

      {/* Enlaces de navegación y botones */}
      <RightMenu>
        <ToggleButton darkMode={darkMode} onClick={toggleDarkMode}>
          <FontAwesomeIcon icon={darkMode ? faMoon : faSun} />
        </ToggleButton>

        <LoginButton darkMode={darkMode} href="/login">
          <FontAwesomeIcon icon={faSignInAlt} />
          Iniciar Sesión
        </LoginButton>

        <HamburgerButton onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </HamburgerButton>
      </RightMenu>
    </NavbarContainer>
  );
};

export default Navbar;
