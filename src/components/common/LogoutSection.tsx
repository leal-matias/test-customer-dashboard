interface LogoutSectionProps {
  onLogout?: () => void;
}

function LogoutSection({ onLogout }: LogoutSectionProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default: go to home/landing page
      console.log("Cerrar sesión");
    }
  };

  return (
    <>
      <hr className="border-0 border-t border-[#e1ddd7] mt-6 mb-4" />
      <div className="text-center">
        <button
          onClick={handleLogout}
          className="bg-transparent border-none p-0 text-[0.8125rem] font-medium cursor-pointer underline text-[#111]"
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

export default LogoutSection;


