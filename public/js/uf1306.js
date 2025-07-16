document.addEventListener("DOMContentLoaded", () => {
  const raw = document.getElementById("respuestas-json")?.textContent;

  let respuestas = {};
  try {
    respuestas = JSON.parse(raw);
  } catch (err) {
    console.error("❌ Error al parsear respuestas:", err.message);
    return;
  }

  const form = document.getElementById("testForm");
  const btn = document.getElementById("comprobarBtn");
  const resultado = document.getElementById("resultado");

  if (!form || !btn) {
    console.warn("Formulario o botón no encontrados.");
    return;
  }

  btn.addEventListener("click", () => {
    let aciertos = 0;

    for (const id in respuestas) {
      const radios = form.elements[id];
      const seleccionada = Array.from(radios).find(r => r.checked);
      const fieldset = document.getElementById("pregunta-" + id.slice(1));
      fieldset?.classList.remove("correcta", "incorrecta");

      if (seleccionada) {
        if (seleccionada.value === respuestas[id]) {
          fieldset?.classList.add("correcta");
          aciertos++;
        } else {
          fieldset?.classList.add("incorrecta");
        }
      }
    }

    const total = Object.keys(respuestas).length;
    resultado.textContent = `✅ Has acertado ${aciertos} de ${total} preguntas.`;
    
    if (aciertos === total) {
        confetti({
        particleCount: 300,
        spread: 120,
        colors: ['#cdb4db', '#ffc8dd', '#bde0fe', '#a2d2ff'],
        scalar: 1.2,
        origin: { y: 0.6 }
        });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
