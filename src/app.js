import express from "express";
import http from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const PORT = 8080;

/* HANDLEBARS */
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

/* ENDPOINTS */
app.use("/", viewsRouter);

const mensajes = [
    {
        id: "El Bananero",
        mensaje: "Bienvenidos a un nuevo programa de RADIO GARKA......"
    }
]

/* WEBSOCKETS */
io.on("connection", (socket)=>{
    console.log("Nuevo usuario conectado correctamente");

    socket.on("nuevoUsuarioConectado", (username)=>{
        /* Enviamos el histrial de mensajes a solo el usuario que se conecto con nombre de usuario */
        socket.emit("historialDeMensajes", mensajes);
        /* Emitimos un evento de notificacion de un nuevo cliente menos al que se conecto */
        socket.broadcast.emit("notificacionNuevoUsuario", username);
    });

    socket.on("superChatMensaje", (dataMensaje)=>{
        const mensaje = {
            id: dataMensaje.username,
            mensaje: dataMensaje.nuevoMensaje
        }
        mensajes.push(mensaje);

        /* Enviamos el msj a todos los usuarios */
        io.emit("agregandoNuevoMensaje", mensaje);
    });

    socket.on("disconnect", (reason)=>{
        console.log(`Desconectado: ${
            reason
        }`);

        /**
         * transport close: cuando el cliente cierra la conexion
         * ping timeout: pierde la conexion de internet el cliente no responde al ping del servidor
         * server namespace disconnect: el servidor desconecta al cliente
         */
        /*socket.disconnect(true);*/
    })
});

server.listen(PORT, ()=>{
    console.log("Servidor iniciado correctamente http://localhost:8080/")
});