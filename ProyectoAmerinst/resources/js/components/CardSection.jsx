import React from 'react';
import styled from 'styled-components';

// Estilo de la tarjeta
const Card = styled.div`
  background-color: ${({ darkMode, bgColor }) => (darkMode ? '#2c2c2c' : '#f9f9f9')}; /* Fondo dependiendo del modo */
  color: ${({ darkMode, textColor }) => (darkMode ? '#f4f4f9' : '#333')}; /* Texto dependiendo del modo */
  border-radius: 15px;
  padding: 20px;
  box-shadow: ${({ darkMode }) =>
    darkMode ? '0 4px 6px rgba(0, 0, 0, 0.5)' : '0 4px 8px rgba(0, 0, 0, 0.1)'}; /* Sombra diferente para cada modo */
  transition: background-color 0.3s ease, color 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 30px;
  border: ${({ darkMode }) => (darkMode ? '1px solid #f47573' : '1px solid #d95b5e')}; /* Bordes visibles */
`;

// Estilo para la imagen
const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  border: ${({ darkMode }) => (darkMode ? '2px solid #f47573' : '2px solid #870e20')}; /* Borde en imagen */
  margin-bottom: 20px;
  box-shadow: ${({ darkMode }) =>
    darkMode ? '0 2px 4px rgba(0, 0, 0, 0.5)' : '0 2px 4px rgba(0, 0, 0, 0.2)'}; /* Sombra de la imagen */
`;

// Estilo para el título de la tarjeta
const Title = styled.h3`
  color: ${({ darkMode, textColor }) => (darkMode ? '#f47573' : '#870e20')}; /* Color del título */
  font-size: 1.8rem; /* Título más grande */
  margin-bottom: 15px;
  font-weight: bold;
  text-transform: capitalize; /* Mejor legibilidad */
  letter-spacing: 0.5px;
`;

// Estilo para el contenido de la tarjeta
const Content = styled.p`
  font-size: 1.2rem;
  color: ${({ darkMode }) => (darkMode ? '#dddddd' : '#555')}; /* Texto más claro para modo oscuro */
  margin-bottom: 20px;
  line-height: 1.7; /* Mejorar la legibilidad del contenido */
  max-width: 90%;
`;

const CardSection = ({ title, content, image, darkMode, bgColor, textColor }) => {
  return (
    <Card darkMode={darkMode} bgColor={bgColor} textColor={textColor}>
      <Image src={image} alt={title} darkMode={darkMode} />
      <Title darkMode={darkMode} textColor={textColor}>{title}</Title>
      <Content darkMode={darkMode}>{content}</Content>
    </Card>
  );
};

export default CardSection;
