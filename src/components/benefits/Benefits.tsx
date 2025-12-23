import { useSubscriptionStore } from "../../store/subscriptionStore";
import { SubscriptionStatus } from "../my-subscription/SubscriptionStatus";
import SectionCard from "../common/SectionCard";
import AccountHelpCharli from "../common/AccountHelpCharli";
import LogoutSection from "../common/LogoutSection";

interface BenefitsProps {
  onNewPlan?: () => void;
  onReactivate?: () => void;
}

// Subscriber pass card component
function SubscriberPass({ status }: { status: SubscriptionStatus }) {
  const isActive =
    status === SubscriptionStatus.ACTIVE ||
    status === SubscriptionStatus.RETRYING;

  return (
    <div
      className={`${
        isActive ? "bg-[#111]" : "bg-[#444]"
      } rounded-2xl p-6 mb-3 text-center text-white relative`}
    >
      {/* CC Logo */}
      <div className="absolute top-6 left-6 flex flex-col items-start gap-0.5 leading-none">
        <span className="text-[32px] font-normal text-white leading-[0.85]">
          C
        </span>
        <span className="text-[32px] font-normal text-white leading-[0.85]">
          C
        </span>
      </div>

      {/* Status pill */}
      <div
        className={`inline-block ${
          isActive ? "bg-[#DCFCE7] text-[#14532D]" : "bg-[#E5E5E5] text-[#666]"
        } text-[10px] font-bold tracking-wide px-3 py-1 rounded-xl mb-5`}
      >
        {isActive ? "SUSCRIPCIÓN ACTIVA" : "SUSCRIPCIÓN PAUSADA"}
      </div>

      {/* Plan name */}
      <div className="text-xl font-bold mb-3 text-white">Plan Brasil</div>

      {/* User name */}
      <div className="text-lg font-medium text-white">danu</div>
    </div>
  );
}

// Benefit card component
function BenefitCard({
  title,
  location,
  description,
  footnote,
}: {
  title: string;
  location: string;
  description: string;
  footnote?: string;
}) {
  return (
    <SectionCard title="BENEFICIO" subtitle={title}>
      <div className="mt-2">
        <div className="inline-block bg-[#F5F2EE] text-[#555] text-[11px] font-semibold px-2.5 py-1 rounded-xl mb-2.5">
          {location}
        </div>
        <p className="text-[13px] text-[#555] leading-[1.5] m-0">{description}</p>
        {footnote && (
          <p className="text-xs text-[#9A9388] leading-[1.4] mt-2 m-0">
            {footnote}
          </p>
        )}
      </div>
    </SectionCard>
  );
}

function Benefits({ onNewPlan, onReactivate }: BenefitsProps) {
  const { status } = useSubscriptionStore();

  const isActive =
    status === SubscriptionStatus.ACTIVE ||
    status === SubscriptionStatus.RETRYING;
  const isPaused =
    status === SubscriptionStatus.PAUSED ||
    status === SubscriptionStatus.PAUSED_INVOLUNTARY;
  const hasSubscription = isActive || isPaused;

  return (
    <div>
      <div className="text-base font-medium mb-3">Hola, Danu</div>
      <hr className="border-0 border-t border-[#e1ddd7] my-2 mb-4" />

      {/* No subscription state */}
      {!hasSubscription && (
        <div className="bg-white border border-[#eeeeee] rounded-xl p-6 text-center mt-6">
          <div className="text-base font-semibold text-[#111] mb-3">
            Todavía no tenés una suscripción activa
          </div>
          <p className="text-sm text-[#555] leading-[1.5] mb-4">
            Suscribite para acceder a beneficios exclusivos en la web y en
            nuestros locales.
          </p>
          <button
            onClick={onNewPlan}
            className="w-full rounded-full border-none bg-[#111] text-white py-3.5 px-4 text-sm font-semibold cursor-pointer"
          >
            Ver planes de suscripción
          </button>
        </div>
      )}

      {/* With subscription (active or paused) */}
      {hasSubscription && (
        <>
          {/* Subscriber Pass */}
          <div className="mb-8">
            <SubscriberPass status={status} />
            <p className="text-[13px] text-[#555] leading-[1.5] mb-1.5">
              {isActive
                ? "Mostrá esta tarjeta en nuestros locales para acceder a tus beneficios de suscriptor."
                : "Tus beneficios se reactivan cuando vuelvas a activar tu plan."}
            </p>
            {isActive && (
              <p className="text-xs text-[#9A9388] leading-[1.4]">
                El equipo de Culto va a verificar tu e-mail y el estado de tu
                suscripción.
              </p>
            )}

            {isPaused && (
              <button
                onClick={onReactivate}
                className="w-full rounded-full border-none bg-[#111] text-white py-3.5 px-4 text-sm font-semibold cursor-pointer mt-4"
              >
                Reactivar suscripción
              </button>
            )}
          </div>

          {/* Benefits List - only show when active */}
          {isActive && (
            <>
              <h2 className="text-base font-semibold text-[#111] mb-4 mt-8">
                Tus beneficios como suscriptor
              </h2>

              <BenefitCard
                title="50% de descuento en bebidas de café"
                location="Locales físicos"
                description="Mostrá tu pase de suscriptor en caja. El descuento aplica en bebidas de café en nuestros locales."
                footnote="Beneficio personal. No se transfiere y es válido mientras tu suscripción esté activa."
              />

              <BenefitCard
                title="Envío gratis a todo Uruguay"
                location="Online"
                description="Disponible en tus suscripciones y compras únicas desde la web, sin monto mínimo."
              />

              <BenefitCard
                title="25% off en compras de 250 g"
                location="Online"
                description="Válido en bolsas de 250 g fuera de tu suscripción. Se aplica automáticamente al comprar logueado con tu cuenta."
              />

              <BenefitCard
                title="10% de descuento en kiosko"
                location="Kiosko"
                description="Aplicable en productos de kiosko en locales Culto. Mostrá tu pase de suscriptor al momento de pagar."
              />

              {/* How to use */}
              <div className="bg-white border border-[#eeeeee] rounded-xl p-5 mt-8">
                <h3 className="text-[15px] font-semibold text-[#111] mb-3">
                  Cómo usar tus beneficios en nuestros locales
                </h3>
                <ol className="m-0 pl-5 text-[13px] text-[#555] leading-[1.6]">
                  <li>Entrá a "Mi cuenta" → "Beneficios".</li>
                  <li>Mostrá tu pase de suscriptor en la barra o en caja.</li>
                  <li>
                    El equipo verifica tu suscripción y aplica los descuentos
                    que correspondan.
                  </li>
                </ol>
              </div>
            </>
          )}
        </>
      )}

      {/* Ayuda con Charli */}
      <AccountHelpCharli
        onOpenCharli={() => console.log("Abrir chat con Charli")}
      />

      {/* Cerrar sesión */}
      <LogoutSection />
    </div>
  );
}

export default Benefits;

