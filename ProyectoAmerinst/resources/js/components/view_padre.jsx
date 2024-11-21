import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import NotasEstudiantes from './NotasEstudiantes';
import EstadisticasEstudiantes from './EstadisticasEstudiantes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faChartPie, faUser, faSignOutAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

// Paleta de colores
const colors = {
  primary: '#007bff',
  secondary: '#f8f9fa',
  backgroundDark: '#343a40',
  textLight: '#ffffff',
  textDark: '#212529',
  buttonHover: '#0056b3',
  dropdown: '#f1f1f1',
  error: '#dc3545',
};

const ViewPadre = () => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState('');
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.rol_id === 3) {
      // Verifica que el usuario sea un padre
      setUser(userData);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const toggleMenu = () => setIsMenuCollapsed(!isMenuCollapsed);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleLogout = () => {
    fetch('/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      })
      .catch((error) => console.error('Error al cerrar sesión:', error));
  };

  const handleGoHome = () => setActiveComponent(''); // Regresa a la vista principal.

  const renderComponent = () => {
    switch (activeComponent) {
      case 'notas':
        return <NotasEstudiantes />;
      case 'estadisticas':
        return <EstadisticasEstudiantes />;
      default:
        return (
          <div
            className="text-center mt-5 p-4"
            style={{
              backgroundColor: colors.primary,
              color: colors.textLight,
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              ¡Bienvenido al panel del Padre {user ? `${user.nombre} ${user.apellido}` : ''}!
            </h2>
            <p style={{ fontSize: '1.25rem', marginTop: '20px' }}>
              Selecciona una opción en el menú para comenzar.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: colors.secondary }}>
      {/* Menú lateral */}
      <div
        className={`bg-dark text-white p-3 ${isMenuCollapsed ? 'collapsed-menu' : 'expanded-menu'}`}
        style={{
          width: isMenuCollapsed ? '80px' : '250px',
          height: '100vh',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}
      >
        <div className="text-center mb-3">
          <button className="btn btn-outline-light" onClick={toggleMenu} style={{ padding: '10px' }}>
            <FontAwesomeIcon icon={isMenuCollapsed ? faArrowRight : faArrowLeft} />
          </button>
        </div>
        {!isMenuCollapsed && (
          <div className="menu-options">
            <h5 className="text-center mb-4">Menú</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <button
                  className="btn btn-outline-light w-100 d-flex align-items-center justify-content-start"
                  onClick={() => setActiveComponent('notas')}
                  style={{
                    fontSize: '1.2rem',
                    padding: '12px',
                    transition: 'background-color 0.3s ease',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                >
                  <FontAwesomeIcon icon={faChartPie} className="me-3" style={{ fontSize: '1.5rem' }} />
                  <span className="w-100 text-center">Notas</span>
                </button>
              </li>
              <li className="nav-item mb-2">
                <button
                  className="btn btn-outline-light w-100 d-flex align-items-center justify-content-start"
                  onClick={() => setActiveComponent('estadisticas')}
                  style={{
                    fontSize: '1.2rem',
                    padding: '12px',
                    transition: 'background-color 0.3s ease',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primary)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                >
                  <FontAwesomeIcon icon={faChartPie} className="me-3" style={{ fontSize: '1.5rem' }} />
                  <span className="w-100 text-center">Estadísticas</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Contenido dinámico */}
      <div className="flex-grow-1">
        <header className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-3">
          <div className="container-fluid">
            <span
              className="navbar-brand d-flex align-items-center"
              style={{
                color: colors.primary,
                cursor: 'pointer',
                fontSize: '1.5rem',
              }}
              onClick={handleGoHome}
            >
              <FontAwesomeIcon
                icon={faHome}
                className="me-2"
                style={{
                  fontSize: '1.8rem',
                  transition: 'color 0.3s',
                }}
              />
              Panel Padre
            </span>
            <div ref={dropdownRef} className="ml-auto d-flex align-items-center">
              <FontAwesomeIcon
                icon={faUser}
                size="lg"
                className="me-2"
                onClick={toggleDropdown}
                style={{
                  cursor: 'pointer',
                  borderRadius: '50%',
                  border: '3px solid black',
                  padding: '7px',
                  backgroundColor: '#fff',
                  transition: 'transform 0.3s ease',
                }}
              />
              {isDropdownOpen && (
                <div
                  className="dropdown-menu dropdown-menu-right show position-absolute"
                  style={{
                    top: '40px',
                    right: '10px',
                    backgroundColor: colors.dropdown,
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {user && (
                    <div className="px-3 py-2">
                      <p className="mb-1 fw-bold">{user.nombre} {user.apellido}</p>
                      <p className="mb-2 text-muted">Padre</p>
                    </div>
                  )}
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div
          className="p-4"
          style={{
            backgroundColor: colors.secondary,
            height: 'calc(100vh - 80px)',
            overflowY: 'auto',
          }}
        >
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

window.onload = () => {
  const rootElement = document.getElementById('app');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<ViewPadre />);
  }
};

export default ViewPadre;
