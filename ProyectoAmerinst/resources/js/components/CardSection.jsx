import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Animación para el hover (zoom in, sombra y brillo)
const HoverAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: ${({ darkMode }) =>
      darkMode ? '0 6px 12px rgba(0, 0, 0, 0.6)' : '0 4px 10px rgba(0, 0, 0, 0.15)'};
    border: ${({ darkMode }) => (darkMode ? '2px solid #f47573' : '2px solid #870e20')};
    filter: brightness(1); /* Normal brillo */
  }
  50% {
    transform: scale(1.05); /* Zoom suave */
    box-shadow: ${({ darkMode }) =>
      darkMode ? '0 8px 16px rgba(0, 0, 0, 0.7)' : '0 6px 14px rgba(0, 0, 0, 0.25)'};
    border: ${({ darkMode }) => (darkMode ? '2px solid #ff6f61' : '2px solid #a22835')}; /* Borde resaltado */
    filter: brightness(1.2); /* Aumentar el brillo */
  }
  100% {
    transform: scale(1.05); /* Mantener el zoom */
    box-shadow: ${({ darkMode }) =>
      darkMode ? '0 8px 16px rgba(0, 0, 0, 0.7)' : '0 6px 14px rgba(0, 0, 0, 0.25)'};
    border: ${({ darkMode }) => (darkMode ? '2px solid #ff6f61' : '2px solid #a22835')}; /* Borde resaltado */
    filter: brightness(1.2); /* Mantener brillo alto */
  }
`;

// Estilo de la tarjeta
const Card = styled.div`
  background-color: ${({ darkMode }) => (darkMode ? '#333' : '#ffffff')};
  color: ${({ darkMode }) => (darkMode ? '#f4f4f9' : '#333')};
  border-radius: 12px;
  padding: 20px 20px;
  box-shadow: ${({ darkMode }) =>
    darkMode ? '0 6px 12px rgba(0, 0, 0, 0.6)' : '0 4px 10px rgba(0, 0, 0, 0.15)'};
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 5px; /* Reducido aún más el espaciado entre tarjetas */
  border: ${({ darkMode }) => (darkMode ? '2px solid #f47573' : '2px solid #870e20')};
  max-width: 350px; /* Tamaño inicial de la tarjeta */
  width: 100%;
  cursor: pointer; /* Cambiar el cursor al pasar por encima */
  
  &:hover {
    animation: ${HoverAnimation} 0.3s ease forwards; /* Activar animación al pasar el cursor */
  }

  &.expanded {
    max-width: 450px; /* Aumento del tamaño al expandir */
  }
`;

// Estilo para la imagen
const Image = styled.img`
  width: 100%; /* Ocupa el 100% del ancho de la tarjeta */
  height: 180px; /* Fija la altura de la imagen */
  border-radius: 10px;
  border: ${({ darkMode }) => (darkMode ? '3px solid #f47573' : '3px solid #870e20')};
  margin-bottom: 10px; /* Reducido margen inferior */
  box-shadow: ${({ darkMode }) =>
    darkMode ? '0 4px 6px rgba(0, 0, 0, 0.5)' : '0 4px 6px rgba(0, 0, 0, 0.2)'};
  object-fit: cover; /* Mantiene la proporción de la imagen sin distorsionarla */
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05); /* Efecto zoom en la imagen */
  }
`;

// Estilo para el título de la tarjeta
const Title = styled.h3`
  color: ${({ darkMode }) => (darkMode ? '#f47573' : '#870e20')};
  font-size: 1.6rem;
  margin-bottom: 8px; /* Reducido margen inferior */
  font-weight: bold;
  text-transform: capitalize;
  letter-spacing: 0.5px;
`;

// Estilo para el contenido de la tarjeta
const Content = styled.p`
  font-size: 1.2rem;
  color: ${({ darkMode }) => (darkMode ? '#dddddd' : '#555')};
  margin-bottom: 8px; /* Reducido margen inferior */
  line-height: 1.6;
  max-width: 90%;
  text-align: justify;
  overflow: hidden; /* Esconde el contenido adicional cuando no está expandido */
  height: ${({ expanded }) => (expanded ? 'auto' : '120px')}; /* Limita la altura cuando no está expandido */
  transition: height 0.3s ease;
`;

// Estilo para el botón
const Button = styled.button`
  background-color: ${({ darkMode }) => (darkMode ? '#f47573' : '#870e20')};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 5px; /* Reducido margen superior */
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#ff6f61' : '#a22835')};
  }
`;

const CardSection = ({ title, content, image, darkMode }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card darkMode={darkMode} className={expanded ? 'expanded' : ''}>
      <Image src={image} alt={title} darkMode={darkMode} />
      <Title darkMode={darkMode}>{title}</Title>
      <Content darkMode={darkMode} expanded={expanded}>
        {content}
      </Content>
      <Button darkMode={darkMode} onClick={toggleExpand}>
        {expanded ? 'Ver menos' : 'Ver más'}
      </Button>
    </Card>
  );
};

export default CardSection;
