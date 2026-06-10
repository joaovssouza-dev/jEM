import { MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPropertyImage } from '../utils/photos';

export default function PropertyCard({ property }) {
    // Definindo a imagem do card
    const imageUrl = getPropertyImage(property.id);

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col">

            <div className="h-64 overflow-hidden bg-gray-200">
                <img
                    src={imageUrl}
                    alt={`Foto de ${property.titulo}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="p-6 flex flex-col grow">
                <h3 className="text-2xl font-bold text-jem-text mb-3 line-clamp-1">
                    {property.titulo}
                </h3>

                <div className="flex items-center text-gray-500 mb-6 gap-5">
                    <div className="flex items-center gap-1.5">
                        <MapPin size={20} className="text-jem-primary" />
                        <span className="text-lg">{property.cidade}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users size={20} className="text-jem-primary" />
                        <span className="text-lg">Até {property.capacidade_hospedes} pessoas</span>
                    </div>
                </div>

                <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="text-sm text-gray-500 block mb-1">Diária a partir de</span>
                        <span className="text-2xl font-bold text-jem-primary">
                            R$ {Number(property.valor_diaria || 0).toFixed(2)} / dia
                        </span>
                    </div>
                    <Link
                        to={`/propriedade/${property.id}`}
                        className="bg-jem-secondary text-jem-primary font-bold px-6 py-3 rounded-xl hover:bg-[#d4dada] transition-colors text-lg"
                    >
                        Ver Espaço
                    </Link>
                </div>
            </div>
        </div>
    );
}