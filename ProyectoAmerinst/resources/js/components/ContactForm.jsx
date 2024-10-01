import React, { useState } from 'react';
import styled from 'styled-components';

// Contenedor del formulario de contacto
const FormWrapper = styled.div`
  background-color: ${({ darkMode }) => (darkMode ? '#2c2c2c' : '#ffffff')};
  padding: 40px;
  border-radius: 10px;
  box-shadow: ${({ darkMode }) =>
    darkMode ? '0 4px 8px rgba(0, 0, 0, 0.8)' : '0 4px 8px rgba(0, 0, 0, 0.1)'};
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
`;

// Estilo para los campos de entrada (input y textarea)
const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  font-size: 1rem;
  border: 1px solid ${({ darkMode }) => (darkMode ? '#555' : '#ccc')};
  border-radius: 5px;
  background-color: ${({ darkMode }) => (darkMode ? '#333' : '#f9f9f9')};
  color: ${({ darkMode }) => (darkMode ? '#fff' : '#333')};
  box-shadow: ${({ darkMode }) =>
    darkMode ? '0 2px 4px rgba(0, 0, 0, 0.5)' : '0 2px 4px rgba(0, 0, 0, 0.1)'};
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ darkMode }) => (darkMode ? '#f47573' : '#870e20')};
    box-shadow: ${({ darkMode }) =>
      darkMode ? '0 4px 8px rgba(0, 0, 0, 0.7)' : '0 4px 8px rgba(0, 0, 0, 0.2)'};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  font-size: 1rem;
  border: 1px solid ${({ darkMode }) => (darkMode ? '#555' : '#ccc')};
  border-radius: 5px;
  background-color: ${({ darkMode }) => (darkMode ? '#333' : '#f9f9f9')};
  color: ${({ darkMode }) => (darkMode ? '#fff' : '#333')};
  box-shadow: ${({ darkMode }) =>
    darkMode ? '0 2px 4px rgba(0, 0, 0, 0.5)' : '0 2px 4px rgba(0, 0, 0, 0.1)'};
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  resize: none;
  height: 120px;

  &:focus {
    outline: none;
    border-color: ${({ darkMode }) => (darkMode ? '#f47573' : '#870e20')};
    box-shadow: ${({ darkMode }) =>
      darkMode ? '0 4px 8px rgba(0, 0, 0, 0.7)' : '0 4px 8px rgba(0, 0, 0, 0.2)'};
  }
`;

// Estilo para el botón de enviar
const SubmitButton = styled.button`
  background-color: ${({ darkMode }) => (darkMode ? '#f47573' : '#870e20')};
  color: white;
  border: none;
  padding: 15px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#ff6f61' : '#a22835')};
  }
`;

const ContactForm = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Función para manejar los cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    alert(`Gracias por contactarnos, ${formData.name}!`);
    // Limpiar formulario después de enviarlo
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <FormWrapper darkMode={darkMode}>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Tu Nombre"
          value={formData.name}
          onChange={handleChange}
          darkMode={darkMode}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Tu Email"
          value={formData.email}
          onChange={handleChange}
          darkMode={darkMode}
          required
        />
        <Textarea
          name="message"
          placeholder="Tu Mensaje"
          value={formData.message}
          onChange={handleChange}
          darkMode={darkMode}
          required
        />
        <SubmitButton darkMode={darkMode}>Enviar</SubmitButton>
      </form>
    </FormWrapper>
  );
};

export default ContactForm;
