import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CardSection from './components/CardSection';
import styled, { createGlobalStyle } from 'styled-components';  // Importamos createGlobalStyle
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import ContactForm from './components/ContactForm'; // Importar el formulario de contacto


// Estilo global para todo el documento (incluyendo el fondo)
const GlobalStyle = createGlobalStyle`
  body, html {
    background-color: ${({ darkMode }) => (darkMode ? '#121212' : '#f4f4f9')}; /* Fondo del body y html */
    color: ${({ darkMode }) => (darkMode ? 'white' : '#870e20')};
    transition: background-color 0.3s, color 0.3s;
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif; /* Fuente consistente */
  }
`;

// Contenedor general de la página
const PageWrapper = styled.div`
  background-color: ${({ darkMode }) => (darkMode ? '#1a1a1a' : '#fff')};  /* Fondo del contenido */
  color: ${({ darkMode }) => (darkMode ? 'white' : '#870e20')};
  transition: background-color 0.3s, color 0.3s;
  min-height: 100vh;
  padding: 20px 0; /* Añadimos un padding general para la página */
  box-shadow: ${({ darkMode }) => (darkMode ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.1)')}; /* Añadir sombra en modo claro */
`;

// Sección de las tarjetas
const CardGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
  padding: 20px;
  margin-top: 50px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Las tarjetas ocupan todo el ancho en pantallas pequeñas */
  }
`;

// Contenedor para el formulario de contacto y redes sociales
const ContactContainer = styled.section`
  background-color: ${({ darkMode }) => (darkMode ? '#333' : '#fff')};
  padding: 40px 20px;
  margin: 50px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  position: relative;
`;

// Contenedor de redes sociales
const SocialIconsContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;

  a {
    color: ${({ darkMode }) => (darkMode ? 'white' : '#870e20')};
    font-size: 24px;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ darkMode }) => (darkMode ? '#f47573' : '#a22835')};
    }
  }
`;

// Mensaje de invitación a seguir redes sociales
const FollowMessage = styled.p`
  font-size: 18px;
  margin-top: 20px;
  color: ${({ darkMode }) => (darkMode ? 'white' : '#870e20')};
`;

// Botón para desplegar el formulario
const ToggleButton = styled.button`
  background-color: ${({ darkMode }) => (darkMode ? '#870e20' : '#a22835')};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;

  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#a22835' : '#be424a')};
  }
`;

// Contenedor del formulario de contacto con animación
const FormWrapper = styled.div`
  overflow: hidden;
  max-height: ${({ isOpen }) => (isOpen ? '500px' : '0')};
  transition: max-height 0.5s ease;
`;

const Footer = styled.footer`
  background-color: ${({ darkMode }) => (darkMode ? '#333' : '#be424a')};
  color: white;
  text-align: center;
  padding: 20px 0;
  margin-top: 50px;
`;

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Alternar entre modo claro y oscuro
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Alternar visibilidad del formulario de contacto
  const toggleForm = () => setIsFormOpen(!isFormOpen);

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      {/* Aplicamos los estilos globales */}
      <GlobalStyle darkMode={darkMode} />

      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Contenedor principal de la página */}
      <PageWrapper darkMode={darkMode} className="container">
        {/* Sección de tarjetas */}
        <CardGrid>
          <CardSection
            title="Nuestra Historia"
            content="El colegio Amerinst tiene una rica historia..."
            image="https://amerinst.edu.bo/wp-content/uploads/2022/01/19-scaled.jpg"
            darkMode={darkMode}
            bgColor={darkMode ? '#1a1a1a' : '#d95b5e'}
            textColor={darkMode ? '#f47573' : '#870e20'}
          />
          <CardSection
            title="Proyecto Educativo"
            content="Educamos con una visión sólida..."
            image="https://amerinst.edu.bo/wp-content/uploads/2022/01/01-FRANCIS-MARION-HARRINGTON-1906-a-1908-scaled.jpg"
            darkMode={darkMode}
            bgColor={darkMode ? '#1a1a1a' : '#d95b5e'}
            textColor={darkMode ? '#f47573' : '#870e20'}
          />
          <CardSection
            title="Pilares"
            content="Desarrollo de habilidades, valores y conducta."
            image="https://amerinst.edu.bo/wp-content/uploads/2022/01/GTO_0628-scaled.jpg"
            darkMode={darkMode}
            bgColor={darkMode ? '#1a1a1a' : '#d95b5e'}
            textColor={darkMode ? '#f47573' : '#870e20'}
          />
        </CardGrid>

        {/* Sección de contacto con formulario desplegable y redes sociales */}
        <ContactContainer darkMode={darkMode}>
          <h2>Contacto</h2>
          <FollowMessage darkMode={darkMode}>
            ¡Síguenos en nuestras redes sociales para más actualizaciones!
          </FollowMessage>

          {/* Íconos de redes sociales */}
          <SocialIconsContainer darkMode={darkMode}>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="mailto:info@colegioamerinst.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </SocialIconsContainer>

          {/* Botón para abrir o cerrar el formulario */}
          <ToggleButton darkMode={darkMode} onClick={toggleForm}>
            {isFormOpen ? 'Cerrar Formulario' : 'Abrir Formulario de Contacto'}
          </ToggleButton>

          {/* Formulario de contacto desplegable */}
          <FormWrapper isOpen={isFormOpen}>
            <ContactForm />
          </FormWrapper>
        </ContactContainer>
      </PageWrapper>

      {/* Footer */}
      <Footer darkMode={darkMode}>
        <p>&copy; 2024 Instituto Americano La Paz Bolivia</p>
        <p>Av. 20 de octubre N°1928 - Teléfonos: 242 3046 – 242 3352 – 242 4121</p>
      </Footer>
    </div>
  );
};

export default App;
