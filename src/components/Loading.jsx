export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-jem-primary font-black text-4xl animate-pulse tracking-tighter">jEM</div>
      <p className="text-gray-400 mt-2 text-sm font-medium animate-pulse">Carregando detalhes...</p>
    </div>
  );
}