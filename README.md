# Proyecto Node js con Typescript

¡Bienvenido(a) a este proyecto de Node js! A continuación, encontrarás las instrucciones necesarias para configurar, ejecutar y desplegar la aplicación, así como para estandarizar tu código y ejecutar pruebas unitarias.

## Requisitos previos

- **Node.js 22.5.1** o superior.

Asegúrate de verificar tu versión de Node.js con el siguiente comando:
```bash
node -v
```

- **TypeScript instalado globalmente**

Asegúrate de que TypeScript está instalado en tu sistema. Puedes verificarlo con el siguiente comando:
```bash
tsc -v
```
Si no lo tienes instalado, puedes hacerlo ejecutando:
```bash
npm install -g typescript
```

- **Ts-node instalado para correr servidor localmente**

ts-node para ejecutar archivos TypeScript directamente.
Comprueba si ts-node está disponible:
```bash
ts-node -v
```

Si no lo tienes instalado, puedes hacerlo con:

```bash
npm install -g ts-node
```

## Instalación

- Clona este repositorio o descarga los archivos en tu computadora.
- Desde la carpeta raíz del proyecto, ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias para ejecutar la aplicación.

## Ejecución en desarrollo

- Puedes ejecutar directamente el código de typescript con el comando:

```bash
npm run serve
```

o primero compilar el código a javascript con el comando:

```bash
npm run build
```

y luego correr el código javascript con:

```bash
npm start
```

## Estandarizar código y ejecutar pruebas

- Para verificar y estandarizar el código, ejecuta:
```bash
npm run lint
```
- Para ejecutar las pruebas unitarias, utiliza:
```bash
npm run test
```
