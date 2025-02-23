const socket = io();

const getUserName = async () => {
    const data = await Swal.fire({
        title: "Ingrese su nombre de usuario",
        input: "text",
        inputLabel: "Este nombre se utilizará en el chat",
        allowOutsideClick: false,
        inputValidator: (username) => {
            if (!username) {
                return "Es obligatorio ingresar un nombre de usuario";
            }
        },
        background: "#3d3d3d",
        color: "#ffffff",
        confirmButtonColor: "#1c7373",
        inputAttributes: {
            style: "background-color: #000; color: white; border: 1px solid #1c7373;"
        }
    });

    return data.value;
};

const mostrarNuevoUsuarioConectado = (username) => {
    Toastify({
        text: `${username} se ha conectado`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#1c7373",
    }).showToast();
};



const main = async() => {
    const username = await getUserName();
    /* Despues de recibir el usuario */
    socket.emit("nuevoUsuarioConectado", username);

    socket.on("historialDeMensajes", (mensajes)=>{
        const contenedorChat = document.getElementById("contenedorSuperChat");

        mensajes.forEach(({id, mensaje})=>{
            const nuevoMensaje = document.createElement("div");
            nuevoMensaje.classList.add("mensaje");
            nuevoMensaje.innerHTML = `
            <h4 class="nombreUsuario">${id}</h4>
            <p class="textoMensaje">${mensaje}</p>
        `;
        contenedorChat.appendChild(nuevoMensaje);

        });
    });

    socket.on("notificacionNuevoUsuario", (username)=>{
        mostrarNuevoUsuarioConectado(username);
    });

    socket.on("agregandoNuevoMensaje", ({ id, mensaje }) => {
        const contenedorChat = document.getElementById("contenedorSuperChat");
        const nuevoMensaje = document.createElement("div");
        nuevoMensaje.classList.add("mensaje");
        nuevoMensaje.innerHTML = `
            <h4 class="nombreUsuario">${id}</h4>
            <p class="textoMensaje">${mensaje}</p>
        `;

        contenedorChat.appendChild(nuevoMensaje);
    });

    /* Capturamos el form y el input */
    const formSuperChat = document.getElementById("formSuperchat");
    const inputSuperChat = document.getElementById("inputSuperChat");

    formSuperChat.addEventListener("submit", (e)=>{
        e.preventDefault();

        const nuevoMensaje = inputSuperChat.value;
        inputSuperChat.value = "";
        socket.emit("superChatMensaje", {username, nuevoMensaje});
    });
}

main();