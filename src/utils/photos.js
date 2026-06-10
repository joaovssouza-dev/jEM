const ranchImages = [
    "https://images.unsplash.com/photo-1523309996740-d5315fd9aa2b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1449156753910-770066226939?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800"
];

export const getPropertyImage = (id) => {
    if (!id) return ranchImages[0];
    // Usa o hash do ID para sempre retornar a mesma imagem para o mesmo ID
    const index = id.charCodeAt(0) % ranchImages.length;
    return ranchImages[index];
};