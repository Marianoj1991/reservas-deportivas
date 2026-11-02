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

1. Iniciá Docker Desktop y dejalo en funcionamiento.
2. En una segunda terminal de PowerShell, entrá a la copia local de la API de la cátedra y arrancala:

   ```powershell
   Set-Location "C:\Users\guard\Downloads\API\api-proyectos-mobile\api-reservas-deportivas"
   docker compose up
   ```

3. En una terminal nueva, corré `ipconfig` y buscá la dirección IPv4 de la computadora. Con el teléfono y la computadora en la misma Wi-Fi, verificá desde el navegador del teléfono que `http://TU_IP:3000/salud` responde.
4. En la raíz de esta app, copiá `.env.example` como `.env.local` y reemplazá `TU_IP` por esa dirección IPv4:

   ```powershell
   Copy-Item .env.example .env.local
   ```

5. Si Expo ya estaba abierto, detenelo con `Ctrl+C` y volvé a ejecutar `pnpm start`.

No uses `localhost` en `.env.local`: desde el teléfono, `localhost` apunta al propio teléfono, no a la computadora. Si la app no conecta, revisá el Wi-Fi y permití el puerto 3000 en el firewall de Windows.

## Lo que ya está implementado

- Catálogo de espacios con fotos de muestra, deporte, precio y ficha de características.
- Filtros por deporte y por complejo.
- Lectura de `/espacios` y `/deportes` de la API, con uso de los mocks mientras no se configure una dirección.
- Reintento visible si la API devuelve un error o no está disponible.

El resto del PRD —turnos, reservas, QR, notificaciones y administración— todavía necesita implementarse. La configuración de Expo y los assets de esta versión permiten abrir la app y seguir trabajando en esas tareas.
