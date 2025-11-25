import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Gift } from "lucide-react";
import { useState } from "react";
import { useViewMode } from "@/contexts/ViewModeContext";
import frameGraduation from "@/assets/frame-graduation.jpg";
import frameCollage from "@/assets/frame-collage.jpg";
import frameFamily from "@/assets/frame-family.jpg";
import photoPrints from "@/assets/photo-prints.jpg";

// Product data - in a real app this would come from an API/database
const products = {
  "marco-basico": {
    id: "marco-basico",
    title: "Marco Básico Personalizado con Foto",
    description: "Marco elegante perfecto para cualquier foto especial",
    price: "€24.99",
    oldPrice: "€34.99",
    image: frameGraduation,
    badge: "OFERTA",
    images: [
      frameGraduation,
      frameGraduation,
    ]
  },
  "marco-collage": {
    id: "marco-collage",
    title: "Marcos Personalizados con Fotos - Collage",
    description: "Crea un hermoso collage con tus mejores momentos",
    price: "€39.99",
    oldPrice: "€49.99",
    image: frameCollage,
    badge: "NUEVO",
    images: [
      frameCollage,
      frameCollage,
    ]
  },
  "marco-elegante": {
    id: "marco-elegante",
    title: "Marco Personalizado con Fotos - Elegante",
    description: "Marco de alta calidad con acabado profesional",
    price: "€34.99",
    oldPrice: "€44.99",
    image: frameFamily,
    badge: "POPULAR",
    images: [
      frameFamily,
      frameFamily,
    ]
  },
  "impresiones-fotos": {
    id: "impresiones-fotos",
    title: "Impresiones de Fotos - Revelado",
    description: "Impresiones de alta calidad en diversos tamaños",
    price: "€9.99",
    oldPrice: "€12.99",
    image: photoPrints,
    badge: "OFERTA",
    images: [
      photoPrints,
      photoPrints,
    ]
  }
};

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { viewMode } = useViewMode();
  const isMobile = viewMode === 'mobile';
  const product = products[productId as keyof typeof products];
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Producto no encontrado</h1>
          <Button onClick={() => navigate("/")}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <Header />
      
      <div className={`container mx-auto ${isMobile ? 'px-2 py-4' : 'px-4 py-8 lg:py-16'}`}>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'lg:grid-cols-2 gap-8 lg:gap-12'} max-w-7xl mx-auto`}>
          {/* Left side - Images */}
          <div className={isMobile ? 'space-y-2' : 'space-y-4'}>
            <div className={`bg-card-pink rounded-3xl ${isMobile ? 'p-4' : 'p-8 lg:p-12'} aspect-square flex items-center justify-center`}>
              <img 
                src={product.images[selectedImage]} 
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Thumbnails */}
            <div className={`grid grid-cols-2 ${isMobile ? 'gap-2' : 'gap-4'}`}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`bg-white ${isMobile ? 'rounded-xl p-2' : 'rounded-2xl p-4'} aspect-square flex items-center justify-center transition-all ${
                    selectedImage === idx ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/50'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.title} ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right side - Product info */}
          <div className={isMobile ? 'space-y-3' : 'space-y-6'}>
            <Badge className={`bg-destructive text-white border-0 rounded-full ${isMobile ? 'px-3 py-0.5 text-xs' : 'px-4 py-1'} font-bold`}>
              {product.badge}
            </Badge>

            <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl lg:text-5xl'} font-bold text-foreground leading-tight`}>
              {product.title}
            </h1>

            <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-muted-foreground`}>
              {product.description}
            </p>

            <div className={`flex items-baseline ${isMobile ? 'gap-2' : 'gap-3'}`}>
              <span className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold text-primary`}>
                {product.price}
              </span>
              {product.oldPrice && (
                <span className={`${isMobile ? 'text-lg' : 'text-2xl'} text-muted-foreground line-through`}>
                  {product.oldPrice}
                </span>
              )}
            </div>

            {/* Promotions */}
            <div className={`bg-card-pink-soft ${isMobile ? 'rounded-xl p-4 space-y-2' : 'rounded-2xl p-6 space-y-4'}`}>
              <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-bold`} style={{ color: 'hsl(var(--primary))' }}>
                ¡Promociones especiales!
              </h3>
              
              <div className={isMobile ? 'space-y-2' : 'space-y-3'}>
                <div className="flex items-center gap-3">
                  <Gift className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} text-primary`} />
                  <span className={`${isMobile ? 'text-xs' : 'text-base'} text-foreground`}>Compra 3+ unidades: 10% descuento</span>
                </div>
                <div className="flex items-center gap-3">
                  <Gift className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} text-primary`} />
                  <span className={`${isMobile ? 'text-xs' : 'text-base'} text-foreground`}>Compra 5+ unidades: 15% descuento</span>
                </div>
                <div className="flex items-center gap-3">
                  <Gift className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} text-primary`} />
                  <span className={`${isMobile ? 'text-xs' : 'text-base'} text-foreground`}>Compra 10+ unidades: 25% descuento</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              size={isMobile ? 'default' : 'lg'}
              onClick={() => navigate(`/personalizar/${productId}`)}
              className={`w-full ${isMobile ? 'h-12 text-base' : 'h-14 text-lg'} font-bold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity`}
            >
              <ShoppingCart className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
              Empezar a Crear Online
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
