<!-- resources/views/CrudAdministradores.blade.php -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administradores</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 80%;
            margin: 50px auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        table, th, td {
            border: 1px solid #ddd;
        }

        th, td {
            padding: 12px;
            text-align: left;
        }

        th {
            background-color: #28a745;
            color: white;
        }

        .add-admin {
            background-color: #007bff;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 5px;
        }

        .add-admin:hover {
            background-color: #0056b3;
        }

        .actions a {
            padding: 5px 10px;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }

        .edit {
            background-color: #ffc107;
        }

        .edit:hover {
            background-color: #e0a800;
        }

        .delete {
            background-color: #dc3545;
        }

        .delete:hover {
            background-color: #c82333;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2>Lista de Administradores</h2>

        <a href="#" class="add-admin">Agregar Administrador</a>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Administrador 1</td>
                    <td>admin1@example.com</td>
                    <td class="actions">
                        <a href="#" class="edit">Editar</a>
                        <a href="#" class="delete">Eliminar</a>
                    </td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Administrador 2</td>
                    <td>admin2@example.com</td>
                    <td class="actions">
                        <a href="#" class="edit">Editar</a>
                        <a href="#" class="delete">Eliminar</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</body>
</html>
