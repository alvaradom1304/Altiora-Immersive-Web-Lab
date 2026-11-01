// Activa cada paso de la escena al entrar en pantalla. Sin JS el contenido sigue visible:
// la clase .visible solo atenúa pasos cuando hay movimiento permitido (ver styles.css).
(() => {
  const pasos = document.querySelectorAll('.paso');
  if (!pasos.length || !('IntersectionObserver' in window)) {
    pasos.forEach((p) => p.classList.add('visible'));
    return;
  }
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.4 });
  pasos.forEach((p) => observador.observe(p));
})();
