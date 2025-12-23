import { useSubscriptionStore } from "../../store/subscriptionStore";
import { ViewType } from "../../types/ViewType";
import SectionCard from "../common/SectionCard";
import AccountHelpCharli from "../common/AccountHelpCharli";
import LogoutSection from "../common/LogoutSection";
import SubscriptionStatusCard, {
  SubscriptionStatus,
} from "./SubscriptionStatus";

interface MySubscriptionProps {
  changeCurrentView: (view: ViewType) => void;
  onModifyPlan: () => void;
  onModifyDate: () => void;
  onModifyDelivery?: () => void;
  onReactivate?: () => void;
  onNewPlan?: () => void;
  onUpdatePaymentMethod?: () => void;
}

function MySubscription({
  changeCurrentView,
  onModifyPlan,
  onModifyDate,
  onModifyDelivery,
  onReactivate,
  onNewPlan,
  onUpdatePaymentMethod,
}: MySubscriptionProps) {
  const { status } = useSubscriptionStore();

  const isCancelled = status === SubscriptionStatus.PAUSED;
  const isPausedInvoluntary = status === SubscriptionStatus.PAUSED_INVOLUNTARY;

  // Vista de suscripción pausada (problema de pago)
  if (isPausedInvoluntary) {
    return (
      <div>
        <div className="text-base font-medium mb-3">Hola, Danu</div>
        <hr className="border-0 border-t border-[#e1ddd7] my-2 mb-4" />

        {/* Banner de estado pausado */}
        <div className="rounded-xl px-3.5 py-3 text-[0.8125rem] leading-[1.4] mb-4 flex gap-2.5 items-start bg-[#fef9e7]">
          <span className="w-2.5 h-2.5 rounded-full mt-1 shrink-0 bg-[#f59e0b]" />
          <div>
            <div className="font-semibold uppercase text-xs mb-0.5">
              TU SUSCRIPCIÓN ESTÁ PAUSADA
            </div>
            <div>
              No pudimos cobrar tu suscripción porque tu tarjeta está vencida.
              Actualizá tu método de pago para volver a recibir tu café.
            </div>
          </div>
        </div>

        {/* Tu plan */}
        <SectionCard title="TU PLAN">
          <div className="font-semibold mb-1 text-base text-[#111]">
            Plan Brasil
          </div>
          <div className="text-sm text-[#555] leading-[1.5]">
            2 bolsas de 250 g · En grano
          </div>
        </SectionCard>

        {/* Botón principal */}
        <button
          onClick={onUpdatePaymentMethod}
          className="w-full rounded-full border-none bg-[#111] text-white py-3.5 px-4 text-sm font-medium cursor-pointer"
        >
          Actualizar método de pago
        </button>
        <p className="text-xs text-[#666] leading-[1.5] my-1.5 mb-4 text-center">
          Apenas actualices tu método de pago, vamos a procesar el cobro
          pendiente y tu próxima entrega se va a activar automáticamente.
        </p>

        {/* Ayuda con Charli */}
        <AccountHelpCharli
          onOpenCharli={() => console.log("Abrir chat con Charli")}
        />

        {/* Cerrar sesión */}
        <LogoutSection />
      </div>
    );
  }

  // Vista de suscripción cancelada
  if (isCancelled) {
    return (
      <div>
        <div className="text-base font-medium mb-3">Hola, Danu</div>
        <hr className="border-0 border-t border-[#e1ddd7] my-2 mb-4" />

        {/* Banner de estado cancelado */}
        <div className="rounded-xl px-3.5 py-3 text-[0.8125rem] leading-[1.4] mb-4 flex gap-2.5 items-start bg-[#fee2e2]">
          <span className="w-2.5 h-2.5 rounded-full mt-1 shrink-0 bg-[#dc2626]" />
          <div>
            <div className="font-semibold uppercase text-xs mb-0.5">
              TU SUSCRIPCIÓN ESTÁ CANCELADA
            </div>
            <div>
              Para volver, reactivá el último plan que tenías o elegí uno nuevo.
            </div>
          </div>
        </div>

        {/* Último plan que tuviste */}
        <SectionCard title="ÚLTIMO PLAN QUE TUVISTE">
          <div className="font-semibold mb-1 text-base text-[#111]">
            Plan Brasil
          </div>
          <div className="text-sm text-[#555] leading-[1.5]">
            2 bolsas de 250 g · En grano
          </div>
          <div className="text-sm text-[#555] leading-[1.5]">
            Retiro en Ciudad Vieja
          </div>
        </SectionCard>

        {/* Botones de acción */}
        <button
          onClick={onReactivate}
          className="w-full rounded-full border-none bg-[#111] text-white py-3.5 px-4 text-sm font-medium cursor-pointer"
        >
          Reactivar Plan Brasil
        </button>
        <p className="text-xs text-[#666] leading-[1.5] my-1.5 mb-4 text-center">
          Volvés exactamente al plan anterior.
        </p>

        <button
          onClick={onNewPlan}
          className="w-full rounded-full border border-[#111] bg-transparent text-[#111] py-3.5 px-4 text-sm font-medium cursor-pointer mt-2"
        >
          Elegir un nuevo plan
        </button>
        <p className="text-xs text-[#666] leading-[1.5] my-1.5 mb-4 text-center">
          Cambiar plan, cantidad, molienda o forma de entrega.
        </p>

        {/* Ayuda con Charli */}
        <AccountHelpCharli
          onOpenCharli={() => console.log("Abrir chat con Charli")}
        />

        {/* Cerrar sesión */}
        <LogoutSection />
      </div>
    );
  }

  // Vista de suscripción activa
  return (
    <div>
      <div className="text-base font-medium mb-3">Hola, Danu</div>
      <hr className="border-0 border-t border-[#e1ddd7] my-2 mb-4" />
      <SubscriptionStatusCard status={status} />
      <SectionCard title="PLAN">
        <div className="font-semibold mb-1 text-base text-[#111]">
          Plan Brasil
        </div>
        <div className="text-sm text-[#555] leading-[1.5]">
          2 bolsas de 250 g · En grano
        </div>
      </SectionCard>

      <SectionCard title="PROXIMA ENTREGA">
        <div className="flex justify-between items-start mb-1">
          <div className="font-semibold text-base text-[#111]">
            Jueves 12 de diciembre
          </div>
          <button
            onClick={onModifyDate}
            className="bg-transparent border-none p-0 text-xs font-medium cursor-pointer underline text-[#111] shrink-0 ml-3"
          >
            Modificar fecha
          </button>
        </div>
        <div className="flex justify-between items-start">
          <div className="text-sm text-[#555] leading-[1.5]">
            Retiro en Ciudad Vieja
          </div>
          <button
            onClick={onModifyDelivery}
            className="bg-transparent border-none p-0 text-xs font-medium cursor-pointer underline text-[#111] shrink-0 ml-3"
          >
            Modificar entrega
          </button>
        </div>
      </SectionCard>

      <SectionCard title="COBRO">
        <div className="text-sm text-[#555] leading-[1.5]">
          <div>Próximo cobro: $800 UYU</div>
          <div>Fecha de cobro: 10 de cada mes</div>
          <div>Método: Visa •••• 1234</div>
        </div>
      </SectionCard>
      <button
        onClick={onModifyPlan}
        className="w-full rounded-full border-none bg-[#111] text-white py-3.5 px-4 text-sm font-medium cursor-pointer"
      >
        Modificar plan
      </button>
      <p className="text-xs text-[#666] leading-[1.5] my-1.5 mb-4 text-center">
        Cambiar cantidad, molienda o método de entrega del plan actual.
      </p>
      <button
        onClick={onNewPlan}
        className="w-full rounded-full border border-[#111] bg-transparent text-[#111] py-3.5 px-4 text-sm font-medium cursor-pointer mt-2"
      >
        Cambiar de plan
      </button>
      <p className="text-xs text-[#666] leading-[1.5] my-1.5 mb-4 text-center">
        Elegir otro plan de suscripción (por ejemplo, Plan Mundial o Mix).
      </p>
      <div className="text-center mt-6">
        <button
          onClick={() => changeCurrentView(ViewType.CANCEL_REASON)}
          className="bg-transparent border-none p-0 text-[0.8125rem] font-medium cursor-pointer underline text-[#b91c1c]"
        >
          Cancelar suscripción
        </button>
      </div>

      {/* Ayuda con Charli */}
      <AccountHelpCharli
        onOpenCharli={() => console.log("Abrir chat con Charli")}
      />

      {/* Cerrar sesión */}
      <LogoutSection />
    </div>
  );
}

export default MySubscription;
