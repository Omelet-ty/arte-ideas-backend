import { Button } from "@/components/ui/button";
import { useViewMode } from "@/contexts/ViewModeContext";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  const { viewMode } = useViewMode();
  const isMobile = viewMode === 'mobile';
  
  return (
    <section className="relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)' }} />
      
      <div className={`container mx-auto px-4 ${isMobile ? 'py-8' : 'py-24'} relative z-10`}>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className={`inline-block bg-white/80 backdrop-blur-sm rounded-3xl ${isMobile ? 'px-6 py-8' : 'px-12 py-16'} shadow-xl`}>
            <h1 className={`${isMobile ? 'text-3xl' : 'text-6xl md:text-7xl'} font-bold mb-4`}>
              <span className="text-primary" style={{ fontStyle: 'italic', fontWeight: 'bold' }}>
                Arte
              </span>
              <span className="text-secondary font-bold">IDEAS</span>
            </h1>
            <p className={`${isMobile ? 'text-base' : 'text-xl'} text-foreground/80 font-medium uppercase tracking-wide mb-8`}>
              Diseño Creativo
            </p>
            
            <div className="flex flex-col gap-4 justify-center">
              <Button size={isMobile ? "default" : "lg"} className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">
                Explorar nuestros cuadros/marcos
              </Button>
              <Button 
                size={isMobile ? "default" : "lg"}
                variant="outline" 
                className="rounded-full px-8 border-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                Ver servicios
              </Button>
            </div>
            
            <p className={`mt-8 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground max-w-xl mx-auto`}>
              Imprime todas tus fotos favoritas con entrega en tienda gratis en 48 horas hábiles
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
