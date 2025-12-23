import { useState } from "react";
import {
  useSubscriptionStore,
  STATUS_LABELS,
} from "../store/subscriptionStore";
import { SubscriptionStatus } from "./my-subscription/SubscriptionStatus";

export default function DebugStatusBubble() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { status, setStatus } = useSubscriptionStore();

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {/* Panel de opciones */}
      {isOpen && (
        <div className="absolute bottom-[60px] right-0 bg-[#1a1a1a] rounded-xl p-3 min-w-[200px] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="text-[11px] font-semibold text-[#888] uppercase tracking-wider mb-2">
            Status de suscripción
          </div>
          {Object.values(SubscriptionStatus).map((s: SubscriptionStatus) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setIsOpen(false);
              }}
              className={`block w-full text-left py-2 px-2.5 mb-1 rounded-lg border-none cursor-pointer transition-all duration-150 text-[0.8125rem] ${
                status === s
                  ? "bg-[#333] text-white"
                  : "bg-transparent text-[#aaa] hover:bg-[#222]"
              }`}
            >
              {status === s && "✓ "}
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full border-none bg-[#111] text-white text-xl cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center transition-transform duration-150 hover:scale-105"
        title={`Status: ${STATUS_LABELS[status]}`}
      >
        🛠
      </button>
    </div>
  );
}
