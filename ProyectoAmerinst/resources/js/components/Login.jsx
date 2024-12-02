import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled, { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faArrowLeft, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

// Paleta de colores ajustada para el modo claro
const colors = {
  primary: '#d6336c', // Rosa
  secondary: '#f765a3', // Rosa claro
  background: '#f8f9fa', // Fondo claro
  darkBackground: '#343a40', // Fondo oscuro
  textLight: '#ffffff', // Texto en modo claro
  textDark: '#212529', // Texto en modo oscuro
  buttonHover: '#b82f6b', // Hover en botones
  error: '#dc3545', // Rojo para errores
};

const GlobalStyle = createGlobalStyle`
  body, html {
    background-color: ${({ darkMode }) => (darkMode ? colors.darkBackground : colors.background)};
    color: ${({ darkMode }) => (darkMode ? colors.textLight : colors.textDark)};
    transition: background-color 0.3s, color 0.3s;
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 40px;
  background: ${({ darkMode }) => (darkMode ? '#2d2d2d' : '#ffffff')};
  border-radius: 12px;
  box-shadow: ${({ darkMode }) => (darkMode ? '0 6px 12px rgba(255, 255, 255, 0.1)' : '0 6px 12px rgba(0, 0, 0, 0.15)')};
  text-align: left;
  font-family: 'Arial', sans-serif;
  margin-top: 0;
  position: relative;
`;

const Title = styled.h2`
  font-family: 'Georgia', serif;
  color: ${({ darkMode }) => (darkMode ? colors.textLight : '#870e20')};
  font-size: 30px;
  margin-bottom: 40px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${({ darkMode }) => (darkMode ? colors.textLight : '#555')};
  font-size: 18px;
  flex: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  margin-top: 5px;
  border-radius: 6px;
  border: 1px solid ${({ darkMode }) => (darkMode ? '#555' : '#ddd')};
  box-sizing: border-box;
  font-size: 18px;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: ${({ darkMode }) => (darkMode ? colors.primary : colors.primary)};
    box-shadow: 0 0 10px ${({ darkMode }) => (darkMode ? colors.primary : colors.primary)};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background-color: ${({ darkMode }) => (darkMode ? colors.primary : colors.primary)};
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 25px;
  font-weight: bold;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover, &:focus {
    background-color: ${({ darkMode }) => (darkMode ? '#b97a90' : '#a06c88')};
  }
`;

const Spinner = styled.div`
  border: 4px solid ${({ darkMode }) => (darkMode ? '#555' : '#ddd')};
  border-top: 4px solid ${({ darkMode }) => (darkMode ? colors.primary : colors.primary)};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const IconWrapper = styled.div`
  color: ${({ darkMode }) => (darkMode ? colors.textLight : '#555')};
  font-size: 22px;
`;

const PasswordIconWrapper = styled.div`
  cursor: pointer;
  color: ${({ darkMode }) => (darkMode ? colors.textLight : '#555')};
`;

const ThemeButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: ${({ darkMode }) => (darkMode ? '#333' : '#f9f9f9')};
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#444' : '#e0e0e0')};
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: ${({ darkMode }) => (darkMode ? '#444' : '#f1f1f1')};
  border: none;
  padding: 10px;
  border-radius: 50%;
  color: ${({ darkMode }) => (darkMode ? '#fff' : '#333')};
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#555' : '#ddd')};
  }
`;

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const getCsrfToken = () => {
    const token = document.querySelector('meta[name="csrf-token"]');
    return token ? token.getAttribute('content') : '';
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Credenciales incorrectas');
        } else {
          throw new Error('Error al iniciar sesión');
        }
      }

      const data = await response.json();

      localStorage.setItem('user', JSON.stringify(data));

      // Tiempo de espera de 2 segundos antes de redirigir
      setTimeout(() => {
        switch (data.rol_id) {
          case 1:
            window.location.href = '/administrador';
            break;
          case 2:
            window.location.href = '/maestro';
            break;
          case 3:
            window.location.href = '/padre';
            break;
          default:
            throw new Error('Rol desconocido');
        }


      }, 3000); // 2 segundos de espera
      toast.success('Inicio de sesión exitoso!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <GlobalStyle darkMode={darkMode} />
      <Container darkMode={darkMode}>
        <Title darkMode={darkMode}>¡Bienvenidos al Sistema Web Amerinst!</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <IconWrapper darkMode={darkMode}>
              <FontAwesomeIcon icon={faEnvelope} />
            </IconWrapper>
            <Label darkMode={darkMode} htmlFor="email">Correo electrónico</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              darkMode={darkMode}
            />
          </FormGroup>
          <FormGroup>
            <IconWrapper darkMode={darkMode}>
              <FontAwesomeIcon icon={faLock} />
            </IconWrapper>
            <Label darkMode={darkMode} htmlFor="password">Contraseña</Label>
            <Input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              darkMode={darkMode}
            />
            <PasswordIconWrapper darkMode={darkMode} onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </PasswordIconWrapper>
          </FormGroup>
          <Button type="submit" darkMode={darkMode} disabled={loading}>
            {loading ? <Spinner darkMode={darkMode} /> : 'Iniciar Sesión'}
          </Button>
        </form>
        <BackButton onClick={() => window.location.href = '/'} darkMode={darkMode}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </BackButton>
        <ThemeButton onClick={toggleTheme} darkMode={darkMode}>
          <FontAwesomeIcon icon={darkMode ? faMoon : faSun} />
        </ThemeButton>
        <ToastContainer />
      </Container>
    </>
  );
};

window.onload = () => {
  const rootElement = document.getElementById('login');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<Login />);
  } else {
    console.error("No se encontró el contenedor con id 'login'");
  }
};

export default Login;
