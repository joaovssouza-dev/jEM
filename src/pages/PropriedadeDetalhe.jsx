import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { MapPin, ArrowLeft, Users, DollarSign, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { getPropertyImage } from '../utils/photos';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'leaflet/dist/leaflet.css';

export default function PropriedadeDetalhe() {
  const { id } = useParams();
  const [prop, setProp] = useState(null);
  const [locador, setLocador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [indexFoto, setIndexFoto] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const blockedDates = [
    new Date(2026, 5, 12),
    new Date(2026, 5, 13),
    new Date(2026, 5, 20)
  ];

  useEffect(() => {
    const fetchProp = async () => {
      const { data, error } = await supabase.from('propriedades').select('*').eq('id', id).single();
      if (!error) {
        setProp(data);
        const { data: userData } = await supabase.from('usuarios').select('nome').eq('id', data.locador_id).single();
        if (userData) setLocador(userData.nome);
      }
      setLoading(false);
    };
    fetchProp();
  }, [id]);

  const handleReservation = () => {
    const isBlocked = blockedDates.some(d => d.toDateString() === selectedDate.toDateString());
    if (isBlocked) {
      alert("Essa data já está reservada! Por favor, escolha outra.");
    } else {
      alert(`Sucesso! Reserva solicitada para ${selectedDate.toLocaleDateString('pt-BR')}`);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin text-jem-primary">Carregando...</div></div>;
  if (!prop) return <div className="min-h-screen bg-gray-50 text-gray-800 text-center py-20">Propriedade não encontrada.</div>;

  const images = (prop.fotos_urls?.length > 0) ? prop.fotos_urls : [getPropertyImage(prop.id)];
  const nextFoto = () => setIndexFoto((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevFoto = () => setIndexFoto((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-jem-primary transition-colors mb-6">
          <ArrowLeft className="mr-2" size={20} /> Voltar para a vitrine
        </Link>

        <h1 className="text-4xl md:text-5xl font-black text-jem-text mb-4">{prop.titulo}</h1>
        <div className="flex items-center text-gray-500 mb-8 font-medium">
          <MapPin className="mr-2 text-jem-primary" size={20} />
          {prop.rua}, {prop.numero} - {prop.bairro}, {prop.cidade}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-200 shadow-sm">
            <img src={images[indexFoto]} alt="Espaço" className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button onClick={prevFoto} className="absolute left-2 top-1/2 bg-white/80 p-2 rounded-full text-jem-text hover:bg-white"><ChevronLeft /></button>
                <button onClick={nextFoto} className="absolute right-2 top-1/2 bg-white/80 p-2 rounded-full text-jem-text hover:bg-white"><ChevronRight /></button>
              </>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-jem-text">Verifique disponibilidade</h3>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileDisabled={({ date }) => blockedDates.some(d => d.toDateString() === date.toDateString())}
                className="w-full border-none rounded-xl"
              />
            </div>

            <button
              onClick={handleReservation}
              className="w-full bg-jem-primary text-white h-14 rounded-xl font-bold hover:bg-jem-accent transition-all shadow-lg shadow-jem-primary/20"
            >
              Solicitar Reserva para {selectedDate.toLocaleDateString('pt-BR')}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <h3 className="font-bold text-jem-text mb-4">Sobre o espaço</h3>
            <p className="text-gray-600 leading-relaxed">{prop.descricao}</p>
          </div>

          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <Users className="text-jem-primary" />
              <div><p className="text-xs text-gray-400 uppercase">Capacidade</p><p className="font-bold">{prop.capacidade_hospedes} pessoas</p></div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="text-jem-primary" />
              <div><p className="text-xs text-gray-400 uppercase">Diária</p><p className="font-bold">R$ {Number(prop.valor_diaria).toFixed(2)}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <User className="text-jem-primary" />
              <div><p className="text-xs text-gray-400 uppercase">Anunciado por</p><p className="font-bold">{locador || "Proprietário jEM"}</p></div>
            </div>
          </div>
        </div>

        <div className="mt-10 h-64 w-full rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <MapContainer center={[-21.21, -50.44]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}