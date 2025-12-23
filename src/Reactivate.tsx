import { useState, ChangeEvent, FormEvent } from "react";

// Types
type ReactivationOption = "charge-now" | "keep-date";
type Step = "reactivar" | "payment" | "confirm" | "payment-confirm";

interface HeaderProps {
  title: string;
  onBack: () => void;
  onClose: () => void;
}

interface CardProps {
  label?: string;
  children: React.ReactNode;
  className?: string;
}

interface RadioCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "link";
}

interface FieldGroupProps {
  label: string;
  id: string;
  children: React.ReactNode;
}

interface InputProps {
  id: string;
  type?: string;
  placeholder?: string;
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
  maxLength?: number;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface StepReactivarProps {
  onConfirm: () => void;
  onChangePlan: () => void;
  onCancel: () => void;
  selectedOption: ReactivationOption;
  setSelectedOption: (option: ReactivationOption) => void;
}

interface StepPaymentProps {
  onSubmit: () => void;
}

interface StepConfirmProps {
  onFinish: () => void;
  showPaymentInfo?: boolean;
}

interface PaymentFormData {
  cardHolder: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

// Components
function Header({ title, onBack, onClose }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-2 mb-3">
      <div className="flex items-center min-w-[40px]">
        <button
          onClick={onBack}
          className="border-none bg-transparent p-1 cursor-pointer text-lg leading-none hover:opacity-70 transition-opacity"
          aria-label="Volver"
        >
          ←
        </button>
      </div>
      <div className="flex-1 text-center text-[0.95rem] font-semibold tracking-[0.08em] uppercase">
        {title}
      </div>
      <div className="flex items-center min-w-[40px] justify-end">
        <button
          onClick={onClose}
          className="border-none bg-transparent p-1 cursor-pointer text-lg leading-none hover:opacity-70 transition-opacity"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>
    </header>
  );
}

function Card({ label, children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl p-3 px-3.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] mb-2.5 ${className}`}
    >
      {label && (
        <div className="text-[0.75rem] font-semibold tracking-[0.08em] uppercase text-culto-label mb-2">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

function RadioCard({ selected, onClick, title, description }: RadioCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-[10px] border bg-white py-2.5 px-3 pl-[38px] cursor-pointer transition-all duration-150 relative
        ${
          selected
            ? "border-culto-text shadow-[0_0_0_1px_#111111]"
            : "border-culto-border hover:border-culto-muted"
        }`}
    >
      <div
        className={`absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white transition-all duration-150
          ${
            selected
              ? "border-[6px] border-culto-accent"
              : "border-2 border-culto-border"
          }`}
      />
      <p className="text-[0.90rem] font-semibold m-0 mb-0.5">{title}</p>
      <p className="text-[0.78rem] text-culto-muted m-0">{description}</p>
    </button>
  );
}

function Button({
  children,
  onClick,
  disabled,
  type = "button",
  variant = "primary",
}: ButtonProps) {
  const baseClasses =
    "w-full rounded-full py-[11px] px-4 text-[0.90rem] font-semibold border-none cursor-pointer transition-all duration-150";
  const variants = {
    primary: `${baseClasses} bg-culto-text text-white hover:bg-gray-800 disabled:bg-culto-disabled disabled:cursor-not-allowed`,
    link: "text-[0.80rem] text-culto-subtle text-center mt-3 underline cursor-pointer border-none bg-transparent block w-full hover:text-culto-text transition-colors",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={variants[variant]}
    >
      {children}
    </button>
  );
}

function FieldGroup({ label, id, children }: FieldGroupProps) {
  return (
    <div className="mb-2.5">
      <label
        htmlFor={id}
        className="block text-[0.78rem] font-medium text-culto-subtle mb-1"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  id,
  type = "text",
  placeholder,
  inputMode,
  maxLength,
  value,
  onChange,
}: InputProps) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      inputMode={inputMode}
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-culto-border-light bg-white py-[9px] px-2.5 text-[0.90rem] text-culto-text outline-none focus:border-culto-text transition-colors"
    />
  );
}

function SuccessIcon() {
  return (
    <div className="w-12 h-12 bg-culto-success rounded-full flex items-center justify-center mx-auto mb-3 text-2xl text-emerald-600">
      ✓
    </div>
  );
}

// Steps
function StepReactivar({
  onConfirm,
  onChangePlan,
  onCancel,
  selectedOption,
  setSelectedOption,
}: StepReactivarProps) {
  return (
    <section>
      <h1 className="text-base font-semibold m-0 mb-1.5">Reactivar mi plan</h1>
      <p className="text-[0.80rem] text-culto-muted m-0 mb-3">
        Elegí cómo querés retomar tu suscripción.
      </p>

      <Card label="Plan y configuración actual">
        <p className="text-[0.95rem] font-semibold m-0 mb-1 text-culto-text">
          Plan Brasil
        </p>
        <p className="text-[0.80rem] text-culto-subtle m-0">
          2 bolsas de 250 g · En grano
        </p>
      </Card>

      <Card label="Cobro y entrega">
        <div className="mb-3">
          <p className="text-[0.75rem] uppercase tracking-[0.08em] text-culto-label m-0 mb-1">
            Próxima fecha de cobro
          </p>
          <p className="text-[0.95rem] font-semibold m-0 text-culto-text">
            10 de cada mes
          </p>
        </div>
        <div className="mb-3">
          <p className="text-[0.75rem] uppercase tracking-[0.08em] text-culto-label m-0 mb-1">
            Próxima entrega estimada
          </p>
          <p className="text-[0.95rem] font-semibold m-0 text-culto-text">
            Jueves 12 de diciembre
          </p>
        </div>
        <div>
          <p className="text-[0.75rem] uppercase tracking-[0.08em] text-culto-label m-0 mb-1">
            Forma de entrega
          </p>
          <p className="text-[0.95rem] font-semibold m-0 text-culto-text">
            Retiro en Ciudad Vieja
          </p>
        </div>
      </Card>

      <Card label="Opciones de reactivación">
        <div className="flex flex-col gap-2 mt-2">
          <RadioCard
            selected={selectedOption === "charge-now"}
            onClick={() => setSelectedOption("charge-now")}
            title="Recibir mi café antes"
            description="Pagás hoy y tu próxima entrega se adelanta. Vas a ingresar tu método de pago para confirmar el cobro."
          />
          <RadioCard
            selected={selectedOption === "keep-date"}
            onClick={() => setSelectedOption("keep-date")}
            title="Mantener mi fecha original"
            description="Tu plan se reactiva y se cobrará en tu próxima fecha de facturación. No se realiza ningún cobro ahora."
          />
        </div>
      </Card>

      <div className="mt-4">
        <Button onClick={onConfirm}>Confirmar reactivación</Button>
        <p className="text-[0.75rem] text-culto-helper text-center mt-2">
          Podés modificar tu plan, entrega o método de pago cuando quieras.
        </p>
        <Button variant="link" onClick={onChangePlan}>
          Prefiero cambiar de plan
        </Button>
        <Button variant="link" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </section>
  );
}

function StepPayment({ onSubmit }: StepPaymentProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardHolder: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit();
  };

  const updateField =
    (field: keyof PaymentFormData) =>
    (e: ChangeEvent<HTMLInputElement>): void => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <section>
      <h1 className="text-base font-semibold m-0 mb-1.5">
        Ingresar método de pago
      </h1>
      <p className="text-[0.80rem] text-culto-muted m-0 mb-3">
        Vamos a cobrar hoy tu suscripción para adelantar tu próxima entrega.
        Después, tu plan sigue con la misma fecha de cobro de siempre.
      </p>

      <Card label="Resumen de tu pago de hoy">
        <div className="flex justify-between text-[0.80rem] text-culto-subtle mb-1">
          <span>Plan</span>
          <span className="font-semibold text-culto-text">Plan Brasil</span>
        </div>
        <div className="flex justify-between text-[0.80rem] text-culto-subtle">
          <span>Monto a cobrar</span>
          <span className="font-semibold text-culto-text">$ 1.290</span>
        </div>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card label="Método de pago">
          <FieldGroup label="Titular de la tarjeta" id="card-holder">
            <Input
              id="card-holder"
              placeholder="Como figura en la tarjeta"
              value={formData.cardHolder}
              onChange={updateField("cardHolder")}
            />
          </FieldGroup>

          <FieldGroup label="Número de tarjeta" id="card-number">
            <Input
              id="card-number"
              inputMode="numeric"
              placeholder="•••• •••• •••• ••••"
              value={formData.cardNumber}
              onChange={updateField("cardNumber")}
            />
          </FieldGroup>

          <FieldGroup label="Vencimiento" id="card-expiry">
            <Input
              id="card-expiry"
              inputMode="numeric"
              placeholder="MM / AA"
              value={formData.cardExpiry}
              onChange={updateField("cardExpiry")}
            />
          </FieldGroup>

          <FieldGroup label="Código de seguridad" id="card-cvv">
            <Input
              id="card-cvv"
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="CVV"
              value={formData.cardCvv}
              onChange={updateField("cardCvv")}
            />
          </FieldGroup>

          <p className="text-[0.75rem] text-culto-helper text-center mt-2">
            Tus datos de pago se guardan de forma segura solo para los cobros de
            tu suscripción.
          </p>
        </Card>

        <div className="mt-4">
          <Button type="submit">Confirmar pago y reactivar plan</Button>
          <p className="text-[0.75rem] text-culto-helper mt-3 leading-[1.4]">
            Se va a cobrar hoy el monto de tu plan. Si el pago es aprobado, tu
            próxima entrega se adelanta automáticamente.
          </p>
        </div>
      </form>
    </section>
  );
}

function StepConfirm({ onFinish, showPaymentInfo = false }: StepConfirmProps) {
  return (
    <section>
      <div className="text-center py-5 pb-4">
        <SuccessIcon />
        <h1 className="text-base font-semibold m-0 text-center">
          Tu suscripción fue reactivada
        </h1>
        <p className="text-[0.80rem] text-culto-muted m-0 mt-1.5 text-center">
          {showPaymentInfo
            ? "Procesamos el pago de hoy. Tu próxima entrega se adelantó y después tu plan vuelve a cobrarse en tu fecha habitual."
            : "A partir de tu próximo ciclo vas a volver a recibir tu café con este plan."}
        </p>
      </div>

      <Card
        label="Resumen de tu suscripción"
        className="rounded-2xl px-4 pt-4 pb-2.5"
      >
        <div className="flex justify-between py-2 border-t border-culto-divider text-[0.82rem]">
          <span className="text-culto-subtle">Plan</span>
          <span className="font-semibold text-culto-text text-right ml-3">
            Plan Brasil
          </span>
        </div>
        <div className="flex justify-between py-2 border-t border-culto-divider text-[0.82rem]">
          <span className="text-culto-subtle">Configuración</span>
          <span className="font-semibold text-culto-text text-right ml-3">
            2 bolsas de 250 g · En grano
          </span>
        </div>
        <div className="flex justify-between py-2 border-t border-culto-divider text-[0.82rem]">
          <span className="text-culto-subtle">Próxima entrega estimada</span>
          <span className="font-semibold text-culto-text text-right ml-3">
            Jueves 12 de diciembre
          </span>
        </div>
      </Card>

      <div className="mt-5">
        <Button onClick={onFinish}>Volver a Mi suscripción</Button>
      </div>
    </section>
  );
}

// Main Reactivate Component
export default function Reactivate() {
  const [currentStep, setCurrentStep] = useState<Step>("reactivar");
  const [selectedOption, setSelectedOption] =
    useState<ReactivationOption>("charge-now");

  const handleBack = (): void => {
    switch (currentStep) {
      case "payment":
        setCurrentStep("reactivar");
        break;
      case "confirm":
      case "payment-confirm":
        setCurrentStep("reactivar");
        break;
      default:
        console.log("Volver");
    }
  };

  const handleClose = (): void => {
    console.log("Cerrar");
  };

  const handleConfirmReactivation = (): void => {
    if (selectedOption === "keep-date") {
      setCurrentStep("confirm");
    } else {
      setCurrentStep("payment");
    }
  };

  const handlePaymentSubmit = (): void => {
    setCurrentStep("payment-confirm");
  };

  const handleFinish = (): void => {
    console.log("Volver a Mi suscripción");
    setCurrentStep("reactivar");
  };

  const getHeaderTitle = (): string => {
    switch (currentStep) {
      case "payment":
        return "Método de pago";
      case "confirm":
      case "payment-confirm":
        return "Confirmación";
      default:
        return "Reactivar plan";
    }
  };

  return (
    <div className="min-h-screen bg-culto-bg">
      <div className="max-w-[480px] mx-auto py-3 px-4 pb-8">
        <Header
          title={getHeaderTitle()}
          onBack={handleBack}
          onClose={handleClose}
        />

        <main>
          {currentStep === "reactivar" && (
            <StepReactivar
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              onConfirm={handleConfirmReactivation}
              onChangePlan={() => console.log("Cambiar de plan")}
              onCancel={() => console.log("Cancelar")}
            />
          )}

          {currentStep === "payment" && (
            <StepPayment onSubmit={handlePaymentSubmit} />
          )}

          {currentStep === "confirm" && <StepConfirm onFinish={handleFinish} />}

          {currentStep === "payment-confirm" && (
            <StepConfirm onFinish={handleFinish} showPaymentInfo />
          )}
        </main>
      </div>
    </div>
  );
}
