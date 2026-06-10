import { Search, MapPin, Users } from 'lucide-react';

export default function Hero({ termoBusca, setTermoBusca, capacidadeMinima, setCapacidadeMinima, onBuscar }) {
  return (
    <section className="relative text-white py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-125">

      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2000')" }}
      >
        <div className="absolute inset-0 bg-jem-primary/70 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center w-full">

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight drop-shadow-lg">
          Encontre o espaço ideal para o seu próximo lazer ou folga
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
          Alugue espaços e áreas de lazer direto com os proprietários. Rápido e fácil.
        </p>

        <form onSubmit={onBuscar} className="bg-white rounded-2xl p-2 sm:p-3 shadow-2xl flex flex-col md:flex-row gap-3 max-w-4xl mx-auto text-jem-text">

          <div className="grow flex items-center bg-gray-50 rounded-xl px-4 py-3 sm:py-4 border border-gray-200 focus-within:border-jem-primary focus-within:ring-1 focus-within:ring-jem-primary transition-all">
            <MapPin className="text-gray-400 mr-3 shrink-0" size={24} />
            <input
              type="text"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Nome do espaço, chácara ou cidade..."
              className="w-full bg-transparent text-lg focus:outline-none placeholder-gray-400"
            />
          </div>

          <div className="md:w-64 flex items-center bg-gray-50 rounded-xl px-4 py-3 sm:py-4 border border-gray-200 focus-within:border-jem-primary focus-within:ring-1 focus-within:ring-jem-primary transition-all">
            <Users className="text-gray-400 mr-3 shrink-0" size={24} />
            <select
              value={capacidadeMinima}
              onChange={(e) => setCapacidadeMinima(e.target.value)}
              className="w-full bg-transparent text-lg focus:outline-none text-gray-600 appearance-none cursor-pointer"
            >
              <option value="">Nº de pessoas</option>
              <option value="10">A partir de 10</option>
              <option value="20">A partir de 20</option>
              <option value="30">Mais de 30 pessoas</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-jem-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-jem-accent transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0"
          >
            <Search size={24} />
            <span>Buscar</span>
          </button>

        </form>

      </div>
    </section>
  );
}