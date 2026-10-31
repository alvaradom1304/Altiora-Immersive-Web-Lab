# Altiora · Auditoría de licencias de referencias visuales

Revisión inicial realizada el **30 de octubre de 2026** directamente sobre archivos de licencia, README o metadatos del proyecto original. **Este informe no constituye asesoramiento legal ni autoriza a instalar o redistribuir automáticamente componentes.**

## Resultado

**11 repositorios revisados** que antes carecían de licencia identificada en el catálogo. El estado de cada uno quedó registrado junto a su fuente en [visual-libraries-2026.json](visual-libraries-2026.json).

| Proyecto | Evidencia primaria | Decisión |
|---|---|---|
| [Lygia](https://github.com/patriciogonzalezvivo/lygia/blob/main/LICENSE.md) | Prosperity Public License 3.0.0; gratis no comercial y prueba comercial limitada | **HOLD comercial**: no utilizar en proyectos del cliente sin permiso/licencia específica |
| [OpenUSD](https://github.com/PixarAnimationStudios/OpenUSD/blob/dev/LICENSE.txt) | Tomorrow Open Source Technology License 1.0, distinta en cláusula de marcas respecto de Apache 2.0 | HOLD hasta revisión de términos, marcas y notices para distribución |
| [Open3D](https://github.com/isl-org/Open3D/blob/main/LICENSE) | MIT en archivo principal | Evaluar dependencias y versiones |
| [Slang](https://github.com/shader-slang/slang/blob/master/LICENSE) | Apache 2.0 con excepción LLVM | Evaluar dependencias y toolchain |
| [OGL](https://github.com/oframe/ogl/blob/master/README.md) | Unlicense en README y package.json | Evaluar alcance de archivos y dependencias |
| [luma.gl](https://github.com/visgl/luma.gl/blob/master/LICENSE) | MIT con avisos de componentes externos | Evaluar terceros |
| [SVG.js](https://github.com/svgdotjs/svg.js/blob/master/LICENSE.txt) | Licencia estilo MIT en texto principal | Evaluar versión exacta |
| [OpenToonz](https://github.com/opentoonz/opentoonz/blob/master/LICENSE.txt) | BSD 3-Clause principal, excepciones en thirdparty, pinceles y porciones adaptadas | Referencia; evaluar avisos antes de distribuir |
| [Assimp](https://github.com/assimp/assimp/blob/master/LICENSE) | Licencia primaria tipo BSD, excepción en test/models-nonbsd y terceros | Evaluar por componente |
| [Shaderc](https://github.com/google/shaderc/blob/main/LICENSE) | Apache 2.0 en raíz, con dependencias | HOLD por costo/compatibilidad del build |
| [Adobe CEP Resources](https://github.com/Adobe-CEP/CEP-Resources/blob/master/README.md) | README enlaza términos Adobe SDK en PDF; no se identificó LICENSE abierto simple en raíz | HOLD. Leer los términos SDK completos y verificar licencia del host |

### Control preventivo

La comprobación `npm run check` exige que Lygia permanezca marcada como HOLD y evita presentarla como una librería comercial aprobada. El Director Audiovisual debe elegir shaders propios o herramientas cuya licencia sea adecuada y verificable.

El resto del catálogo conserva **riesgos por revisar**: que un repositorio publique MIT/Apache/BSD no verifica automáticamente licencias de assets, modelos, tipografías, plugins o dependencias.

### Lectura correcta de las cifras

- **70**: referencias catalogadas, no paquetes instalados ni conectores activos.
- **11**: fuentes primarias de licencia examinadas en esta revisión.
- Los metadatos del Tech Scout pueden mostrar `NOASSERTION` incluso cuando el archivo principal es identificable: son capas diferentes.
- La aprobación comercial exige evidencia para versión y uso específicos, más revisión del Director/QA.

### Checklist para una adopción

1. Versión exacta y commit fijados.
2. Licencia raíz y subcomponentes/activos revisados.
3. Seguridad y scripts de instalación auditados.
4. Prueba aislada con reversión posible.
5. Comparativa visual y rendimiento frente a alternativa existente.
6. Autorización antes de incorporar en cliente, especialmente licencias de evaluación, software cerrado, UXP o SDK.
