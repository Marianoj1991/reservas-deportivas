import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { Colors, type Tema } from "@/src/constants/theme";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import {
  catalogoDesdeApi,
  obtenerDeportesServicio,
  obtenerEspaciosServicio,
} from "@/src/services/espacios.service";
import type { Deporte, Espacio } from "@/src/types";

const IMAGENES_DE_MUESTRA = {
  "esp-01": require("../../assets/images/courts/soccer-5-1.png"),
  "esp-02": require("../../assets/images/courts/soccer-5-2.png"),
  "esp-03": require("../../assets/images/courts/soccer-11-1.png"),
  "esp-04": require("../../assets/images/courts/basketball-1.png"),
  "esp-05": require("../../assets/images/courts/basketball-2.png"),
  "esp-06": require("../../assets/images/courts/basketball-1.png"),
  "esp-07": require("../../assets/images/courts/volleyball-1.png"),
  "esp-08": require("../../assets/images/courts/volleyball-2.png"),
  "esp-09": require("../../assets/images/courts/tennis-1.png"),
  "esp-10": require("../../assets/images/courts/tennis-2.png"),
  "esp-11": require("../../assets/images/courts/gym-1.png"),
};

function mostrarPrecio(precio: number): string {
  return `$ ${precio.toLocaleString("es-AR")}`;
}

function fotoDeMuestra(espacioId: string) {
  return (
    IMAGENES_DE_MUESTRA[espacioId as keyof typeof IMAGENES_DE_MUESTRA] ??
    IMAGENES_DE_MUESTRA["esp-01"]
  );
}

function ChipFiltro({
  etiqueta,
  seleccionado,
  colores,
  onPress,
}: {
  etiqueta: string;
  seleccionado: boolean;
  colores: Tema;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: seleccionado }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: seleccionado
            ? colores.verde
            : colores.superficie1,
          borderColor: seleccionado ? colores.verde : colores.borde,
        },
      ]}
    >
      <ThemedText
        style={{
          color: seleccionado ? colores.textoSobreSolido : colores.textoMedio,
        }}
        type="defaultSemiBold"
      >
        {etiqueta}
      </ThemedText>
    </Pressable>
  );
}

function TarjetaEspacio({
  espacio,
  deporte,
  colores,
  expandido,
  usaFotoApi,
  onPress,
}: {
  espacio: Espacio;
  deporte: Deporte | undefined;
  colores: Tema;
  expandido: boolean;
  usaFotoApi: boolean;
  onPress: () => void;
}) {
  const uriInicial = usaFotoApi ? espacio.imagenes[0] : undefined;
  const [uriImagen, setUriImagen] = useState(uriInicial);

  useEffect(() => {
    setUriImagen(uriInicial);
  }, [uriInicial]);

  return (
    <View
      style={[
        styles.tarjeta,
        { backgroundColor: colores.superficie1, borderColor: colores.borde },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${espacio.nombre}, ${expandido ? "ocultar" : "ver"} ficha`}
        accessibilityState={{ expanded: expandido }}
        onPress={onPress}
        style={styles.tarjetaResumen}
      >
        <Image
          accessibilityLabel={`Imagen de ${espacio.nombre}`}
          onError={() => setUriImagen(undefined)}
          resizeMode="cover"
          source={uriImagen ? { uri: uriImagen } : fotoDeMuestra(espacio.id)}
          style={styles.fotoEspacio}
        />
        <View style={styles.datosTarjeta}>
          <ThemedText numberOfLines={2} type="defaultSemiBold">
            {espacio.nombre}
          </ThemedText>
          <ThemedText
            colorName="textoMedio"
            numberOfLines={1}
            style={styles.datoSecundario}
          >
            {deporte?.nombre ?? "Deporte"} · {espacio.complejo}
          </ThemedText>
          <ThemedText colorName="verdeTexto" type="defaultSemiBold">
            {mostrarPrecio(espacio.precioPorHora)} por hora
          </ThemedText>
        </View>
      </Pressable>

      {expandido && (
        <View style={[styles.ficha, { borderTopColor: colores.borde }]}>
          <ThemedText colorName="textoMedio">
            {espacio.superficie}
            {espacio.techado ? " · Techado" : " · Al aire libre"}
            {espacio.iluminacion ? " · Con iluminación" : " · Sin iluminación"}
          </ThemedText>
          <ThemedText colorName="textoMedio" style={styles.textoFicha}>
            Capacidad: {espacio.capacidad} personas
          </ThemedText>
          <ThemedText colorName="textoMedio" style={styles.textoFicha}>
            {espacio.reglas}
          </ThemedText>
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={expandido ? "Cerrar ficha" : "Ver características"}
        onPress={onPress}
        style={styles.botonFicha}
      >
        <ThemedText colorName="verdeTexto" type="defaultSemiBold">
          {expandido ? "Cerrar ficha" : "Ver características"}
        </ThemedText>
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const esquema = useColorScheme() ?? "light";
  const colores = Colors[esquema];
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [deportes, setDeportes] = useState<Deporte[]>([]);
  const [filtroDeporte, setFiltroDeporte] = useState("todos");
  const [filtroComplejo, setFiltroComplejo] = useState("todos");
  const [espacioExpandido, setEspacioExpandido] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intentos, setIntentos] = useState(0);

  useEffect(() => {
    let cancelado = false;

    async function cargarCatalogo() {
      setCargando(true);
      setError(null);

      try {
        const [respuestaEspacios, respuestaDeportes] = await Promise.all([
          obtenerEspaciosServicio(),
          obtenerDeportesServicio(),
        ]);

        if (cancelado) return;

        if ("error" in respuestaEspacios) {
          setError(respuestaEspacios.error.mensaje);
          return;
        }

        if ("error" in respuestaDeportes) {
          setError(respuestaDeportes.error.mensaje);
          return;
        }

        setEspacios(respuestaEspacios.datos);
        setDeportes(respuestaDeportes.datos);
      } catch (causa) {
        if (!cancelado) {
          setError(
            causa instanceof Error
              ? causa.message
              : "No se pudo cargar el catálogo de espacios.",
          );
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargarCatalogo();
    return () => {
      cancelado = true;
    };
  }, [intentos]);

  const complejos = useMemo(
    () =>
      [...new Set(espacios.map((espacio) => espacio.complejo))].sort((a, b) =>
        a.localeCompare(b, "es"),
      ),
    [espacios],
  );

  const espaciosFiltrados = useMemo(
    () =>
      espacios.filter(
        (espacio) =>
          (filtroDeporte === "todos" ||
            espacio.deporteId === filtroDeporte) &&
          (filtroComplejo === "todos" ||
            espacio.complejo === filtroComplejo),
      ),
    [espacios, filtroComplejo, filtroDeporte],
  );

  return (
    <ThemedView style={styles.pantalla}>
      <ScrollView
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.encabezado}>
          <View style={styles.marca}>
            <Image
              accessibilityLabel="Logo de Reservas Deportivas"
              source={require("../../assets/images/icon.png")}
              style={styles.logo}
            />
            <ThemedText colorName="verdeTexto" type="defaultSemiBold">
              VILLAGUAY · DEPORTES
            </ThemedText>
          </View>
          <ThemedText style={styles.titulo} type="title">
            Canchas para{"\n"}cada partido
          </ThemedText>
          <ThemedText colorName="textoMedio">
            Encontrá un espacio, consultá el precio y descubrí sus características.
          </ThemedText>
          <View
            style={[
              styles.etiquetaOrigen,
              { backgroundColor: colores.superficie2 },
            ]}
          >
            <ThemedText colorName="textoMedio" type="defaultSemiBold">
              {catalogoDesdeApi
                ? "Catálogo conectado a la API"
                : "Catálogo con datos de demostración"}
            </ThemedText>
          </View>
        </View>

        {cargando ? (
          <View style={styles.mensajeCentrado}>
            <ActivityIndicator color={colores.verdeTexto} size="large" />
            <ThemedText colorName="textoMedio" style={styles.textoCargando}>
              Cargando espacios deportivos…
            </ThemedText>
          </View>
        ) : error ? (
          <View
            style={[
              styles.mensajeError,
              { backgroundColor: colores.superficie1, borderColor: colores.borde },
            ]}
          >
            <ThemedText type="subtitle">
              No se pudo cargar el catálogo
            </ThemedText>
            <ThemedText colorName="textoMedio" style={styles.textoError}>
              {error}
            </ThemedText>
            <Pressable
              accessibilityRole="button"
              onPress={() => setIntentos((valor) => valor + 1)}
              style={[styles.botonReintentar, { backgroundColor: colores.verde }]}
            >
              <ThemedText colorName="textoSobreSolido" type="defaultSemiBold">
                Reintentar
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.seccion}>
              <ThemedText style={styles.tituloSeccion} type="subtitle">
                Elegí un deporte
              </ThemedText>
              <ScrollView
                contentContainerStyle={styles.filaFiltros}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                <ChipFiltro
                  colores={colores}
                  etiqueta="Todos"
                  seleccionado={filtroDeporte === "todos"}
                  onPress={() => setFiltroDeporte("todos")}
                />
                {deportes.map((deporte) => (
                  <ChipFiltro
                    key={deporte.id}
                    colores={colores}
                    etiqueta={deporte.nombre}
                    seleccionado={filtroDeporte === deporte.id}
                    onPress={() => setFiltroDeporte(deporte.id)}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.seccion}>
              <ThemedText style={styles.tituloSeccion} type="subtitle">
                Elegí un complejo
              </ThemedText>
              <ScrollView
                contentContainerStyle={styles.filaFiltros}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                <ChipFiltro
                  colores={colores}
                  etiqueta="Todos"
                  seleccionado={filtroComplejo === "todos"}
                  onPress={() => setFiltroComplejo("todos")}
                />
                {complejos.map((complejo) => (
                  <ChipFiltro
                    key={complejo}
                    colores={colores}
                    etiqueta={complejo}
                    seleccionado={filtroComplejo === complejo}
                    onPress={() => setFiltroComplejo(complejo)}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.encabezadoListado}>
              <ThemedText type="subtitle">Espacios deportivos</ThemedText>
              <ThemedText colorName="textoMedio">
                {espaciosFiltrados.length} espacios
              </ThemedText>
            </View>

            {espaciosFiltrados.length === 0 ? (
              <View
                style={[
                  styles.mensajeVacio,
                  { backgroundColor: colores.superficie1 },
                ]}
              >
                <ThemedText colorName="textoMedio">
                  No hay espacios para esos filtros.
                </ThemedText>
              </View>
            ) : (
              <View style={styles.lista}>
                {espaciosFiltrados.map((espacio) => (
                  <TarjetaEspacio
                    key={espacio.id}
                    colores={colores}
                    deporte={deportes.find(
                      (deporte) => deporte.id === espacio.deporteId,
                    )}
                    espacio={espacio}
                    expandido={espacioExpandido === espacio.id}
                    usaFotoApi={catalogoDesdeApi}
                    onPress={() =>
                      setEspacioExpandido((actual) =>
                        actual === espacio.id ? null : espacio.id,
                      )
                    }
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },
  contenido: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  encabezado: {
    gap: 12,
    marginBottom: 28,
  },
  marca: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  logo: {
    borderRadius: 10,
    height: 36,
    width: 36,
  },
  titulo: {
    fontSize: 36,
    lineHeight: 40,
  },
  etiquetaOrigen: {
    alignSelf: "flex-start",
    borderRadius: 999,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  seccion: {
    gap: 12,
    marginBottom: 24,
  },
  tituloSeccion: {
    fontSize: 19,
  },
  filaFiltros: {
    gap: 8,
    paddingRight: 20,
  },
  chip: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  encabezadoListado: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  lista: {
    gap: 14,
  },
  tarjeta: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  tarjetaResumen: {
    flexDirection: "row",
    gap: 14,
    padding: 12,
  },
  fotoEspacio: {
    backgroundColor: "#244b2c",
    borderRadius: 12,
    height: 96,
    width: 116,
  },
  datosTarjeta: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  datoSecundario: {
    fontSize: 14,
  },
  botonFicha: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 4,
  },
  ficha: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 4,
  },
  textoFicha: {
    marginTop: 8,
  },
  mensajeCentrado: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 220,
  },
  textoCargando: {
    marginTop: 12,
  },
  mensajeError: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
    padding: 20,
  },
  textoError: {
    lineHeight: 22,
  },
  botonReintentar: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  mensajeVacio: {
    alignItems: "center",
    borderRadius: 16,
    padding: 24,
  },
});
