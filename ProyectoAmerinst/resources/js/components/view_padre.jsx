import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faSignOutAlt, faChartPie, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewPadre = () => {
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
    const [user, setUser] = useState({ nombre: '', rol: 'Padre' });
    const [estudiantes, setEstudiantes] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Simulación de datos de ejemplo de estudiantes relacionados y estadísticas
    const ejemploEstudiantes = [
        { id: 1, nombre: 'Carlos', apellido: 'Pérez', asistencia: 85, promedio: 7.5, fecha_actualizacion: '2024-10-01', usuario_id: 3 },
        { id: 2, nombre: 'Lucía', apellido: 'Rodríguez', asistencia: 92, promedio: 8.3, fecha_actualizacion: '2024-10-01', usuario_id: 3 },
        { id: 3, nombre: 'Sofía', apellido: 'Méndez', asistencia: 80, promedio: 6.8, fecha_actualizacion: '2024-10-01', usuario_id: 4 },
    ];

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
    
        if (!userData || userData.rol_id !== 3) { // 3 es el rol para padres
            window.location.href = '/login';
        } else {
            setUser({ nombre: userData.nombre, rol: 'Padre' });
    
            // Filtra estudiantes relacionados con el usuario logueado
            const estudiantesRelacionados = ejemploEstudiantes.filter(est => est.usuario_id === userData.user_id);
            setEstudiantes(estudiantesRelacionados);
        }
    }, []);
    

    const toggleMenu = () => setIsMenuCollapsed(!isMenuCollapsed);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleLogout = () => {
        fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Incluir cookies de sesión si usas autenticación basada en cookies
        })
        .then(response => {
            if (response.ok) {
                // Limpia el almacenamiento local y redirige al login
                localStorage.removeItem('user');
                window.location.href = '/login';
            } else {
                console.error('Error al cerrar sesión');
            }
        })
        .catch(error => console.error('Error al cerrar sesión:', error));
    };
    

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                            <li className="nav-item mb-2">
                                <button className="btn btn-outline-light w-100 d-flex align-items-center">
                                    <FontAwesomeIcon icon={faChartPie} className="me-2" />
                                    Estadísticas de Estudiantes
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
                        <div ref={dropdownRef} className="ml-auto d-flex align-items-center">
                            <FontAwesomeIcon icon={faUser} size="lg" className="me-2" onClick={toggleDropdown} />
                            {isDropdownOpen && (
                                <div className="dropdown-menu dropdown-menu-right show position-absolute" style={{ top: '40px', right: '10px' }}>
                                    <p className="px-3 py-2 m-0 fw-bold">{user.nombre}</p>
                                    <p className="px-3 text-muted mb-1">Rol: {user.rol}</p>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-4">
                    <h2>Estadísticas de los Estudiantes</h2>
                    <div className="row">
                        {estudiantes.map(estudiante => (
                            <div key={estudiante.id} className="col-md-4 mb-3">
                                <div className="card text-center">
                                    <div className="card-header">
                                        {estudiante.nombre} {estudiante.apellido}
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">Asistencia: {estudiante.asistencia}%</p>
                                        <p className="card-text">Promedio de notas: {estudiante.promedio}</p>
                                        <p className="card-text">Última actualización: {estudiante.fecha_actualizacion}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

window.onload = () => {
    const rootElement = document.getElementById('app');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<ViewPadre />);
    } else {
        console.error("No se encontró el contenedor con id 'app'");
    }
};

export default ViewPadre;
