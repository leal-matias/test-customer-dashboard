import { useState } from "react";
import MySubscription from "./components/my-subscription/MySubscription";
import Orders from "./components/orders/Orders";
import PaymentMethod from "./components/payment-method/PaymentMethod";
import ModifyPlan from "./components/modify-plan/ModifyPlan";
import ModifyDate from "./components/modify-date/ModifyDate";
import ModifyDelivery from "./components/modify-delivery/ModifyDelivery";
import ReactivatePlan from "./components/reactivate-plan/ReactivatePlan";
import DataView from "./components/data/DataView";
import Benefits from "./components/benefits/Benefits";
import CancelReason from "./components/cancel/CancelReason";
import CancelOffer from "./components/cancel/CancelOffer";
import CancelConfirm from "./components/cancel/CancelConfirm";
import CancelSuccess from "./components/cancel/CancelSuccess";
import BenefitSuccess from "./components/cancel/BenefitSuccess";
import { ViewType } from "./types/ViewType";
import PageWrapper from "./components/common/PageWrapper";

export default function SuscripcionActiva() {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.MAIN);
  // null = no mostrar, { skipPlanSelection: boolean } = mostrar con configuración
  const [modifyPlanConfig, setModifyPlanConfig] = useState<{
    skipPlanSelection: boolean;
  } | null>(null);
  const [showModifyDate, setShowModifyDate] = useState(false);
  const [showModifyDelivery, setShowModifyDelivery] = useState(false);
  const [showReactivatePlan, setShowReactivatePlan] = useState(false);

  // Si se está mostrando ModifyPlan, renderizarlo
  if (modifyPlanConfig) {
    return (
      <ModifyPlan
        onClose={() => setModifyPlanConfig(null)}
        skipPlanSelection={modifyPlanConfig.skipPlanSelection}
      />
    );
  }

  // Si se está mostrando ModifyDate, renderizarlo
  if (showModifyDate) {
    return <ModifyDate onClose={() => setShowModifyDate(false)} />;
  }

  // Si se está mostrando ModifyDelivery, renderizarlo
  if (showModifyDelivery) {
    return <ModifyDelivery onClose={() => setShowModifyDelivery(false)} />;
  }

  // Si se está mostrando ReactivatePlan, renderizarlo
  if (showReactivatePlan) {
    return (
      <ReactivatePlan
        onClose={() => setShowReactivatePlan(false)}
        onChangePlan={() => {
          setShowReactivatePlan(false);
          setModifyPlanConfig({ skipPlanSelection: false });
        }}
      />
    );
  }

  // Vista de Datos
  if (currentView === ViewType.DATA) {
    return (
      <PageWrapper
        currentView={currentView}
        setCurrentView={setCurrentView}
        onClose={() => setCurrentView(ViewType.MAIN)}
        showNav
      >
        <DataView />
      </PageWrapper>
    );
  }

  // Vista de Pedidos
  if (currentView === ViewType.ORDERS) {
    return (
      <PageWrapper
        currentView={currentView}
        setCurrentView={setCurrentView}
        onClose={() => setCurrentView(ViewType.MAIN)}
        showNav
      >
        <Orders />
      </PageWrapper>
    );
  }

  // Vista de Beneficios
  if (currentView === ViewType.BENEFITS) {
    return (
      <PageWrapper
        currentView={currentView}
        setCurrentView={setCurrentView}
        onClose={() => setCurrentView(ViewType.MAIN)}
        showNav
      >
        <Benefits
          onNewPlan={() => setModifyPlanConfig({ skipPlanSelection: false })}
          onReactivate={() => setShowReactivatePlan(true)}
        />
      </PageWrapper>
    );
  }

  // Vista de Método de Pago
  if (currentView === ViewType.PAYMENT_METHOD) {
    return (
      <PageWrapper
        currentView={currentView}
        setCurrentView={setCurrentView}
        onClose={() => setCurrentView(ViewType.MAIN)}
        showNav
      >
        <PaymentMethod />
      </PageWrapper>
    );
  }

  // Vista benefit-success
  if (currentView === ViewType.BENEFIT_SUCCESS) {
    return (
      <PageWrapper title="Cancelar suscripción">
        <BenefitSuccess onBack={() => setCurrentView(ViewType.MAIN)} />
      </PageWrapper>
    );
  }

  // Vista cancel-success
  if (currentView === ViewType.CANCEL_SUCCESS) {
    return (
      <PageWrapper title="Suscripción cancelada">
        <CancelSuccess onBack={() => setCurrentView(ViewType.MAIN)} />
      </PageWrapper>
    );
  }

  // Vista cancel-confirm
  if (currentView === ViewType.CANCEL_CONFIRM) {
    return (
      <PageWrapper
        title="Cancelar suscripción"
        onBack={() => setCurrentView(ViewType.CANCEL_OFFER)}
        onClose={() => setCurrentView(ViewType.MAIN)}
      >
        <CancelConfirm
          onConfirm={() => setCurrentView(ViewType.CANCEL_SUCCESS)}
          onCancel={() => setCurrentView(ViewType.MAIN)}
        />
      </PageWrapper>
    );
  }

  // Vista cancel-offer
  if (currentView === ViewType.CANCEL_OFFER) {
    return (
      <PageWrapper
        title="Cancelar suscripción"
        onBack={() => setCurrentView(ViewType.CANCEL_REASON)}
        onClose={() => setCurrentView(ViewType.MAIN)}
      >
        <CancelOffer
          onAcceptBenefit={() => setCurrentView(ViewType.BENEFIT_SUCCESS)}
          onCancelAnyway={() => setCurrentView(ViewType.CANCEL_CONFIRM)}
        />
      </PageWrapper>
    );
  }

  // Vista cancel-reason
  if (currentView === ViewType.CANCEL_REASON) {
    return (
      <PageWrapper
        title="Cancelar suscripción"
        onBack={() => setCurrentView(ViewType.MAIN)}
        onClose={() => setCurrentView(ViewType.MAIN)}
      >
        <CancelReason
          onContinue={() => setCurrentView(ViewType.CANCEL_OFFER)}
          onCancel={() => setCurrentView(ViewType.MAIN)}
        />
      </PageWrapper>
    );
  }

  // Vista principal
  return (
    <PageWrapper
      currentView={currentView}
      setCurrentView={setCurrentView}
      showNav
    >
      <MySubscription
        changeCurrentView={setCurrentView}
        onModifyPlan={() => setModifyPlanConfig({ skipPlanSelection: true })}
        onModifyDate={() => setShowModifyDate(true)}
        onModifyDelivery={() => setShowModifyDelivery(true)}
        onReactivate={() => setShowReactivatePlan(true)}
        onNewPlan={() => setModifyPlanConfig({ skipPlanSelection: false })}
        onUpdatePaymentMethod={() => setCurrentView(ViewType.PAYMENT_METHOD)}
      />
    </PageWrapper>
  );
}
