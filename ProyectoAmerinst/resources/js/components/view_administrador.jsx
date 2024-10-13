import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import UsuariosApp from './usuariosapp.jsx';
import EstudiantesApp from './estudiantesapp.jsx';
import MateriasApp from './materiasapp.jsx';
import CursosApp from './cursosapp.jsx';  // Agregamos CursosApp

const ViewAdministrador = () => {
    // Estado para manejar el componente activo
    const [activeComponent, setActiveComponent] = useState('');
    // Estado para manejar el colapso del menú lateral
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

    const toggleMenu = () => {
        setIsMenuCollapsed(!isMenuCollapsed);
    };

    const renderComponent = () => {
        if (activeComponent === 'usuarios') {
            return <UsuariosApp />;
        } else if (activeComponent === 'estudiantes') {
            return <EstudiantesApp />;
        } else if (activeComponent === 'materias') {
            return <MateriasApp />;
        } else if (activeComponent === 'cursos') {
            return <CursosApp />;
        }
        return <div>Por favor selecciona una opción del menú</div>;
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Menú lateral colapsable */}
            <div style={{
                width: isMenuCollapsed ? '50px' : '250px', // Cambiar ancho del menú
                backgroundColor: '#f8f9fa',
                padding: isMenuCollapsed ? '10px' : '20px',
                transition: 'width 0.3s ease', // Animación suave
            }}>
                {/* Botón para colapsar/expandir el menú */}
                <button onClick={toggleMenu} style={collapseButtonStyle}>
                    {isMenuCollapsed ? '►' : '◄'}
                </button>
                {!isMenuCollapsed && (
                    <div>
                        <h2>Menú</h2>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            <li>
                                <button onClick={() => setActiveComponent('usuarios')} style={buttonStyle}>
                                    Usuarios
                                </button>
                            </li>
                            <li>
                                <button onClick={() => setActiveComponent('estudiantes')} style={buttonStyle}>
                                    Estudiantes
                                </button>
                            </li>
                            <li>
                                <button onClick={() => setActiveComponent('materias')} style={buttonStyle}>
                                    Materias
                                </button>
                            </li>
                            <li>
                                <button onClick={() => setActiveComponent('cursos')} style={buttonStyle}>
                                    Cursos
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Contenido dinámico */}
            <div style={{ flex: 1, padding: '20px' }}>
                {renderComponent()}
            </div>
        </div>
    );
};

// Estilo básico para los botones del menú principal
const buttonStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
};

// Estilo del botón de colapso
const collapseButtonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    padding: '10px',
    textAlign: 'center',
    marginBottom: '10px',
};

// Montaje manual para pruebas del administrador
window.onload = () => {
    const rootElement = document.getElementById('app');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(<ViewAdministrador />);
    } else {
        console.error("No se encontró el contenedor con id 'app'");
    }
};

export default ViewAdministrador;
