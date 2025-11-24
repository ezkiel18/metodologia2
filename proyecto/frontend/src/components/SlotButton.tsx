type SlotButtonProps = {
  hora: string;
  ocupado: boolean;
  onClick: () => void;
};

export default function SlotButton({ hora, ocupado, onClick }: SlotButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 rounded-xl text-sm font-semibold text-white transition
        shadow-sm
        ${ocupado ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"}
      `}
    >
      <span>{hora}</span>
      {ocupado && (
        <span className="ml-2 text-xs font-normal opacity-80">
          (ocupado)
        </span>
      )}
    </button>
  );
}