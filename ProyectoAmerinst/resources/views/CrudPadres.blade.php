<?php
// Aquí puedes incluir alguna verificación de inicio de sesión si lo deseas.
// if(!isset($_POST['username']) || !isset($_POST['password'])) {
//     header('Location: login.php');
//     exit;
// }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRUD de Padres - Colegio Amerinst</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #ffe6e6;
            margin: 0;
            padding: 0;
        }

        /* Estilos generales */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            padding: 20px;
        }

        .header img {
            height: 100px;
            width: auto;
        }

        .header h1 {
            color: #b4140a;
        }

        /* Tabla para el CRUD */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        table, th, td {
            border: 1px solid #b4140a;
        }

        th, td {
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #b4140a;
            color: white;
        }

        /* Botones */
        .btn {
            padding: 10px 15px;
            background-color: #b4140a;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .btn:hover {
            background-color: #d9534f;
        }

        .form-container {
            margin-bottom: 20px;
        }

        .form-container input[type="text"] {
            width: calc(100% - 22px);
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        .form-container button {
            width: 100%;
            padding: 10px;
            background-color: #b4140a;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .form-container button:hover {
            background-color: #d9534f;
        }
    </style>
</head>
<body>

    <!-- Encabezado con logo -->
    <div class="header">
        <img src="https://amerinst.edu.bo/wp-content/uploads/2022/01/LOGOpng_AMERINST-1024x1024.png" alt="Logo">
        <h1>Gestión de Padres</h1>
    </div>

    <!-- CRUD para padres -->
    <div class="container">
        <h2>Lista de Padres</h2>

        <!-- Formulario para agregar o editar padres -->
        <div class="form-container">
            <form action="#">
                <input type="text" name="nombre" placeholder="Nombre del padre" required>
                <input type="text" name="apellido" placeholder="Apellido del padre" required>
                <button type="submit" class="btn">Agregar Padre</button>
            </form>
        </div>

        <!-- Tabla de padres -->
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Juan</td>
                    <td>Pérez</td>
                    <td>
                        <button class="btn">Editar</button>
                        <button class="btn">Eliminar</button>
                    </td>
                </tr>
                <!-- Más padres aquí -->
            </tbody>
        </table>
    </div>

</body>
</html>
