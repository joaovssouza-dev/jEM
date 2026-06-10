import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Loader2, MapPin, DollarSign, Users, Type, Edit3, Search } from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function CadastrarPropriedade() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '', descricao: '', capacidade_hospedes: '', valor_diaria: '',
    cep: '', cidade: '', bairro: '', rua: '', numero: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'cep') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 9);
    } else if (['capacidade_hospedes', 'valor_diaria', 'numero'].includes(name)) {
      formattedValue = value.replace(/\D/g, '');
    }
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const buscarCEP = async () => {
    const cepLimpo = formData.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return alert("CEP inválido");
    try {
      setLoading(true);
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (data.erro) throw new Error("CEP não encontrado");
      setFormData(prev => ({ ...prev, cidade: data.localidade, bairro: data.bairro, rua: data.logradouro }));
    } catch (error) { alert(error.message); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não logado");
      const { error } = await supabase.from('propriedades').insert([{
        ...formData,
        locador_id: user.id,
        capacidade_hospedes: parseInt(formData.capacidade_hospedes),
        valor_diaria: parseFloat(formData.valor_diaria),
        fotos_urls: []
      }]);
      if (error) throw error;
      alert("Espaço publicado!");
      navigate('/');
    } catch (error) { alert("Erro: " + error.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-xl max-h-[90vh] overflow-y-auto custom-scrollbar">

        <h1 className="text-3xl font-black text-jem-text mb-2">Anunciar novo espaço</h1>
        <p className="text-gray-500 mb-8">Preencha as informações para listar seu espaço no jEM.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Type className="absolute left-3 top-3.5 text-jem-primary" size={20} />
              <input name="titulo" value={formData.titulo} onChange={handleChange} required placeholder="Título do anúncio" className="w-full h-12 rounded-xl border border-gray-200 px-11 outline-none focus:ring-2 focus:ring-jem-primary/20 focus:border-jem-primary transition-all" />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3.5 text-jem-primary" size={20} />
              <input name="valor_diaria" value={formData.valor_diaria} onChange={handleChange} required placeholder="Valor da diária (R$)" className="w-full h-12 rounded-xl border border-gray-200 px-11 outline-none focus:ring-2 focus:ring-jem-primary/20 focus:border-jem-primary transition-all" />
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-3.5 text-jem-primary" size={20} />
              <input name="capacidade_hospedes" value={formData.capacidade_hospedes} onChange={handleChange} required placeholder="Capacidade (pessoas)" className="w-full h-12 rounded-xl border border-gray-200 px-11 outline-none focus:ring-2 focus:ring-jem-primary/20 focus:border-jem-primary transition-all" />
            </div>
            <div className="flex gap-2">
              <div className="relative grow">
                <MapPin className="absolute left-3 top-3.5 text-jem-primary" size={20} />
                <input name="cep" value={formData.cep} onChange={handleChange} required placeholder="CEP" className="w-full h-12 rounded-xl border border-gray-200 px-11 outline-none focus:ring-2 focus:ring-jem-primary/20 focus:border-jem-primary transition-all" />
              </div>
              <button type="button" onClick={buscarCEP} className="bg-jem-primary text-white px-6 rounded-xl hover:bg-jem-accent transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>

          <div className="relative">
            <Edit3 className="absolute left-3 top-4 text-jem-primary" size={20} />
            <textarea name="descricao" value={formData.descricao} onChange={handleChange} required placeholder="Descrição detalhada..." className="w-full h-32 rounded-xl border border-gray-200 p-4 pl-11 outline-none focus:ring-2 focus:ring-jem-primary/20 focus:border-jem-primary transition-all" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Cidade" className="h-12 rounded-xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-jem-primary/20 focus:border-jem-primary" />
            <input name="bairro" value={formData.bairro} onChange={handleChange} placeholder="Bairro" className="h-12 rounded-xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-jem-primary/20 focus:border-jem-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="rua" value={formData.rua} onChange={handleChange} placeholder="Rua" className="md:col-span-2 h-12 rounded-xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-jem-primary/20 focus:border-jem-primary" />
            <input name="numero" value={formData.numero} onChange={handleChange} placeholder="Nº" className="h-12 rounded-xl border border-gray-200 px-4 outline-none focus:ring-2 focus:ring-jem-primary/20 focus:border-jem-primary" />
          </div>

          <div className="h-48 w-full rounded-2xl overflow-hidden border border-gray-200">
            <MapContainer center={[-21.21, -50.44]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </MapContainer>
          </div>

          <button disabled={loading} className="w-full h-14 bg-jem-primary text-white rounded-xl font-bold text-lg hover:bg-jem-accent transition-all shadow-lg shadow-jem-primary/20">
            {loading ? <Loader2 className="animate-spin" /> : "Publicar Espaço"}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full text-center text-gray-400 hover:text-jem-primary font-medium text-sm transition-colors">
            Cancelar cadastro
          </button>
        </form>
      </div>
    </div>
  );
}