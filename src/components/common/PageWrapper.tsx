import { useSwipeable } from "react-swipeable";
import { ViewType } from "../../types/ViewType";

interface Tab {
  id: ViewType;
  label: string;
}

const TABS: Tab[] = [
  { id: ViewType.MAIN, label: "Mi suscripción" },
  { id: ViewType.ORDERS, label: "Pedidos" },
  { id: ViewType.BENEFITS, label: "Beneficios" },
  { id: ViewType.DATA, label: "Datos" },
  { id: ViewType.PAYMENT_METHOD, label: "Método de pago" },
];

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  currentView?: ViewType;
  setCurrentView?: (view: ViewType) => void;
  onBack?: () => void;
  onClose?: () => void;
  showNav?: boolean;
}

function PageWrapper({
  children,
  title = "MI CUENTA",
  currentView,
  setCurrentView,
  onBack,
  onClose,
  showNav = false,
}: PageWrapperProps) {
  // Swipe handlers for tab navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (showNav && currentView && setCurrentView) {
        const currentIndex = TABS.findIndex((tab) => tab.id === currentView);
        if (currentIndex < TABS.length - 1) {
          setCurrentView(TABS[currentIndex + 1].id);
        }
      }
    },
    onSwipedRight: () => {
      if (showNav && currentView && setCurrentView) {
        const currentIndex = TABS.findIndex((tab) => tab.id === currentView);
        if (currentIndex > 0) {
          setCurrentView(TABS[currentIndex - 1].id);
        }
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50,
    preventScrollOnSwipe: false,
  });

  return (
    <div className="m-0 font-sans bg-[#f7f5f3] text-[#111] antialiased min-h-screen py-3 px-4 pb-6 md:py-6 md:px-8">
      <div className="max-w-[480px] md:max-w-[600px] lg:max-w-[720px] mx-auto">
        <header className="flex items-center justify-between relative mb-3">
          <div className="flex items-center min-w-[40px]">
            {onBack && (
              <button
                onClick={onBack}
                className="bg-transparent border-none text-xl cursor-pointer p-1 leading-none text-[#111]"
                aria-label="Volver"
              >
                ←
              </button>
            )}
          </div>
          <div className="flex-1 text-center text-[0.9375rem] font-semibold uppercase tracking-[0.12em]">
            {title}
          </div>
          <div className="flex items-center min-w-[40px] justify-end">
            {onClose && (
              <button
                onClick={onClose}
                className="bg-transparent border-none text-xl cursor-pointer p-1 leading-none text-[#111]"
                aria-label="Cerrar"
              >
                ✕
              </button>
            )}
          </div>
        </header>

        {showNav && currentView && setCurrentView && (
          <nav className="flex justify-center gap-1.5 mb-4 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x">
            {TABS.map((tab) => {
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className={`rounded-full border px-3 py-1.5 text-[0.8125rem] whitespace-nowrap cursor-pointer shrink-0 transition-all duration-200 ${
                    isActive
                      ? "border-[#111] bg-[#111] text-white"
                      : "border-[#ddd] bg-[#f7f5f3] text-[#111] hover:bg-[#eae7e3]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        )}

        <div {...(showNav ? swipeHandlers : {})} className="touch-pan-y">
          {children}
        </div>
      </div>
    </div>
  );
}

export default PageWrapper;
