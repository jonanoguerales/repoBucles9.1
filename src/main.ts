import {
  LineaTicket,
  TicketFinal,
  TipoIva,
  ResultadoLineaTicket,
  TotalPorTipoIva,
  ResultadoTotalTicket,
} from "./model";

const productos: LineaTicket[] = [
  {
    producto: {
      nombre: "Legumbres",
      precio: 2,
      tipoIva: "general",
    },
    cantidad: 2,
  },
  {
    producto: {
      nombre: "Perfume",
      precio: 20,
      tipoIva: "general",
    },
    cantidad: 3,
  },
  {
    producto: {
      nombre: "Leche",
      precio: 1,
      tipoIva: "superreducidoC",
    },
    cantidad: 6,
  },
  {
    producto: {
      nombre: "Lasaña",
      precio: 5,
      tipoIva: "superreducidoA",
    },
    cantidad: 1,
  },
];

const calcularIva = (tipoIva: TipoIva, precio: number): number => {
  switch (tipoIva) {
    case "general":
      return precio * 0.21;
    case "reducido":
      return precio * 0.1;
    case "superreducidoA":
      return precio * 0.05;
    case "superreducidoB":
      return precio * 0.04;
    case "superreducidoC":
      return 0;
    case "sinIva":
      return 0;
  }
};

const calcularPrecioProducto = (producto: LineaTicket) => {
  const precio = producto.cantidad * producto.producto.precio;
  return precio;
};

const calcularPrecioProductoConIva = (producto: LineaTicket) => {
  const precioIva = calcularIva(
    producto.producto.tipoIva,
    producto.producto.precio
  );
  return producto.cantidad * (producto.producto.precio - precioIva);
};

const calcularTotal = (
  ticket: ResultadoLineaTicket[]
): ResultadoTotalTicket => {
  const totalSinIva = ticket.reduce((a, b) => a + b.precionSinIva, 0);
  const totalConIva = ticket.reduce((a, b) => a + b.precioConIva, 0);
  const totalIva = totalConIva - totalSinIva;
  return {
    totalSinIva,
    totalConIva,
    totalIva,
  };
};

const desgloseIva = (ticket: ResultadoLineaTicket[]): TotalPorTipoIva[] => {
  const totalPorTipoIva: TotalPorTipoIva[] = [];
  const ivas: TipoIva[] = [];
  ticket.forEach((item) => {
    if (!ivas.includes(item.tipoIva)) {
      ivas.push(item.tipoIva);
    }
  });
  for (let i = 0; i < ivas.length; i++) {
    const tipoIva = ivas[i];
    const cuantia = parseFloat(
      ticket
        .filter((item) => item.tipoIva === tipoIva)
        .reduce((a, b) => a + (b.precioConIva - b.precionSinIva), 0)
        .toFixed(2)
    );
    totalPorTipoIva.push({ tipoIva, cuantia });
  }
  return totalPorTipoIva;
};

const calculaTicket = (lineasTicket: LineaTicket[]): TicketFinal[] => {
  let resultado = [];
  let ticket: ResultadoLineaTicket[] = [];
  for (let i = 0; i < lineasTicket.length; i++) {
    const item = lineasTicket[i];
    ticket.push({
      nombre: item.producto.nombre,
      cantidad: item.cantidad,
      precionSinIva: calcularPrecioProductoConIva(item),
      tipoIva: item.producto.tipoIva,
      precioConIva: calcularPrecioProducto(item),
    });
    console.log();
  }
  resultado.push({
    lineas: ticket,
    total: calcularTotal(ticket),
    desgloseIva: desgloseIva(ticket),
  });
  return resultado;
};
console.log(calculaTicket(productos));
