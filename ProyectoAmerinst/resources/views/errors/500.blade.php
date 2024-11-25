<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página no encontrada</title>
    <style>
        :root {
            --primary: #d6336c;
            --secondary: #f765a3;
            --background-light: #f8f9fa;
            --text-dark: #212529;
            --text-light: #ffffff;
            --button-hover: #b82f6b;
        }

        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: var(--background-light);
            color: var(--text-dark);
            text-align: center;
        }

        .container {
            padding: 40px;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            max-width: 500px;
            width: 90%;
        }

        .error-icon {
            font-size: 80px;
            color: var(--primary);
            margin-bottom: 20px;
        }

        h1 {
            font-size: 48px;
            margin: 10px 0;
            color: var(--primary);
            font-family: 'Georgia', serif;
        }

        p {
            font-size: 18px;
            margin: 10px 0;
            color: var(--text-dark);
        }

        a {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background: var(--primary);
            color: var(--text-light);
            text-decoration: none;
            font-size: 18px;
            font-weight: bold;
            border-radius: 6px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        a:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
            background: var(--button-hover);
        }

        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: var(--text-dark);
        }

        .footer a {
            color: var(--secondary);
            text-decoration: none;
            font-weight: bold;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-icon">🔥</div>
        <h1>Error 500</h1>
        <p>Ups, algo salió mal en el servidor.</p>
        <p>Estamos trabajando para solucionarlo. Por favor, intenta nuevamente más tarde.</p>
        <p><a href="{{ url('/') }}">Volver al inicio</a></p>
    </div>
</body>
</html>
