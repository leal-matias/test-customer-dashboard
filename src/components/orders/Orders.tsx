import React, { useState } from "react";
import AccountHelpCharli from "../common/AccountHelpCharli";
import LogoutSection from "../common/LogoutSection";

interface Order {
  id: string;
  date: string;
  status: "delivered" | "ready" | "processing";
  statusLabel: string;
  items: string;
  plan: string;
  deliveryMethod: string;
  deliveryInfo: string;
  deliveryDescription: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "12345",
    date: "28 de noviembre",
    status: "processing",
    statusLabel: "En proceso",
    items: "2 bolsas de 250 g",
    plan: "Plan Brasil",
    deliveryMethod: "Envío a domicilio",
    deliveryInfo: "Envío",
    deliveryDescription: "En camino a tu dirección de entrega.",
  },
  {
    id: "12312",
    date: "20 de noviembre",
    status: "ready",
    statusLabel: "Listo para retirar",
    items: "1 bolsa de 250 g",
    plan: "Compra única",
    deliveryMethod: "Retiro en Ciudad Vieja",
    deliveryInfo: "Retiro",
    deliveryDescription: "Mostrá el QR en el local para retirar tu pedido.",
  },
  {
    id: "12280",
    date: "5 de noviembre",
    status: "delivered",
    statusLabel: "Entregado",
    items: "2 bolsas de 250 g",
    plan: "Plan Mundial",
    deliveryMethod: "Envío a domicilio",
    deliveryInfo: "",
    deliveryDescription: "",
  },
];

const STATUS_STYLES: Record<Order["status"], { bg: string; text: string }> = {
  processing: { bg: "bg-[#FFF4CC]", text: "text-[#8A6E1F]" },
  ready: { bg: "bg-[#E8F7EC]", text: "text-[#2E7D32]" },
  delivered: { bg: "bg-[#F1F0EB]", text: "text-[#5C574F]" },
};

function Orders() {
  const [qrModal, setQrModal] = useState<{ orderId: string } | null>(null);

  return (
    <div>
      <div className="text-base font-medium mb-3">Hola, Danu</div>
      <hr className="border-0 border-t border-[#e1ddd7] my-2 mb-4" />

      {MOCK_ORDERS.map((order) => {
        const statusStyle = STATUS_STYLES[order.status];

        return (
          <section
            key={order.id}
            className="bg-white rounded-xl p-4 pb-3 mb-3 border border-[#eeeeee]"
          >
            {/* Header con número de pedido y estado */}
            <div className="flex justify-between items-center mb-1.5">
              <div>
                <div className="text-[11px] uppercase tracking-[0.08em] text-[#999] mb-0.5">
                  Pedido
                </div>
                <div className="text-sm font-semibold">#{order.id}</div>
              </div>
              <div
                className={`${statusStyle.bg} ${statusStyle.text} rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.08em]`}
              >
                {order.statusLabel}
              </div>
            </div>

            {/* Descripción del producto */}
            <div className="text-[13px] text-[#666] mb-1">
              {order.items} · {order.plan}
            </div>

            {/* Fecha y método de entrega */}
            <div className="text-xs text-[#999] mb-2.5">
              {order.date} · {order.deliveryMethod}
            </div>

            {/* Info de envío/retiro (solo si hay) */}
            {order.deliveryInfo && (
              <div className="mb-3">
                <div className="text-[11px] uppercase tracking-[0.08em] text-[#999] mb-0.5">
                  {order.deliveryInfo}
                </div>
                <div className="text-[13px] text-[#555]">
                  {order.deliveryDescription}
                </div>
              </div>
            )}

            {/* Botones según estado */}
            {order.status === "processing" && (
              <button className="w-full rounded-full border-none bg-[#111] text-white py-2.5 px-3.5 text-[13px] font-medium cursor-pointer mb-1.5">
                Ver seguimiento
              </button>
            )}

            {order.status === "ready" && (
              <button
                onClick={() => setQrModal({ orderId: order.id })}
                className="w-full rounded-full border-none bg-[#111] text-white py-2.5 px-3.5 text-[13px] font-medium cursor-pointer mb-1.5"
              >
                Ver QR para retirar
              </button>
            )}

            {order.status === "delivered" && (
              <button className="w-full rounded-full border border-[#111] bg-transparent text-[#111] py-2.5 px-3.5 text-[13px] font-medium cursor-pointer mb-1.5">
                Ver detalle del pedido
              </button>
            )}

            {/* Link factura */}
            <button className="bg-transparent border-none p-0 text-xs cursor-pointer underline text-[#555]">
              Ver / descargar factura
            </button>
          </section>
        );
      })}

      {/* Ayuda con Charli */}
      <AccountHelpCharli
        onOpenCharli={() => console.log("Abrir chat con Charli")}
      />

      {/* Cerrar sesión */}
      <LogoutSection />

      {/* Modal QR - Full screen */}
      {qrModal && (
        <div className="fixed inset-0 bg-[#f7f5f3] z-[9999] overflow-y-auto animate-[slideUp_220ms_ease-out]">
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}</style>

          {/* Container centrado */}
          <div className="min-h-screen flex flex-col p-5 pb-8 md:p-6">
            {/* Header con botón cerrar */}
            <div className="relative text-center mb-8">
              <button
                onClick={() => setQrModal(null)}
                aria-label="Cerrar modal de QR"
                className="absolute right-0 top-0 bg-transparent border-none text-[28px] cursor-pointer p-2 leading-none text-[#111] min-w-[44px] min-h-[44px]"
              >
                ✕
              </button>

              <div className="text-xl font-semibold mb-1.5 text-[#111] leading-[1.3] pr-11">
                QR para retirar tu pedido
              </div>
              <div className="text-sm text-[#8B8478] leading-[1.4]">
                Mostralo en el local para validarlo.
              </div>
            </div>

            {/* Contenido - QR y detalles */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* QR Code dentro de contenedor blanco */}
              <div className="bg-white p-8 rounded-2xl mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <img
                  src="data:image/png;base64,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"
                  alt={`Código QR para retirar el pedido #${qrModal.orderId}`}
                  className="w-[300px] h-[300px] block"
                />
              </div>

              {/* Información del pedido */}
              <div className="text-center">
                <div className="text-base font-semibold text-[#111] mb-1.5">
                  Orden #{qrModal.orderId}
                </div>
                <div className="text-[13px] text-[#8B8478]">
                  1 bolsa de 250 g · Retiro en Ciudad Vieja
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
