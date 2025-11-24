type Props = {
  value: string;
  onChange: (v: string) => void;
  canchas?: { id: string; nombre: string }[];
};

export default function CanchaSelector({ value, onChange, canchas }: Props) {
  const opciones = canchas ?? [
    { id: "1", nombre: "Cancha 1" },
    { id: "2", nombre: "Cancha 2" },
  ];
  return (
    <label style={{display:"flex",gap:8,alignItems:"center"}}>
      Cancha:
      <select value={value} onChange={(e)=>onChange(e.target.value)}>
        {opciones.map(c=> <option key={c.id} value={c.id}>{c.nombre}</option>)}
      </select>
    </label>
  );
}