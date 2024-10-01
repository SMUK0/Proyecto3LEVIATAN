import React, { useState } from 'react';
import styled from 'styled-components';

// Contenedor de la página de inicio de sesión
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: ${({ darkMode }) => (darkMode ? '#1a1a1a' : '#f4f4f9')};
  transition: background-color 0.3s ease;
`;

// Contenedor del formulario
const FormWrapper = styled.div`
  background-color: ${({ darkMode }) => (darkMode ? '#333' : '#fff')};
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

// Estilo para los campos del formulario
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid ${({ darkMode }) => (darkMode ? '#555' : '#ccc')};
  border-radius: 5px;
  background-color: ${({ darkMode }) => (darkMode ? '#555' : '#fff')};
  color: ${({ darkMode }) => (darkMode ? '#fff' : '#333')};
  outline: none;
  font-size: 16px;
`;

// Estilo para el botón
const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: ${({ darkMode }) => (darkMode ? '#f47573' : '#0078d4')};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#ff6f61' : '#005a9e')};
  }
`;

// Estilo para los enlaces
const Link = styled.a`
  color: ${({ darkMode }) => (darkMode ? '#f47573' : '#0078d4')};
  text-decoration: none;
  margin-top: 10px;
  display: block;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginPage = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de autenticación aquí
    alert('Iniciar sesión exitoso');
  };

  return (
    <LoginContainer darkMode={darkMode}>
      <FormWrapper darkMode={darkMode}>
        <img
          src="https://amerinst.edu.bo/wp-content/uploads/2022/01/LOGOpng_AMERINST-1024x1024.png"
          alt="Logo Colegio Amerinst"
          style={{ height: '50px', marginBottom: '20px' }}
        />
        <h2 style={{ color: darkMode ? '#fff' : '#333' }}>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <Input
            darkMode={darkMode}
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            darkMode={darkMode}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button darkMode={darkMode} type="submit">
            Iniciar sesión
          </Button>
        </form>
        <Link darkMode={darkMode} href="#">
          ¿No tiene una cuenta? Cree una.
        </Link>
        <Link darkMode={darkMode} href="#">
          ¿No puede acceder a su cuenta?
        </Link>
      </FormWrapper>
    </LoginContainer>
  );
};

export default LoginPage;
