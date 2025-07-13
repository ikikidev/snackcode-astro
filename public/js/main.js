
function mostrarModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (modal) {
    modal.classList.add('show');
  }
}

function cerrarModal(id) {
  const modal = document.getElementById('modal-' + id);
  if (modal) {
    modal.classList.remove('show');
  }
}

// Cerrar al hacer clic fuera del contenido
document.addEventListener('click', function (e) {
  const modales = document.querySelectorAll('.modal-cybercute.show');
  modales.forEach(modal => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });
});

// Categoría automática según prefijo
function obtenerCategoria(clase) {
  if (clase.includes("btn")) return "Botones";
  if (clase.includes("text")) return "Texto";
  if (clase.includes("bg")) return "Fondos";
  if (clase.includes("alert")) return "Alertas";
  if (clase.includes("badge")) return "Badges";
  if (clase.includes("card")) return "Tarjetas";
  if (clase.includes("modal")) return "Modales";
  if (clase.includes("border")) return "Bordes";
  if (clase.includes("rounded")) return "Bordes redondeados";
  if (clase.includes("shadow")) return "Sombras";
  if (clase.includes("d-") || clase.includes("flex") || clase.includes("justify")) return "Display y Flex";
  if (clase.includes("row") || clase.includes("col")) return "Grid";
  if (clase.includes("form")) return "Formularios";
  return "Otros";
}



fetch("../data/bootstrap_todas_clases.json")
  .then((response) => response.json())
  .then((clases) => {
    const container = document.getElementById("cheatsheet-grid");

    // Clasificamos con categoría JSON o automática
    const categorias = {};
    clases.forEach((clase) => {
      const categoria =
        clase.category && clase.category.trim() !== ""
          ? clase.category
          : obtenerCategoria(clase.title); // fallback automático

      if (!categorias[categoria]) {
        categorias[categoria] = [];
      }
      categorias[categoria].push(clase);
    });

    // Generar tarjetas por categoría
    for (const [categoria, items] of Object.entries(categorias)) {
      const categoriaTitulo = document.createElement("h3");
      categoriaTitulo.textContent = categoria;
      categoriaTitulo.classList.add("mt-5", "mb-3", "text-cybercute");

      container.appendChild(categoriaTitulo);

      const row = document.createElement("div");
      row.classList.add("row", "g-4");

      items.forEach((item) => {
        const col = document.createElement("div");
        col.classList.add("col-md-4");

        const card = document.createElement("div");
        card.className = "clase-card p-4 rounded shadow-sm bg-white h-100";
        card.setAttribute("onclick", `mostrarModal("${item.id}")`);

        card.innerHTML = `
          <h5 class="fw-bold">${item.title}</h5>
          <p class="text-muted small">${item.description}</p>
        `;

        col.appendChild(card);
        row.appendChild(col);

        // Modal asociado
        const modal = document.createElement("div");
        modal.id = `modal-${item.id}`;
        modal.className = "modal-cybercute";

       modal.innerHTML = `
        <div class="modal-contenido">
          <button class="cerrar btn btn-sm btn-outline-secondary" onclick="cerrarModal('${item.id}')">✖</button>
          <h2>${item.title}</h2>
          <p>${item.description}</p>
          <div class="p-3 border rounded bg-light mb-2">${item.example}</div>
          <button class="btn btn-outline-primary btn-sm my-2 copiar-codigo" 
                  data-code="${item.example.replace(/"/g, '&quot;')}">
            📋 Copiar
          </button>
          <code>${item.example.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
        </div>
      `;


        document.body.appendChild(modal);
      });

      container.appendChild(row);
      
    }
  });

const btnTop = document.getElementById("btn-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    btnTop.classList.add("show");
  } else {
    btnTop.classList.remove("show");
  }
});

btnTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Buscador de clases
const buscador = document.getElementById("buscador");

const sinResultados = document.createElement("p");
sinResultados.id = "sin-resultados";
sinResultados.className = "text-muted mt-4 text-center";
sinResultados.style.display = "none";
sinResultados.innerText = "😢 No se encontraron clases con ese término.";
document.getElementById("cheatsheet-grid").after(sinResultados);

buscador.addEventListener("input", function (e) {
  const termino = e.target.value.toLowerCase();
  const tarjetas = document.querySelectorAll(".clase-card");
  let coincidencias = 0;

  tarjetas.forEach((card) => {
    const col = card.closest(".col-md-4");

    // Limpiar resaltados anteriores
    ["h5", "p"].forEach((tag) => {
      const el = card.querySelector(tag);
      if (el) {
        el.innerHTML = el.textContent;
      }
    });

    const titulo = card.querySelector("h5")?.textContent.toLowerCase() || "";
    const descripcion = card.querySelector("p")?.textContent.toLowerCase() || "";
    const categoria = card.closest(".row")?.previousElementSibling?.textContent.toLowerCase() || "";

    if (
      titulo.includes(termino) ||
      descripcion.includes(termino) ||
      categoria.includes(termino)
    ) {
      col.style.display = "block";
      coincidencias++;

      // Resaltar
      ["h5", "p"].forEach((tag) => {
        const el = card.querySelector(tag);
        if (el && termino) {
          const regex = new RegExp(`(${termino})`, "gi");
          el.innerHTML = el.textContent.replace(regex, `<span class="resaltado">$1</span>`);
        }
      });
    } else {
      col.style.display = "none";
    }
  });

  // Ocultar categorías sin tarjetas visibles
  const categorias = document.querySelectorAll("#cheatsheet-grid h3");
  categorias.forEach((h3) => {
    const row = h3.nextElementSibling;
    const visibles = row.querySelectorAll(".col-md-4:not([style*='display: none'])");
    h3.style.display = visibles.length > 0 ? "block" : "none";
    row.style.display = visibles.length > 0 ? "flex" : "none";
  });

  // Mostrar mensaje si no hay ninguna coincidencia
  sinResultados.style.display = coincidencias === 0 ? "block" : "none";
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("copiar-codigo")) {
    const code = e.target.getAttribute("data-code");
    if (!code) return;

    navigator.clipboard.writeText(code).then(() => {
      // Mostrar alerta visual
      const alerta = document.getElementById("alerta-copiado");
      alerta.classList.add("mostrar");

      setTimeout(() => {
        alerta.classList.remove("mostrar");
      }, 2000);
    });
  }
});

function abrirAyuda(){
     window.open("../ayuda.html", "Ayuda", "width=300,height=400,top=100,left=100");
}

function abrirVentanaHija(){
     const contenido = `
              <html>
              <head><title>Hija</title></head>
              <body style='font-family:sans-serif;text-align:center;padding:2rem'>
                <h2>Ventana hija</h2>
                <button onclick="window.opener.document.getElementById('mensaje-preview').textContent = 'Hola desde la ventana hija 👋'">
                  Enviar mensaje a la principal
                </button>
              </body>
              </html>
            `;
            const nuevaVentana = window.open("", "HijaDemo", "width=400,height=250");
            nuevaVentana.document.write(contenido);
            nuevaVentana.document.close();
}

