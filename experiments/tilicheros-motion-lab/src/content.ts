/**
 * Editable content contract — commercial claims must be verified for each product.
 * Never replace "concept" status with a real offer without authentic media and approval.
 */
export type AdContent = {
  brand: string;
  eyebrow: string;
  outroLabel: string;
  atmosphere: "cyber" | "dream" | "soft";
  category: string;
  hook: string;
  highlight: string;
  valueLine: string;
  callToAction: string;
  footer: string;
  productImage: string;
  artworkDisclaimer: string;
  background: string;
  accent: string;
  accentSecondary: string;
};

export const defaultContent: AdContent = {
  brand: "TILICHEROS",
  eyebrow: "UN NUEVO NIVEL",
  outroLabel: "ENCONTRALO EN",
  atmosphere: "cyber",
  category: "GAMING · TECNOLOGÍA",
  hook: "EL JUEGO",
  highlight: "CAMBIA AQUÍ.",
  valueLine: "Descubrí opciones para tu setup.",
  callToAction: "CONSULTÁ DISPONIBILIDAD",
  footer: "Escribinos para conocer el catálogo.",
  productImage: "assets/product-concept.svg",
  artworkDisclaimer: "VISUAL CONCEPTUAL · NO REPRESENTA UN PRODUCTO REAL",
  background: "#070815",
  accent: "#9B72FF",
  accentSecondary: "#00E7FF",
};
