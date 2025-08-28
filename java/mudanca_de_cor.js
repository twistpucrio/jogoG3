document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("mudaCor");

  const cssPrincipal = document.getElementById("css_principal");
  const cssBox = document.getElementById("css_box");
  const cssFormat = document.getElementById("css_format");

  // aplica o tema salvo no localStorage (se existir)
  if (localStorage.getItem("acessibilidade") === "on") {
    cssPrincipal.setAttribute("href", "styles/acessibilidade.css");
    cssBox.setAttribute("href", "styles/box_acessibilidade.css");
    cssFormat.setAttribute("href", "styles/format_acessibilidade.css")
  }

  btn.addEventListener("click", () => {
    if (cssPrincipal.getAttribute("href") === "styles/estilo.css") {
      cssPrincipal.setAttribute("href", "styles/acessibilidade.css");
      cssBox.setAttribute("href", "styles/box_acessibilidade.css");
      cssFormat.setAttribute("href", "styles/format_acessibilidade.css");
      localStorage.setItem("acessibilidade", "on");
    } else {
      cssPrincipal.setAttribute("href", "styles/estilo.css");
      cssBox.setAttribute("href", "styles/box.css");
      cssFormat.setAttribute("href", "styles/format.css");
      localStorage.setItem("acessibilidade", "off");
    }
  });
});
