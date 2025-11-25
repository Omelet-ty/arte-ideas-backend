import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useViewMode } from "@/contexts/ViewModeContext";
import frameGraduation from "@/assets/frame-graduation.jpg";
import frameCollage from "@/assets/frame-collage.jpg";
import frameFamily from "@/assets/frame-family.jpg";
import photoPrints from "@/assets/photo-prints.jpg";

const ProductsSection = () => {
  const { viewMode } = useViewMode();
  const isMobile = viewMode === 'mobile';
  const products = [
    {
      productId: "marco-basico",
      title: "Marco Básico Personalizado con Foto",
      description: "Resistente, bonito, colorido y muy personal. Todos podemos ser artistas con nuestros recuerdos",
      price: "11.96€",
      oldPrice: "10.00€",
      image: frameGraduation,
      badge: "¡Regalo!",
      badgeColor: "bg-primary",
      cardColor: "bg-card-pink"
    },
    {
      productId: "marco-collage",
      title: "Marcos Personalizados con Fotos - Collage",
      description: "Convierte tus mejores fotos en piezas de arte únicas. Varios tamaños y diseños disponibles.",
      price: "29.95€",
      image: frameCollage,
      badge: "¡TOP!",
      badgeColor: "bg-yellow-500",
      cardColor: "bg-card-yellow"
    },
    {
      productId: "marco-elegante",
      title: "Marco Personalizado con Fotos - Elegante",
      description: "Marcos de alta calidad con diseño elegante. Ideal para decorar tu hogar con tus mejores recuerdos.",
      price: "24.95€",
      image: frameFamily,
      badge: "¡Nuevo!",
      badgeColor: "bg-secondary",
      cardColor: "bg-card-pinkSoft"
    },
    {
      productId: "impresiones-fotos",
      title: "Impresiones de Fotos - Revelado",
      description: "Impresión profesional de fotos en varios tamaños. Calidad premium para tus mejores momentos.",
      price: "19.96€",
      oldPrice: "9.70€",
      image: photoPrints,
      badge: "¡Regalo!",
      badgeColor: "bg-primary",
      cardColor: "bg-card-blue"
    }
  ];

  return (
    <section className={`${isMobile ? 'py-8' : 'py-20'} bg-gradient-to-b from-white to-muted/20`}>
      <div className={`container mx-auto ${isMobile ? 'px-2' : 'px-4'}`}>
        <div className={`text-center ${isMobile ? 'mb-6' : 'mb-12'} space-y-3`}>
          <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'} font-bold`}>
            <span className="text-primary">¡Crea Regalos </span>
            <span className="text-secondary">Memorables!</span>
          </h2>
          <p className={`${isMobile ? 'text-sm px-2' : 'text-lg'} text-muted-foreground max-w-2xl mx-auto`}>
            Productos personalizados que convierten tus momentos en arte
          </p>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'} mb-12`}>
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>

        <div className="text-center">
          <Button 
            size={isMobile ? "sm" : "lg"}
            variant="outline"
            className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white px-8"
          >
            Ver todos los productos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
