// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import { supabase } from '../services/supabase';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [propriedades, setPropriedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const [capacidadeMinima, setCapacidadeMinima] = useState('');

  const buscarPropriedades = async () => {
    setLoading(true);
    let query = supabase.from('propriedades').select('*');

    if (termoBusca) {
      query = query.or(`titulo.ilike.%${termoBusca}%,cidade.ilike.%${termoBusca}%,bairro.ilike.%${termoBusca}%`);
    }

    if (capacidadeMinima) {
      query = query.gte('capacidade_hospedes', parseInt(capacidadeMinima));
    }

    const { data } = await query.order('created_at', { ascending: false });
    setPropriedades(data || []);
    setLoading(false);
  };

  useEffect(() => {
    buscarPropriedades();
  }, []);

  return (
    <div className="w-full">
      <Hero
        termoBusca={termoBusca} setTermoBusca={setTermoBusca}
        capacidadeMinima={capacidadeMinima} setCapacidadeMinima={setCapacidadeMinima}
        onBuscar={(e) => { e.preventDefault(); buscarPropriedades(); }}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-jem-text mb-10">
          {propriedades.length > 0 ? "Espaços disponíveis" : "Propriedades recomendadas"}
        </h2>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-jem-primary h-12 w-12" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propriedades.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}