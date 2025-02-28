const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const FILE_PATH = "reg.json";

// Cargar usuarios registrados
let users = [];
if (fs.existsSync(FILE_PATH)) {
    users = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
}

// Ruta de registro
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    // Verificar si el nombre o correo ya existen
    if (users.some(user => user.name === name)) {
        return res.json({ success: false, error: "nombre_duplicado" });
    }
    if (users.some(user => user.email === email)) {
        return res.json({ success: false, error: "correo_duplicado" });
    }

    // Crear nuevo usuario
    const newUser = {
        userID: "ID-" + Math.random().toString(36).substr(2, 9),
        name,
        email,
        password
    };
    users.push(newUser);

    // Guardar en archivo
    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));

    res.json({ success: true, userID: newUser.userID });
});

// Iniciar el servidor
app.listen(3000, () => console.log("Servidor en http://localhost:3000"));