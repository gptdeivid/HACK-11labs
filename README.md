# Ecos de Vida — Asistente de voz para compañía y reminiscencia

Ecos de Vida es una aplicación basada en Next.js que usa la plataforma de ElevenLabs para ofrecer un compañero de voz diseñado para brindar apoyo emocional, conversación significativa y estimulación cognitiva a adultos mayores.

Este repositorio adapta el starter kit de ElevenLabs y añade una personalidad centrada en acompañamiento (el "Sistema de Prompt Óptimo — ECOS DE VIDA") que guía el comportamiento de la IA por voz.

## Qué hace
- Conversación por voz en tiempo real pensada para compañía y reminiscencia.
- Adaptación al estado cognitivo y emocional del usuario (tonalidad, complejidad y ritmo).
- Guardado sencillo de historiales de sesión para revisión.
- Integración con voces de ElevenLabs para una experiencia conversacional natural.

## Principios y guardrails
- Personalidad: cálida, paciente, empática y sin juicio.
- Nunca ofrecer consejos médicos, legales o financieros.
- No solicitar datos personales innecesarios.
- Si detecta angustia, sugiere hablar con familiares o profesionales.
- Prioriza seguridad emocional, respeto y lenguaje sencillo.

## Estructura del proyecto (resumen)
- `app/`: Rutas y páginas de la aplicación (voces, música, efectos, conversación).
- `actions/`: Integraciones con la API de ElevenLabs y orquestación de audio.
- `components/`: UI reutilizable (botones, reproductores, barras laterales).
- `hooks/` y `providers/`: Lógica para estado, detección de móvil y manejo de sesiones.
- `public/`, `globals.css`, `tailwind.config.ts`: activos y estilos.

## Configuración rápida
1. Clona este repositorio

```bash
git clone https://github.com/elevenlabs/elevenlabs-nextjs-starter.git
cd elevenlabs-nextjs-starter
```

2. Copia el archivo de entorno y añade las claves necesarias

```bash
cp .env.example .env
# En .env añade tu clave:
# ELEVENLABS_API_KEY=tu_api_key
# IRON_SESSION_SECRET_KEY=generada_con_openssl
```

3. Instala dependencias y levanta la app

```bash
pnpm install
pnpm dev
```

Abre http://localhost:3000

## Personalizar el "Sistema de Prompt" (Ecos de Vida)
La personalidad y reglas que guían la IA están definidas como un prompt/plantilla en el código. Para adaptar el comportamiento (tono, ejemplos de conversación, reglas de guardrail), busca el archivo donde se construye el prompt del asistente (por ejemplo en `actions/` o en `lib/`) y modifica el texto siguiendo las pautas:
- Mantener tono cálido y lenguaje sencillo.
- Añadir datos de "Tapiz de Vida" (JSON con recuerdos/bio) para conversaciones personalizadas.

## Privacidad y uso responsable
- Los datos de conversación deben mantenerse locales o cifrados si se almacenan.
- Evita recolectar información sensible.
- Informar al usuario/consentimiento es responsabilidad de quien despliegue la aplicación.

## Tecnología
- Next.js 14 (app directory)
- ElevenLabs SDK (voz y diálogo)
- Tailwind CSS y `shadcn/ui`

## Contribuir
Si deseas mejorar el modelo de diálogo, la lógica de adaptación o añadir más contenidos de reminiscencia, crea una rama y abre un PR con una descripción clara de los cambios.

---

Si quieres, puedo agregar un archivo `SYSTEM_PROMPT.md` con la versión final del prompt "ÓPTIMO — ECOS DE VIDA" para tenerlo listo y separado del código. ¿Lo genero ahora?
