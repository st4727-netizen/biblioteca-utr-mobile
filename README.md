# Biblioteca Universitaria UTR – Aplicación Móvil

Aplicación móvil del Sistema de Control de Biblioteca Universitaria UTR, desarrollada como proyecto final integrador de Ingeniería en Desarrollo y Gestión de Software.

Permite a los estudiantes consultar el catálogo de libros, solicitar préstamos y consultar su historial desde un dispositivo Android o iOS.

## Tecnologías utilizadas

- React Native
- Expo SDK 58
- JavaScript
- React Navigation
- Expo Secure Store
- Fetch API
- API RESTful

## Funcionalidades

- Inicio de sesión.
- Registro de usuarios.
- Consulta del catálogo de libros.
- Solicitud de préstamos.
- Consulta de préstamos personales.
- Persistencia segura de la sesión.
- Comunicación con la API REST mediante doble autenticación.

## Arquitectura de seguridad

La aplicación utiliza dos encabezados para comunicarse con la API:

- `x-api-token`: identifica y autoriza a la aplicación cliente.
- `Authorization: Bearer <user_jwt_token>`: autentica al usuario y determina sus permisos.

La sesión se almacena de forma segura mediante `expo-secure-store`.

## Requisitos previos

- Node.js
- npm
- Expo CLI mediante `npx`
- Expo Go para pruebas en dispositivo físico
- Android Studio y Android SDK para generar el APK localmente.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/st4727-netizen/biblioteca-utr-mobile.git
```

Entrar al proyecto:

```bash
cd biblioteca-utr-mobile
```

Instalar dependencias:

```bash
npm install
```

## Configuración de variables de entorno

Crear el archivo `.env` a partir de `.env.example`.

Configurar las siguientes variables:

```env
EXPO_PUBLIC_API_URL=https://proyecto-idgs9-v1.onrender.com
EXPO_PUBLIC_API_APP_TOKEN=TU_TOKEN_DE_APLICACION
```

Sustituir `TU_TOKEN_DE_APLICACION` por el token proporcionado para el proyecto.

No compartir ni subir el archivo `.env` al repositorio.

## Ejecución

Iniciar Expo:

```bash
npx expo start
```

Para limpiar la caché:

```bash
npx expo start -c
```

La aplicación puede ejecutarse mediante Expo Go o un emulador Android compatible.

## API

URL base:

https://proyecto-idgs9-v1.onrender.com

Documentación de endpoints:

https://proyecto-idgs9-v1.onrender.com/api/docs/

## Estructura general

```text
biblioteca-utr-mobile/
├── assets/
├── src/
│   ├── context/
│   ├── navigation/
│   ├── screens/
│   └── services/
├── App.js
├── app.json
├── index.js
├── package.json
├── .env.example
└── README.md
```

## Generación del APK

La compilación se realizará localmente mediante Expo Prebuild y Gradle, utilizando Android SDK.

```bash
npx expo prebuild --platform android
```

Después, desde la carpeta `android`, ejecutar:

```bash
./gradlew assembleRelease
```

El APK generado se encontrará en:

```text
android/app/build/outputs/apk/release/app-release.apk
```

## Proyecto académico

**Universidad Tecnológica El Retoño (UTR)**

Ingeniería en Desarrollo y Gestión de Software – 9.º Cuatrimestre.

Proyecto Final Integrador Transversal.

Asignatura: Desarrollo para Dispositivos Inteligentes (React Native + Expo).

Periodo: Noviembre – Diciembre de 2026.
