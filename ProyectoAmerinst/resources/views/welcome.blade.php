<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Colegio Amerinst - Bienvenidos</title>
    <link rel="stylesheet" href="style.css"> <!-- Enlace a tu CSS personalizado -->
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
        }

        /* Estilos para el NavBar */
        .navbar {
            background-color: #b4140a;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
        }
        .navbar .brand {
            font-size: 24px;
            font-weight: bold;
        }
        .navbar input[type="search"] {
            padding: 5px;
            width: 200px;
        }
        .navbar .actions {
            display: flex;
            gap: 15px;
        }
        .navbar .actions a {
            color: #fff;
            text-decoration: none;
            padding: 10px 15px;
            background-color: #333;
            border-radius: 5px;
        }
        .navbar .actions a:hover {
            background-color: #555;
        }
        .navbar .language-select {
            margin-left: 20px;
        }

        .header {
            background-color: #b4140a;
            color: #fff;
            padding: 20px;
            text-align: center;
            position: relative;
        }
        .header img {
            position: absolute;
            top: -100px;
            left: 70px;
            height: 170px; /* Ajusta la altura */
            width: auto;  /* Esto mantiene la proporción del logo */
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .info-section {
            background-color: #fff;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
        }
        .info-section h2 {
            color: #b4140a;
        }
        .info-section p {
            font-size: 18px;
            line-height: 1.6;
        }
        .footer {
            background-color: #b4140a;
            color: #fff;
            text-align: center;
            padding: 20px;
            margin-top: 20px;
        }
        .footer a {
            color: #fff;
            margin: 0 10px;
            text-decoration: none;
        }
        img {
             width: 300px; /* Ajusta el ancho de la imagen */
             height: auto; /* Mantiene la proporción de la imagen */
             margin: 100px auto; /* Centra la imagen horizontalmente */
             display: block; /* Para asegurar que las imágenes se muestren en bloque */
        }
    </style>
</head>
<body>

    <!-- NavBar -->
    <nav class="navbar">
        <div class="brand">Colegio Amerinst</div>
        <div class="search-bar">
            <input type="search" placeholder="Buscar...">
        </div>
        <div class="actions">
            <a href="{{ route('CrudPadres') }}">Sign Up</a>
            <a href="{{ route('login') }}">Sign In</a>
            <a href="{{ route('loginAdministradores') }}">Login Administradores</a>
            <a href="{{ route('crudAdministradores') }}">CRUD Administradores</a>
            <a href="{{ route('crudAdministrativos') }}">CRUD Administrarivos</a>
            <a href="{{ route('loginAdministrativos') }}">Login Administrativos</a>

            
            <!-- Cambio de idioma -->
            <select class="language-select">
                <option value="es">Español</option>
                <option value="en">English</option>
            </select>
        </div>
    </nav>

    <div class="header">
        <img src="https://amerinst.edu.bo/wp-content/uploads/2022/01/LOGOpng_AMERINST-1024x1024.png" alt="Logo Colegio Amerinst"> <!-- Aquí va el logo con la URL -->
        <h1>Bienvenidos al Colegio Amerinst</h1>
        <p>Instituto Americano de La Paz, Bolivia</p>
    </div>

    <div class="container">
        <div class="info-section">
            <h2>Nuestra Historia</h2>
            <p>Desde la ascensión de los liberales al gobierno, las condiciones políticas y sociales del país habían variado sustancialmente. El movimiento liberal se basó en la ideología de libertad, civilización, progreso y laicismo y, por ende, anticlerical. En ese proceso de fomentar los elementos y postulados nuevos y progresistas de conducir al país hacia la modernización se estableció la Iglesia Metodista en Bolivia. Es en ese sentido que, para alcanzar sus objetivos, los liberales pretendieron valerse de las instituciones sociales y religiosas con tendencias y objetivos afines a sus postulados ideológicos, viendo a los protestantes como un agente alternativo de cambio, de civilización y progreso. Fue así que, durante el régimen liberal, la educación fue privilegiada para cambiar las mentalidades difundiendo las nociones de progreso, para lo cual habían alentado y buscado contactos con el fin de promover la educación pública y laica. Como consecuencia, los esfuerzos educativos de los liberales correspondían a su percepción de que la educación era importante para desarrollar y civilizar el país. Además, consideraban que el crecimiento económico requería de una fuerza de trabajo educada y disciplinada.
                Los antecedentes mencionados conformaron el contexto adecuado en el que el proyecto educativo metodista se insertó y fue parte de ese proceso histórico liberal, al incorporar a la sociedad tradicional el mundo de la sociedad moderna, a través de la educación. Por otro lado, en ese marco socio-político había mucha inquietud de parte de familias privilegiadas de La Paz en cuanto a la necesidad de contar con colegios y escuelas de calidad similares a las de otros países. Por muchos años, esas familias habían enviado a sus hijos a estudiar a colegios de Chile, Argentina, Perú y Europa, entre ellos al «English College» de Iquique de la Iglesia Metodista chilena. Por esta sentida necesidad, se manifestó un interés abierto para que se estableciera en la ciudad de La Paz un trabajo similar, porque hacia 1900 en La Paz sólo se contaba con reducidos centros educativos hegemonizados por los católicos, como el colegio para varones San Calixto, dirigido por los jesuitas; el colegio nacional y seminarios de artes y oficios que estaban bajo la dirección de los salesianos, todos destinados a la clase privilegiada. De igual manera, había colegios para señoritas como el Sagrados Corazones, Santa Ana y Buen Pastor, entre otros, donde se educaba un crecido número de estudiantes.
                En ese contexto político liberal y en ese clima de necesidades educativas en el país, Francis M. Harrington, como representante de la Sociedad Misionera Metodista Episcopal y como experimentado educador, además de iniciar la obra congregacional, comenzó a gestionar la propuesta de un proyecto educativo ante el Ministerio de Justicia e Instrucción Pública, solicitando su protección y ayuda para organizar los colegios en La Paz y Oruro, comprometiéndose a desarrollar la enseñanza primaria y secundaria conforme a las leyes, reglamentos, plan de estudios y programas dictados en Bolivia.</p>
            <img src="https://amerinst.edu.bo/wp-content/uploads/2022/01/19-scaled.jpg" alt="Descripción de la imagen">
        </div>

        <div class="info-section">
            <h2>El proyecto Educativo</h2>
            <p>Ese proyecto educativo que se implantó en el país fue como una estrategia misionera para la evangelización y para lograr mayor receptividad de la sociedad. Además, por medio de la educación, se pretendía difundir los principios y valores morales y cristianos en los educandos. En ese propósito, encontró el consentimiento y apoyo del gobierno liberal, ya que, por una parte, respondía a las expectativas y postulados del proyecto liberal en su tarea de subvertir normas, valores e instituciones tradicionales, e incorporarlo al mundo moderno. El misionero tuvo éxito en su objetivo, tal como lo señaló su esposa: Francis ya tuvo cómo planear una escuela. Él ya había adelantado sus solicitudes ante el Ministerio de Educación, presentando sus planes y propósitos ante esa autoridad. El Ministro manifestó su más amplio deseo de cooperación entusiasta, diciendo Mr. Harrington, si Ud. cumple su propósito, construiré un monumento en su honor.</p>
            <img src="https://amerinst.edu.bo/wp-content/uploads/2022/01/01-FRANCIS-MARION-HARRINGTON-1906-a-1908-scaled.jpg" alt="Descripción de la imagen">
        </div>

        <div class="info-section">
            <h2>Pilares</h2>
            <p>Se basa en pilares sólidos en distintas esferas: en el área académica, en el desarrollo de habilidades, valores y conducta íntegra.</p>
            <img src="https://amerinst.edu.bo/wp-content/uploads/2022/01/GTO_0628-scaled.jpg" alt="Descripción de la imagen">
        </div>
    </div>

    <!-- Footer con links a redes sociales -->
    <div class="footer">
        <p>&copy; Copyright © 2024 Instituto Americano La Paz Bolivia</p>
        <h2>Contacto</h2>
        <p>Av. 20 de octubre N°1928<br>Teléfonos: 242 3046 – 242 3352 – 242 4121</p>
        <p>
            <a href="https://www.facebook.com/profile.php?id=61564139076612&locale=es_LA" target="_blank">Facebook</a> |

        </p>
    </div>

</body>
</html>
