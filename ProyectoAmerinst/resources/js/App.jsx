import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CardSection from './components/CardSection';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

// Animaciones
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleUp = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
`;

// Estilo global
const GlobalStyle = createGlobalStyle`
  body, html {
    background-color: ${({ darkMode }) => (darkMode ? '#212121' : '#f9f9f9')};
    color: ${({ darkMode }) => (darkMode ? '#f5f5f5' : '#2d2d2d')};
    transition: background-color 0.3s, color 0.3s;
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
  }
`;

const PageWrapper = styled.div`
  background-color: ${({ darkMode }) => (darkMode ? '#2d2d2d' : '#fff')};
  color: ${({ darkMode }) => (darkMode ? 'white' : '#870e20')};
  transition: background-color 0.3s, color 0.3s;
  min-height: 100vh;
  padding: 20px 0;
  box-shadow: ${({ darkMode }) => (darkMode ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.1)')};
  position: relative;
`;

const WelcomeMessageContainer = styled.div`
  position: relative;
  text-align: center;
  margin: 0 auto;
  padding: 150px 20px;
  background-color: ${({ darkMode }) => (darkMode ? 'rgba(0, 0, 0, 0.7)' : '#ffffff')};
  color: ${({ darkMode }) => (darkMode ? 'white' : '#870e20')};
  border-radius: 15px;
  font-size: 80px;
  font-weight: bold;
  animation: ${fadeIn} 1s ease-out; /* Animación de carga */
  transition: background-color 0.3s, color 0.3s;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 0 20px rgba(255, 255, 255, 0.2)' : '0 0 20px rgba(0, 0, 0, 0.2)')};
  cursor: pointer;
  width: 90%;
  max-width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: row; /* Cambié la dirección para colocar el ícono al lado del texto */
  gap: 20px; /* Añadí espacio entre el ícono y el texto */
  
  &:hover {
    animation: ${scaleUp} 0.3s ease-out infinite alternate; /* Animación continua al pasar el cursor */
  }

  i {
    font-size: 70px;
    vertical-align: middle;
  }

  @media (max-width: 768px) {
    font-size: 50px;
    padding: 120px 20px;
  }
`;

const CardGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 0px; /* Reducido aún más el espaciado entre tarjetas */
  padding: 20px;
  margin-top: 50px;
  justify-items: center; /* Centra las tarjetas */

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;


const Footer = styled.footer`
  background-color: ${({ darkMode }) => (darkMode ? '#212121' : '#870e20')};
  color: ${({ darkMode }) => (darkMode ? 'white' : '#f5f5f5')};
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 0 15px rgba(255, 255, 255, 0.2)' : '0 0 15px rgba(0, 0, 0, 0.2)')};

  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
  }

  .footer-column {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .footer-column h4 {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
    color: ${({ darkMode }) => (darkMode ? 'white' : '#ffdfcc')};
  }

  .footer-column p, .footer-column a {
    font-size: 16px;
    color: ${({ darkMode }) => (darkMode ? '#f5f5f5' : '#f5f5f5')};
    text-align: center;
  }

  .footer-column a {
    font-weight: bold;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ darkMode }) => (darkMode ? '#f47573' : '#ffdfcc')};
    }
  }

  .social-icons {
    display: flex;
    gap: 25px;
    justify-content: center;
    align-items: center;

    a {
      font-size: 30px;
      padding: 12px;
      border-radius: 50%;
      transition: transform 0.3s ease, color 0.3s ease;
      color: ${({ darkMode }) => (darkMode ? '#f5f5f5' : '#f5f5f5')};

      &:hover {
        color: ${({ darkMode }) => (darkMode ? '#f47573' : '#ffdfcc')};
        transform: scale(1.3);
      }
    }
  }

  @media (max-width: 768px) {
    padding: 30px 20px;

    .footer-column h4 {
      font-size: 18px;
    }

    .footer-column p, .footer-column a {
      font-size: 14px;
    }
  }
`;

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div>
      <GlobalStyle darkMode={darkMode} />
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <PageWrapper darkMode={darkMode}>
        <WelcomeMessageContainer darkMode={darkMode}>
          ¡Bienvenidos al Instituto Americano! Estamos comprometidos con tu futuro.
        </WelcomeMessageContainer>

        <CardGrid>
          <CardSection
            title="Nuestra Historia"
            content="El colegio Amerinst tiene una rica historia que se remonta a más de 30 años de compromiso con la educación. Desde sus inicios, ha sido un referente en la formación académica de calidad, brindando a sus estudiantes una formación integral que los prepara para los retos del futuro."
            image="https://amerinst.edu.bo/wp-content/uploads/2022/01/19-scaled.jpg"
            darkMode={darkMode}
          />
          <CardSection
            title="Proyecto Educativo"
            content="El Proyecto Educativo del Instituto Americano está diseñado para fomentar el desarrollo integral de cada estudiante. Nuestro enfoque se basa en el aprendizaje activo, la investigación y la colaboración, asegurando que nuestros alumnos sean ciudadanos responsables, creativos y éticos."
            image="https://amerinst.edu.bo/wp-content/uploads/2022/01/01-FRANCIS-MARION-HARRINGTON-1906-a-1908-scaled.jpg"
            darkMode={darkMode}
          />
          <CardSection
            title="Pilares"
            content="Nuestros pilares fundamentales son la excelencia académica, el desarrollo de valores humanos y la innovación educativa. Nos esforzamos por ofrecer una educación que no solo forme profesionales competentes, sino también personas responsables, solidarias y comprometidas con su comunidad."
            image="https://amerinst.edu.bo/wp-content/uploads/2022/01/GTO_9862-scaled.jpg"
            darkMode={darkMode}
          />
        </CardGrid>
      </PageWrapper>

      <Footer darkMode={darkMode}>
        <div className="footer-content">
          <div className="footer-column">
            <h4>Instituto Americano</h4>
            <p>&copy; 2024 Instituto Americano La Paz Bolivia - LEVIATAN</p>
            <p>Av. 20 de octubre N°1928 - Teléfono: 7021-29492</p>
            <a href="https://amerinst.edu.bo/" target="_blank" rel="noopener noreferrer">Visita nuestra página web!</a>
          </div>
          <div className="footer-column">
            <h4>Conéctate</h4>
            <div className="social-icons">
              <a href="https://www.facebook.com/profile.php?id=61564139076612" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://x.com/BandaAmerinst" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://www.instagram.com/seleccion_amerinst/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        </div>
      </Footer>
    </div>
  );
};

export default App;
