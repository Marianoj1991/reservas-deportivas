# Reservas Deportivas

Aplicación móvil para consultar espacios deportivos de Villaguay. Está hecha con React Native, Expo y TypeScript.

## Probar la app en una computadora o un teléfono

Necesitás Node.js 22 o superior, pnpm 10 y Expo Go en el teléfono.

```powershell
npm install --global pnpm@10.34.6
pnpm install
pnpm start
```

La primera vez, escaneá con Expo Go el código QR que aparece en la terminal. El teléfono y la computadora tienen que estar conectados a la misma red Wi-Fi. Si no tenés la API configurada, la app muestra el catálogo de demostración y no necesita conexión a internet para mostrar sus imágenes.

## Conectar la API de la cátedra

La app consulta `GET /espacios` y `GET /deportes`. Sin configuración usa los mocks locales; cuando configurás la API, muestra sus datos y también sus errores de conexión, sin ocultarlos.

1. Descargá o cloná el [repositorio de la API de la cátedra](https://github.com/franco-ruisdias-uner/api-proyectos-mobile) y ubicá la carpeta `api-reservas-deportivas`.
2. Iniciá Docker Desktop y dejalo en funcionamiento. No hace falta crear un contenedor manualmente.
3. Abrí una terminal en la carpeta `api-reservas-deportivas` y arrancá la API:

   ```powershell
   docker compose up
   ```

   Dejá esa terminal abierta mientras uses la API. Cuando veas el mensaje de que está lista, podés comprobar en la computadora que `http://localhost:3000/salud` muestra `{"datos":{"estado":"ok",...}}`.
4. Para conectar un teléfono, verificá que esté en la misma Wi-Fi que la computadora. En Windows, ejecutá `ipconfig` en una terminal y buscá la dirección IPv4 de la conexión activa; en macOS o Linux, consultá la dirección IP en la configuración de red.
5. En la raíz de esta app, copiá `.env.example` como `.env.local`:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Editá `.env.local` y reemplazá `TU_IP` con la dirección IPv4 de la computadora. Por ejemplo, si la dirección fuera `192.168.1.25`:

   ```dotenv
   EXPO_PUBLIC_API_URL=http://192.168.1.25:3000
   ```

6. Desde la raíz de esta app, ejecutá `pnpm start` en otra terminal. Si Expo ya estaba abierto, detenelo con `Ctrl+C` y volvé a iniciarlo. Escaneá el QR con Expo Go.

No uses `localhost` en `.env.local` cuando pruebes desde el teléfono: allí `localhost` apunta al propio teléfono, no a la computadora. Si el teléfono no puede abrir `http://TU_IP:3000/salud`, revisá que ambos dispositivos estén en la misma Wi-Fi y que el firewall de la computadora permita conexiones al puerto 3000. No subas `.env.local` al repositorio.

## Lo que ya está implementado

- Catálogo de espacios con fotos de muestra, deporte, precio y ficha de características.
- Filtros por deporte y por complejo.
- Lectura de `/espacios` y `/deportes` de la API, con uso de los mocks mientras no se configure una dirección.
- Reintento visible si la API devuelve un error o no está disponible.

El resto del PRD —turnos, reservas, QR, notificaciones y administración— todavía necesita implementarse. La configuración de Expo y los assets de esta versión permiten abrir la app y seguir trabajando en esas tareas.
