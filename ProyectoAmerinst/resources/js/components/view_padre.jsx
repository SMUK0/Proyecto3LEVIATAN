import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import NotasEstudiantes from './NotasEstudiantes';
import EstadisticasEstudiantes from './EstadisticasEstudiantes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChartPie, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewPadre = () => {
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
    const [isNotasVisible, setIsNotasVisible] = useState(false); // Estado para controlar visibilidad de Notas
    const [isEstadisticasVisible, setIsEstadisticasVisible] = useState(false); // Estado para controlar visibilidad de Estadísticas
    const [user, setUser] = useState({ nombre: '', rol: 'Padre' });
    const dropdownRef = useRef(null);

    const toggleMenu = () => setIsMenuCollapsed(!isMenuCollapsed);

    const toggleNotas = () => {
        setIsNotasVisible(true);
        setIsEstadisticasVisible(false); // Ocultar estadísticas al mostrar notas
    };

    const toggleEstadisticas = () => {
        setIsEstadisticasVisible(true);
        setIsNotasVisible(false); // Ocultar notas al mostrar estadísticas
    };

    const handleLogout = () => {
        fetch('/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        }).then(response => {
            if (response.ok) {
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }).catch(error => console.error('Error al cerrar sesión:', error));
    };

    return (
        <div className="d-flex">
            <div className={`bg-primary text-white p-3 ${isMenuCollapsed ? 'collapsed-menu' : 'expanded-menu'}`} style={{ height: '100vh', transition: 'width 0.3s' }}>
                <div className="text-center mb-3">
                    <button className="btn btn-outline-light" onClick={toggleMenu}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </div>
                {!isMenuCollapsed && (
                    <div className="menu-options">
                        <h5 className="text-center mb-4">Menú Padre</h5>
                        <ul className="nav flex-column">
                            {/* Botón para Notas del Estudiante */}
                            <li className="nav-item mb-2">
                                <button className="btn btn-outline-light w-100 d-flex align-items-center" onClick={toggleNotas}>
                                    <FontAwesomeIcon icon={faChartPie} className="me-2" />
                                    Notas del Estudiante
                                </button>
                            </li>
                            {/* Botón para Estadísticas */}
                            <li className="nav-item mb-2">
                                <button className="btn btn-outline-light w-100 d-flex align-items-center" onClick={toggleEstadisticas}>
                                    <FontAwesomeIcon icon={faChartPie} className="me-2" />
                                    Estadísticas
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex-grow-1">
                <header className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-3">
                    <div className="container-fluid">
                        <span className="navbar-brand">
                            <FontAwesomeIcon icon={faChalkboardTeacher} className="me-2" />
                            Panel Padre - {user.nombre}
                        </span>
                    </div>
                </header>

                <div className="p-4">
                    {/* Renderizar NotasEstudiantes o EstadisticasEstudiantes según el estado */}
                    {isNotasVisible && <NotasEstudiantes />}
                    {isEstadisticasVisible && <EstadisticasEstudiantes />}
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
