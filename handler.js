// handler.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    // --- LECTURA DE DATOS ---
    const filePath = path.join(__dirname, 'users.json');
    const usersData = fs.readFileSync(filePath, 'utf8');
    // Si el archivo está vacío, inicializamos como un array vacío para evitar errores
    const users = usersData ? JSON.parse(usersData) : [];

    // --- ANÁLISIS DEL EVENTO (CORREGIDO) ---
    // Hacemos la función más robusta, aceptando el objeto de entrada de varias formas
    let requestBody;
    if (event.body) {
      requestBody = JSON.parse(event.body);
    } else {
      requestBody = event; // Para pruebas locales o invocaciones directas
    }

    // --- VALIDACIÓN DE DATOS ---
    if (!requestBody || !requestBody.name || !requestBody.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Error: los campos 'name' y 'email' son obligatorios." })
      };
    }

    // --- LÓGICA DE NEGOCIO ---
    // Agregar el nuevo usuario al array
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1, // ID más seguro
      name: requestBody.name,
      email: requestBody.email,
      timestamp: new Date().toISOString()
    };
    users.push(newUser);

    // --- ESCRITURA DE DATOS ---
    // Guardar el array de usuarios actualizado
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    // --- RESPUESTA EXITOSA ---
    return {
      statusCode: 201, // 201: Created
      body: JSON.stringify({ message: "Usuario registrado con éxito!", user: newUser })
    };

  } catch (error) {
    console.error('Error en el handler:', error);
    return {
      statusCode: 500, // Error interno del servidor
      body: JSON.stringify({ message: "Error interno del servidor." })
    };
  }
};