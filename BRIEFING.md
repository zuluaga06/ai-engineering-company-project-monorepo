# BRIEFING.md — TrackFlow

## Hito 1: Sitio Web Público de tu Empresa

_Estas instrucciones están [disponibles en inglés](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/contexts/01-web-fundamentals/trackflow-BRIEFING.en.md) ._

> Este documento describe tu empresa y la situación concreta para la que estás construyendo este hito. Léelo completo antes de escribir ningún código. Todo lo que construyes debe reflejar este contexto.

---

## Tu empresa

**TrackFlow** es una empresa de gestión de almacenes y entregas de última milla fundada en 2009 en Los Ángeles, Estados Unidos. Opera en dos mercados —Estados Unidos (Los Ángeles) y España (Zaragoza)— y ofrece tres servicios: gestión de almacenes para marcas de e-commerce, entregas de última milla (el último tramo desde el almacén hasta el cliente final), y logística inversa (devoluciones y reacondicionamiento de productos). Tiene aproximadamente 130 empleados y genera alrededor de 9 millones de euros en facturación anual. Sus clientes son marcas medianas de moda, electrónica y cosmética que venden en línea.

---

## Tu departamento y el problema que debes resolver

Trabajas en la unidad **TrackFlow Tech** , reportando directamente al CTO Andrés Kim. El sitio web corporativo actual de TrackFlow fue construido hace años por una agencia externa y está completamente desactualizado. No refleja que la empresa opera en dos países, no explica claramente los servicios, y no hay forma de que empresas interesadas soliciten información de manera estructurada. Miguel Torres (Director Comercial) necesita un sitio web profesional que presente los servicios de TrackFlow y capture leads de empresas potenciales que quieran externalizar su logística.

---

## Tu parte interesada

**Miguel Torres** , Director Comercial

> Hola,
>
> Necesitamos un nuevo sitio web que presente TrackFlow como lo que somos: un operador logístico serio con presencia en Estados Unidos y España. Debe explicar nuestros tres servicios principales: gestión de almacenes, última milla y logística inversa. También necesito una página con un formulario para que empresas interesadas puedan solicitar información. Actualmente nos llegan consultas muy vagas por email y perdemos mucho tiempo calificando si son clientes reales o no. Quiero capturar: datos de la empresa, tipo de producto que manejan, volumen mensual estimado de envíos, países donde operan, y qué servicios les interesan. El sitio debe ser responsivo, accesible y optimizado para SEO. Usa Tailwind y asegúrate de que el formulario tenga validación completa.

---

## Alcance de idioma

- El soporte multiidioma es **opcional pero altamente recomendado** para la operación de TrackFlow en Estados Unidos y España.
- Debes elegir un **idioma base** para toda la experiencia del sitio y del formulario.
- Si implementas un segundo idioma, trátalo como una mejora (sin reducir la calidad/completitud del idioma base).

## Contenido de la landing page

Tu página de destino debe incluir las siguientes secciones, en este orden:

### Encabezamiento

- Logo o nombre "TrackFlow"
- Navegación: Inicio | Servicios | Cobertura | contacto

### Héroe

- **Titular:** "Logística que escala con tu e-commerce"
- **Subtítulo:** "Gestión de almacenes, entregas de última milla y logística inversa en Estados Unidos y España. Más de 15 años ayudando a marcas de moda, electrónica y cosmética a crecer sin preocuparse por la operación".
- **Llamado a la acción:** Botón "Solicitar información" que enlace al formulario

### Servicios (3 columnas)

1. **Gestión de Almacenes**
   - Almacenamiento, recolección y embalaje.
   - Inventario en tiempo real
   - Operamos almacenes en Los Ángeles y Zaragoza
2. **Entregas de Última Milla**
   - Red de portadores certificados en ambos países
   - Seguimiento unificado de envíos
   - Gestión de incidencias y devoluciones
3. **Logística Inversa**
   - Gestión completa de devoluciones
   - Inspección y reacondicionamiento
   - Integración con tu plataforma de ventas

### Cobertura (2 columnas)

- **Estados Unidos**
  - Almacén en Los Ángeles
  - Cobertura nacional
  - Transportistas: UPS, FedEx, DHL
- **España**
  - Almacén en Zaragoza
  - Cobertura peninsular e islas
  - Transportistas: MRW, SEUR, DHL

### Por qué TrackFlow (4 beneficios)

- **Operación binacional:** El único operador con infraestructura propia en Estados Unidos y España
- **+130 profesionales** dedicados a tu logística
- **Tecnología propia** para visibilidad total de tu inventario.
- **Especialización e-commerce** en moda, electrónica y cosmética

### Contacto

- Correo electrónico: [comercial@trackflow.com](mailto:comercial@trackflow.com)
- Los Ángeles: +1 213 555 0147
- Zaragoza: +34 976 123 456

### Pie de página

- © 2025 TrackFlow. Todos los derechos reservados.
- LinkedIn

---

## Campos del formulario de solicitud de información

Tu formulario debe capturar la siguiente información:

| **Campo**                                 | **Tipo**           | **Validación**                                           | **Obligatorio** |
| ----------------------------------------- | ------------------ | -------------------------------------------------------- | --------------- |
| **Nombre de la empresa**                  | texto              | Mínimo 2 caracteres                                      | Si              |
| **Persona de contacto**                   | texto              | Mínimo 2 palabras (nombre y apellido)                    | Si              |
| **Correo electrónico corporativo**        | correo electrónico | Formato válido de email                                  | Si              |
| **Teléfono**                              | tel                | Formato: +[código país] [número]                         | Si              |
| **Sitio web de la empresa**               | URL                | Formato URL válido                                       | No              |
| **País de operación principal**           | seleccionar        | Estados Unidos / España / Ambos / Otro                   | Si              |
| **Tipo de producto**                      | seleccionar        | Moda / Electrónica / Cosmética / Alimentación / Otro     | Si              |
| **Volumen mensual estimado de envíos**    | seleccionar        | 0-100 / 101-500 / 501-2000 / 2000+ / No estoy seguro     | Si              |
| **Servicios de interés**                  | caja               | Almacenaje / Última milla / Logística inversa (múltiple) | Si              |
| **¿Actualmente trabajas con otro 3PL?**   | radio              | Sí / No / Estoy evaluando opciones                       | Si              |
| **Comentarios o necesidades específicas** | área de texto      | Máximo 500 caracteres                                    | No              |
| **Acepto política de privacidad**         | caja               | Debe estar marcado para enviar                           | Si              |

---

## Validaciones específicas

1. **Nombre de empresa:** Mínimo 2 caracteres
2. **Persona de contacto:** Debe contener al menos nombre y apellido
3. **Correo electrónico:** Debe ser formato válido (contener @ y dominio)
4. **Teléfono:** Debe comenzar con + seguido del código de país
5. **Sitio web:** Si se proporciona, debe ser URL válida (comenzar con http\:// o https\://)
6. **Servicios de interés:** Al menos uno debe estar seleccionado
7. **Comentarios:** Limitar a 500 caracteres con contador visible
8. **Política de privacidad:** El checkbox debe estar marcado para poder enviar

---

## Mensajes de error esperados

Cuando un campo no cumpla la validación, muestra estos mensajes específicos:

- **Nombre de empresa:** "El nombre de la empresa debe tener al menos 2 caracteres"
- **Persona de contacto:** "Ingresa nombre y apellido del contacto"
- **Correo electrónico:** "Ingresa un correo electrónico corporativo válido (ejemplo: [nombre@empresa.com](mailto:nombre@empresa.com) )"
- **Teléfono:** "El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)"
- **Sitio web:** "Si incluye sitio web, debe ser una URL válida"
- **País:** "Selecciona el país de operación principal"
- **Tipo de producto:** "Selecciona el tipo de producto que manejas"
- **Volumen mensual:** "Selecciona el volumen mensual estimado"
- **Servicios de interés:** "Selecciona al menos un servicio de interés"
- **3PL actual:** "Indica si actualmente trabajas con otro proveedor logístico"
- **Comentarios:** "Los comentarios no pueden exceder los 500 caracteres (quedan X)"
- **Política de privacidad:** "Debes aceptar la política de privacidad para continuar"

---

## Mensaje de éxito

Cuando el formulario se valide correctamente (envío simular), muestre:

> **¡Gracias por tu interés en TrackFlow!**
>
> Hemos recibido tu solicitud. Nuestro equipo comercial revisará tu información y te contactará en las próximas 24-48 horas para agendar una llamada y conocer tus necesidades logísticas en detalle.
>
> Si tienes alguna consulta urgente, escríbenos directamente a [comercial@trackflow.com](mailto:comercial@trackflow.com)

---

## Restricción específica

El formulario está diseñado para **empresas de comercio electrónico que buscan externalizar su logística** , no para consumidores finales que quieren rastrear un paquete o hacer una devolución. Si detecta que el volumen seleccionado es "0-100 envíos/mes" Y el campo "Tipo de producto" es relevante, incluya un mensaje de advertencia: "Para volúmenes menores a 100 envíos mensuales, nuestros servicios podrían no ser la solución más eficiente. ¿Seguro que quieres continuar?"

---

## Se requiere marcado Schema.org

Implementa el siguiente marcado Schema.org en tu página de inicio:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TrackFlow",
  "description": "Gestión de almacenes y entregas de última milla para e-commerce",
  "url": "https://trackflow.com",
  "foundingDate": "2009",
  "address": [
    {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressLocality": "Los Ángeles",
      "addressRegion": "California"
    },
    {
      "@type": "PostalAddress",
      "addressCountry": "ES",
      "addressLocality": "Zaragoza",
      "addressRegion": "Aragón"
    }
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-213-555-0147",
    "contactType": "sales",
    "availableLanguage": ["Spanish", "English"]
  },
  "sameAs": ["https://linkedin.com/company/trackflow"],
  "areaServed": [
    {
      "@type": "Country",
      "name": "Estados Unidos"
    },
    {
      "@type": "Country",
      "name": "Spain"
    }
  ]
}
```
