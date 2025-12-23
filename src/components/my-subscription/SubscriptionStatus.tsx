export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  PAUSED_INVOLUNTARY = "PAUSED_INVOLUNTARY",
  RETRYING = "RETRYING",
}

const subscriptionStatus = {
  [SubscriptionStatus.ACTIVE]: {
    title: "TU SUSCRIPCIÓN ESTÁ ACTIVA",
    description:
      "Podés modificar tu plan, cambiar la fecha de entrega o cancelarla cuando quieras.",
    descriptionAlt: "",
    color: "bg-[#2e7d32]",
    bgColor: "bg-[#e8f7ec]",
  },
  [SubscriptionStatus.RETRYING]: {
    title: "TU SUSCRIPCIÓN ESTÁ ACTIVA",
    description:
      "Podés modificar tu plan, cambiar la fecha de entrega o cancelarla cuando quieras.",
    descriptionAlt: "",
    color: "bg-[#2e7d32]",
    bgColor: "bg-[#e8f7ec]",
  },
  [SubscriptionStatus.PAUSED]: {
    title: "TU SUSCRIPCIÓN ESTÁ CANCELADA",
    description:
      "Para volver, elegí un nuevo plan o reactivá el último que tenías.",
    descriptionAlt: "",
    color: "bg-[#ff3b30]",
    bgColor: "bg-[#fdeaea]",
  },
  [SubscriptionStatus.PAUSED_INVOLUNTARY]: {
    title: "TU SUSCRIPCIÓN ESTÁ PAUSADA",
    description:
      "No pudimos cobrar tu último ciclo porque tu método de pago venció.",
    descriptionAlt:
      "Para volver a recibir tu café, actualizá tu método de pago.",
    color: "bg-[#ffcc00]",
    bgColor: "bg-[#fff7d6]",
  },
};

interface SubscriptionStatusProps {
  status: SubscriptionStatus;
}

function SubscriptionStatusCard({ status }: SubscriptionStatusProps) {
  const statusData = subscriptionStatus[status];

  return (
    <div
      className={`${statusData.bgColor} rounded-xl px-3.5 py-3 text-[0.8125rem] leading-[1.4] mb-4 flex gap-2.5 items-start`}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${statusData.color}`}
      />
      <div>
        <div className="font-semibold uppercase text-xs mb-0.5">
          {statusData.title}
        </div>
        <div>{statusData.description}</div>
        {statusData.descriptionAlt && (
          <div className="mt-1">{statusData.descriptionAlt}</div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionStatusCard;
