import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faBars } from '@fortawesome/free-solid-svg-icons';

// Contenedor principal del Navbar
const NavbarContainer = styled.nav`
  background-color: ${({ darkMode }) => (darkMode ? '#1a1a1a' : '#a22835')};
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between; /* Ajusta la alineación */
  align-items: center;
  transition: background-color 0.3s ease;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

// Contenedor del logo
const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  color: white;

  img {
    height: 40px;
    margin-right: 10px;
  }
`;

// Contenedor para el switch y el menú hamburguesa en pantallas pequeñas
const RightMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Añade espacio entre el switch y el menú hamburguesa */

  @media (min-width: 769px) {
    justify-content: flex-end;
  }
`;

// Lista de navegación
const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  margin: 0;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px;
    right: 0;
    background-color: ${({ darkMode }) => (darkMode ? '#1e1e1e' : '#b2283a')}; /* Color diferenciado */
    width: 200px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1001;
  }
`;

// Estilo para los enlaces del Navbar
const NavItem = styled.li`
  margin: 0 15px;
  a {
    text-decoration: none;
    color: white;
    font-size: 1rem;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ darkMode }) => (darkMode ? '#f47573' : '#f9f9f9')};
    }
  }

  @media (max-width: 768px) {
    margin: 10px 0;
    a {
      color: ${({ darkMode }) => (darkMode ? '#f47573' : '#f9f9f9')};
    }
  }
`;

// Estilo para los botones Sign In y Sign Up
const Button = styled.a`
  background-color: ${({ darkMode, primary }) =>
    primary ? (darkMode ? '#f47573' : '#870e20') : 'transparent'};
  color: white;
  border: ${({ primary }) => (primary ? 'none' : '2px solid white')};
  padding: 10px 20px;
  border-radius: 5px;
  margin-left: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${({ darkMode, primary }) =>
      primary ? (darkMode ? '#ff6f61' : '#a22835') : (darkMode ? '#333' : '#fff')};
    color: ${({ primary }) => (primary ? '#fff' : '#870e20')};
  }

  @media (max-width: 768px) {
    width: 100%; /* Ocupa todo el ancho en pantallas pequeñas */
    margin: 10px 0;
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

// Contenedor del switch de modo oscuro/claro
const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  @media (min-width: 769px) {
    margin-left: 15px;
  }
`;

// Iconos de sol y luna para el switch
const Icon = styled(FontAwesomeIcon)`
  font-size: 1.2rem;
  color: ${({ darkMode }) => (darkMode ? '#f47573' : '#f9f9f9')};
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

      {/* Enlaces de navegación */}
      <NavLinks isOpen={isOpen} darkMode={darkMode}>
        <NavItem darkMode={darkMode}>
          <a href="#history">Historia</a>
        </NavItem>
        <NavItem darkMode={darkMode}>
          <a href="#education">Educación</a>
        </NavItem>
        <NavItem darkMode={darkMode}>
          <a href="#pillars">Pilares</a>
        </NavItem>
        <Button darkMode={darkMode} primary href="#sign-up">
          Sign Up
        </Button>
        <Button darkMode={darkMode} href="#sign-in">
          Sign In
        </Button>
      </NavLinks>

      {/* Botón hamburguesa + Switch modo oscuro */}
      <RightMenu>
        <SwitchContainer onClick={toggleDarkMode}>
          <Icon icon={darkMode ? faMoon : faSun} darkMode={darkMode} />
        </SwitchContainer>
        <HamburgerButton onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </HamburgerButton>
      </RightMenu>
    </NavbarContainer>
  );
};

export default Navbar;
