
// ===============================
// ESTADO GLOBAL
// ===============================

let usuarioActual = null;

let objetos = JSON.parse(localStorage.getItem("objetos")) || [];

// ===============================
// LOGIN
// ===============================

function login() {

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    if (usuario === "usuario" && password === "123") {
        usuarioActual = usuario;
    }
    else if (usuario === "admin" && password === "123") {
        usuarioActual = usuario;
    }
    else {
        alert("Credenciales incorrectas");
        return;
    }

    document.getElementById("loginContainer").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    document.getElementById("bienvenida").innerText =
        "Bienvenido " + usuarioActual;

    iniciarReloj();
    mostrarObjetos();
    actualizarDashboard();
}

// ===============================
// LOGOUT
// ===============================

function logout() {
    location.reload();
}

// ===============================
// RELOJ
// ===============================

function iniciarReloj() {

    setInterval(() => {

        document.getElementById("reloj").innerText =
            new Date().toLocaleString();

    }, 1000);
}

// ===============================
// CONVERTIR IMAGEN A BASE64
// ===============================

function leerImagen(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });
}

// ===============================
// REGISTRAR OBJETO
// ===============================

async function registrarObjeto() {

    precisionGPS: true

    const nombre = document.getElementById("nombreObjeto").value;
    const categoria = document.getElementById("categoria").value;
    const descripcion = document.getElementById("descripcionLugar").value;
    const fotoInput = document.getElementById("fotoObjeto");

    if (!nombre || !categoria) {
        alert("Complete los campos obligatorios");
        return;
    }

    let imagenBase64 = "";

    if (fotoInput.files.length > 0) {
        imagenBase64 = await leerImagen(fotoInput.files[0]);
    }

    const objeto = {

        id: Date.now(),

        nombre,
        categoria,
        descripcion,
        imagen: imagenBase64,

        fecha: new Date().toISOString().split("T")[0],

        hora: new Date().toLocaleTimeString()

    };

    objetos.push(objeto);

    try{
        localStorage.setItem("objetos", JSON.stringify(objetos));
        alert("Objeto registrado correctamente");
    } catch (e) {
        alert("Error inesperado al guardar el objeto,imagen demasiado pesada, el mismo estará disponible durante esta sesión pero no luego de reiniciar la app");
    }
    

    

    limpiarFormulario();

    mostrarObjetos();

    actualizarDashboard();
}

// ===============================
// LIMPIAR FORM
// ===============================

function limpiarFormulario() {

    document.getElementById("nombreObjeto").value = "";
    document.getElementById("descripcionLugar").value = "";
    document.getElementById("fotoObjeto").value = "";
}

// ===============================
// MOSTRAR OBJETOS
// ===============================

function mostrarObjetos(lista = objetos) {

    const contenedor = document.getElementById("contenedorObjetos");

    contenedor.innerHTML = "";

    lista.forEach(obj => {

        contenedor.innerHTML += `
        <div class="objeto" onclick="verDetalle(${obj.id})">

            <img src="${obj.imagen || 'fondo.jpg'}">

            <div class="objeto-info">

                <h3>${obj.nombre}</h3>

                <p>${obj.categoria}</p>

                <p>${obj.fecha}</p>

            </div>

        </div>
        `;
    });
}

// ===============================
// BUSCAR OBJETO
// ===============================

function buscarObjeto() {

    const texto = document.getElementById("textoBusqueda").value.toLowerCase();

    const filtrados = objetos.filter(o =>
        o.nombre.toLowerCase().includes(texto)
    );

    mostrarObjetos(filtrados);
}

// ===============================
// VER DETALLE
// ===============================

function verDetalle(id) {

    const obj = objetos.find(o => o.id === id);

    if (!obj) return;

    document.getElementById("detalleObjeto").classList.remove("hidden");

    document.getElementById("detalleImagen").src = obj.imagen;
    document.getElementById("detalleNombre").innerText = obj.nombre;
    document.getElementById("detalleCategoria").innerText = obj.categoria;
    document.getElementById("detalleLugar").innerText = obj.descripcion;
    document.getElementById("detalleFecha").innerText = obj.fecha;
    document.getElementById("detalleHora").innerText = obj.hora;

    document.getElementById("detalleTiempo").innerText =
        calcularTiempo(obj.fecha, obj.hora);
}

// ===============================
// CERRAR DETALLE
// ===============================

function cerrarDetalle() {
    document.getElementById("detalleObjeto").classList.add("hidden");
}

// ===============================
// CALCULAR TIEMPO TRANSCURRIDO
// ===============================

function calcularTiempo(fecha, hora) {

    const inicio = new Date(fecha + " " + hora);
    const ahora = new Date();

    const diff = ahora - inicio;

    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    return `${dias} días, ${horas % 24} horas, ${minutos % 60} minutos`;
}

// ===============================
// DASHBOARD
// ===============================

function actualizarDashboard() {

    document.getElementById("totalObjetos").innerText = objetos.length;

    const categorias = {};

    objetos.forEach(o => {
        categorias[o.categoria] = (categorias[o.categoria] || 0) + 1;
    });

    let maxCat = "-";
    let maxVal = 0;

    for (let c in categorias) {
        if (categorias[c] > maxVal) {
            maxVal = categorias[c];
            maxCat = c;
        }
    }

    document.getElementById("categoriaPrincipal").innerText = maxCat;

    if (objetos.length > 0) {
        document.getElementById("ultimoRegistro").innerText =
            objetos[objetos.length - 1].nombre;
    }
}

