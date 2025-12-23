import { useState, useEffect, useRef } from "react";
import AccountHelpCharli from "../common/AccountHelpCharli";
import LogoutSection from "../common/LogoutSection";

interface DataViewProps {
  onSave?: () => void;
}

// Validation helpers
function normalizePhone(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const hasPlus = trimmed[0] === "+";
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? "+" + digits : digits;
}

function validateEmail(rawValue: string): {
  valid: boolean;
  message?: string;
} {
  const value = (rawValue || "").trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  if (!ok) return { valid: false, message: "Ingresá un email válido." };
  return { valid: true };
}

function validatePhone(rawValue: string): {
  valid: boolean;
  message?: string;
} {
  const norm = normalizePhone(rawValue);
  if (norm.length === 0) return { valid: true };
  if (norm[0] !== "+") {
    return {
      valid: false,
      message: "Ingresá el número con código de país. Ej: +598 99 123 456",
    };
  }
  const digitsOnly = norm.replace(/\D/g, "");
  if (digitsOnly.length < 8) {
    return { valid: false, message: "Ingresá un número válido (mínimo 8 dígitos)." };
  }
  return { valid: true };
}

function validateRut(rawValue: string): {
  valid: boolean;
  message?: string;
} {
  const digits = (rawValue || "").replace(/\D/g, "");
  if (digits.length === 0) return { valid: true };
  if (digits.length !== 12) {
    return { valid: false, message: "Ingresá un RUT de 12 dígitos." };
  }
  return { valid: true };
}

function validateCode(rawValue: string): {
  valid: boolean;
  message?: string;
} {
  const digits = (rawValue || "").replace(/\D/g, "");
  if (digits.length !== 6) {
    return {
      valid: false,
      message: "Ingresá el código completo de 6 dígitos.",
    };
  }
  return { valid: true };
}

function DataView({ onSave }: DataViewProps) {
  // Form state
  const [nombre, setNombre] = useState("Danu");
  const [apellido, setApellido] = useState("Nunox");
  const [email, setEmail] = useState("danu.nunox@gmail.com");
  const [phone, setPhone] = useState("+59899345368");
  const [rut, setRut] = useState("219899570015");
  const [razonSocial, setRazonSocial] = useState("DANA TERDIMAN");
  const [code, setCode] = useState("");

  // Validation state
  const [phoneValidated, setPhoneValidated] = useState(false);
  const [showValidateCard, setShowValidateCard] = useState(false);
  const [originalPhone, setOriginalPhone] = useState("+59899345368");

  // Error states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [rutError, setRutError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);

  // UI states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendFeedback, setResendFeedback] = useState<string | null>(null);

  const codeInputRef = useRef<HTMLInputElement>(null);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          setResendFeedback("Si no recibiste el código, podés volver a reenviarlo.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Check if phone changed after validation
  useEffect(() => {
    if (phoneValidated && normalizePhone(phone) !== normalizePhone(originalPhone)) {
      setPhoneValidated(false);
      setShowValidateCard(false);
    }
  }, [phone, phoneValidated, originalPhone]);

  // Field validation on blur
  const handleEmailBlur = () => {
    const result = validateEmail(email);
    setEmailError(result.valid ? null : result.message || null);
  };

  const handlePhoneBlur = () => {
    const result = validatePhone(phone);
    setPhoneError(result.valid ? null : result.message || null);
  };

  const handleRutBlur = () => {
    const result = validateRut(rut);
    setRutError(result.valid ? null : result.message || null);
  };

  // Clear errors on input change if error exists
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      const result = validateEmail(value);
      if (result.valid) setEmailError(null);
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (phoneError) {
      const result = validatePhone(value);
      if (result.valid) setPhoneError(null);
    }
  };

  const handleRutChange = (value: string) => {
    setRut(value);
    if (rutError) {
      const result = validateRut(value);
      if (result.valid) setRutError(null);
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (codeError) {
      const result = validateCode(value);
      if (result.valid) setCodeError(null);
    }
  };

  // Open validate card
  const handleOpenValidate = () => {
    setShowValidateCard(true);
    setCode("");
    setCodeError(null);
    setTimeout(() => codeInputRef.current?.focus(), 100);
  };

  // Confirm code
  const handleConfirmCode = () => {
    const result = validateCode(code);
    if (!result.valid) {
      setCodeError(result.message || null);
      codeInputRef.current?.focus();
      return;
    }

    // Mock: assume code is correct
    setPhoneValidated(true);
    setShowValidateCard(false);
    setOriginalPhone(normalizePhone(phone));
    setCodeError(null);
  };

  // Resend code
  const handleResendCode = () => {
    if (resendCooldown > 0) return;

    setResendFeedback(
      "Te enviamos un nuevo código por WhatsApp/SMS. Podés volver a reenviarlo en 30 segundos."
    );
    setResendCooldown(30);
    codeInputRef.current?.focus();
  };

  // Save changes
  const handleSave = () => {
    const emailResult = validateEmail(email);
    const phoneResult = validatePhone(phone);
    const rutResult = validateRut(rut);

    setEmailError(emailResult.valid ? null : emailResult.message || null);
    setPhoneError(phoneResult.valid ? null : phoneResult.message || null);
    setRutError(rutResult.valid ? null : rutResult.message || null);

    if (!emailResult.valid || !phoneResult.valid || !rutResult.valid) {
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    // Mock save
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      onSave?.();

      // Hide success after 3.5s
      setTimeout(() => setSaveSuccess(false), 3500);
    }, 600);
  };

  const inputBaseClass =
    "w-full rounded-lg border py-2 px-2.5 text-sm outline-none transition-colors";
  const inputNormalClass = `${inputBaseClass} border-[#D4D0C7] bg-[#FBFAF8] focus:border-[#111] focus:bg-white`;
  const inputErrorClass = `${inputBaseClass} border-[#B91C1C] bg-[#FFF7F7] focus:border-[#7F1D1D] focus:bg-white`;

  const getPhoneHelpText = () => {
    if (phoneValidated) {
      return "Si cambiás tu número, vas a tener que validarlo de nuevo para que Charli pueda seguir reconociendo tu suscripción.";
    }
    if (normalizePhone(phone) !== normalizePhone(originalPhone) && originalPhone) {
      return "Cambiaste el número. Vas a tener que validarlo nuevamente para que Charli pueda reconocerte.";
    }
    return "Validar tu número es clave para que Charli pueda reconocerte y gestionar tu suscripción por WhatsApp.";
  };

  return (
    <div>
      <div className="text-base font-medium mb-1">Hola, Danu</div>
      <p className="text-[0.8125rem] text-[#666] m-0 mb-3">
        Estos son los datos asociados a tu cuenta y a tu suscripción. Podés
        actualizarlos cuando quieras.
      </p>
      <hr className="border-0 border-t border-[#e1ddd7] my-2 mb-4" />

      {/* Datos personales */}
      <section className="bg-white rounded-xl py-3.5 px-3.5 pb-1.5 mb-3 shadow-[0_0_0_1px_rgba(0,0,0,0.03)]">
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
          Datos personales y de contacto
        </div>

        <div className="mb-3">
          <label className="block text-xs text-[#6B665D] mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={inputNormalClass}
          />
        </div>

        <div className="mb-3">
          <label className="block text-xs text-[#6B665D] mb-1">Apellido</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className={inputNormalClass}
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label
            className={`block text-xs mb-1 ${
              emailError ? "text-[#7F1D1D]" : "text-[#6B665D]"
            }`}
          >
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={handleEmailBlur}
            className={emailError ? inputErrorClass : inputNormalClass}
            aria-invalid={!!emailError}
          />
          {emailError && (
            <p className="text-[11px] text-[#B91C1C] mt-1.5 mb-0 leading-[1.4]">
              {emailError}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-3">
          <div className="flex justify-between items-center gap-2 mb-1">
            <label
              className={`text-xs ${
                phoneError ? "text-[#7F1D1D]" : "text-[#6B665D]"
              }`}
            >
              Teléfono
            </label>
            <div
              className={`text-[11px] py-0.5 px-2 rounded-full inline-flex items-center gap-1 whitespace-nowrap ${
                phoneValidated
                  ? "bg-[#E8F7EC] text-[#2E7D32]"
                  : "bg-[#FFF7E0] text-[#8A6E1F]"
              }`}
            >
              <span>{phoneValidated ? "✅" : "⚠️"}</span>
              <span>
                {phoneValidated ? "Teléfono validado" : "Pendiente de validación"}
              </span>
            </div>
          </div>

          <input
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onBlur={handlePhoneBlur}
            className={phoneError ? inputErrorClass : inputNormalClass}
            aria-invalid={!!phoneError}
          />

          {phoneError && (
            <p className="text-[11px] text-[#B91C1C] mt-1.5 mb-0 leading-[1.4]">
              {phoneError}
            </p>
          )}

          <p className="text-[11px] text-[#8B8478] mt-1 mb-0 leading-[1.4]">
            {getPhoneHelpText()}
          </p>

          {!phoneValidated && !showValidateCard && (
            <button
              onClick={handleOpenValidate}
              className="bg-transparent border-none p-0 mt-1 text-xs font-medium underline cursor-pointer text-[#111]"
            >
              Validar teléfono
            </button>
          )}

          {phoneValidated && (
            <p className="text-[11px] text-[#2E7D32] mt-1">
              Listo, tu teléfono quedó validado. Charli ya te reconoce con este
              número.
            </p>
          )}

          {/* Validate phone card */}
          {showValidateCard && !phoneValidated && (
            <div className="mt-4 bg-white rounded-xl py-3 px-3.5 pb-4 shadow-[0_0_0_1px_rgba(0,0,0,0.03)]">
              <h2 className="text-[0.95rem] font-semibold m-0 mb-1">
                Validar teléfono
              </h2>
              <p className="text-[0.8rem] text-[#807A70] m-0 mb-2.5">
                Te enviamos un código por WhatsApp/SMS al número que tenés
                guardado. Ingresalo acá para confirmar que es tuyo.
              </p>

              <label className="block text-xs text-[#6B665D] mb-1">
                Código de verificación
              </label>
              <input
                ref={codeInputRef}
                type="text"
                maxLength={6}
                inputMode="numeric"
                placeholder="••••••"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className={`w-full rounded-lg border py-2 px-2.5 text-base tracking-[0.35em] text-center outline-none transition-colors ${
                  codeError
                    ? "border-[#B91C1C] bg-[#FFF7F7] focus:border-[#7F1D1D]"
                    : "border-[#D4D0C7] bg-[#FBFAF8] focus:border-[#111] focus:bg-white"
                }`}
              />

              {codeError && (
                <p className="text-[11px] text-[#B91C1C] mt-1.5 mb-0 leading-[1.4]">
                  {codeError}
                </p>
              )}

              <div className="mt-2.5">
                <button
                  onClick={handleConfirmCode}
                  className="w-full rounded-full border-none bg-[#111] text-white py-3.5 px-4 text-sm font-medium cursor-pointer"
                >
                  Confirmar código
                </button>

                <button
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0}
                  className={`text-xs text-[#5C574F] bg-transparent border-none p-0 cursor-pointer mt-1.5 block w-full ${
                    resendCooldown > 0
                      ? "opacity-50 cursor-default no-underline"
                      : "underline"
                  }`}
                >
                  {resendCooldown > 0
                    ? `Reenviar código (${resendCooldown}s)`
                    : "Reenviar código"}
                </button>

                {resendFeedback && (
                  <p className="text-[11px] text-[#8B8478] mt-1 mb-0 leading-[1.4]">
                    {resendFeedback}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Datos de facturación */}
      <section className="bg-white rounded-xl py-3.5 px-3.5 pb-1.5 mb-3 shadow-[0_0_0_1px_rgba(0,0,0,0.03)]">
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9A9388] mb-2">
          Datos de facturación
        </div>

        {/* RUT */}
        <div className="mb-3">
          <label
            className={`block text-xs mb-1 ${
              rutError ? "text-[#7F1D1D]" : "text-[#6B665D]"
            }`}
          >
            RUT (opcional)
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Ej: 219899570015"
            value={rut}
            onChange={(e) => handleRutChange(e.target.value)}
            onBlur={handleRutBlur}
            className={rutError ? inputErrorClass : inputNormalClass}
            aria-invalid={!!rutError}
          />
          <p className="text-[11px] text-[#8B8478] mt-1 mb-0 leading-[1.4]">
            Si querés factura con RUT, asegurate de tener estos datos
            actualizados antes de tu próxima compra.
          </p>
          {rutError && (
            <p className="text-[11px] text-[#B91C1C] mt-1 mb-0 leading-[1.4]">
              {rutError}
            </p>
          )}
        </div>

        <div className="mb-1.5">
          <label className="block text-xs text-[#6B665D] mb-1">
            Razón Social (opcional)
          </label>
          <input
            type="text"
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
            className={`${inputNormalClass} uppercase`}
          />
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full rounded-full border-none bg-[#111] text-white py-3.5 px-4 text-sm font-medium cursor-pointer mt-3 disabled:opacity-70"
      >
        {isSaving ? "Guardando…" : "Guardar cambios"}
      </button>

      {saveSuccess && (
        <p className="text-[11px] text-[#2E7D32] mt-1 text-center">
          Listo. Guardamos tus cambios.
        </p>
      )}

      <p className="text-xs text-[#777] text-center mt-2 leading-[1.4]">
        Usamos estos datos para tus pedidos, tu facturación y para que Charli
        pueda ayudarte con tu suscripción.
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

export default DataView;
