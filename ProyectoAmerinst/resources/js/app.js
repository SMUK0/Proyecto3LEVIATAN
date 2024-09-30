/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

import './bootstrap';

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
// Cargar el componente de Usuarios
import React from 'react';
import ReactDOM from 'react-dom/client';

import usuariosapp from './components/usuariosapp.jsx';
import estudiantesapp from'./components/estudiantesapp.jsx';

// Verificar si el contenedor de Usuarios está en el DOM y montar la app de Usuarios
const usuariosContainer = document.getElementById('crud-usuarios');
if (usuariosContainer) {
    const rootUsuarios = ReactDOM.createRoot(usuariosContainer);
    rootUsuarios.render(<App />);
}

// Verificar si el contenedor de Estudiantes está en el DOM y montar la app de Estudiantes
const estudiantesContainer = document.getElementById('crud-estudiantes');
if (estudiantesContainer) {
    const rootEstudiantes = ReactDOM.createRoot(estudiantesContainer);
    rootEstudiantes.render(<App />);
}

