import { ShoppingCart, Search, Package, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useViewMode } from "@/contexts/ViewModeContext";

const Header = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const { viewMode, setViewMode } = useViewMode();
  const isMobile = viewMode === 'mobile';
  
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className={`container mx-auto ${isMobile ? 'px-2' : 'px-4'}`}>
      <div className={`flex ${isMobile ? 'h-12' : 'h-16'} items-center justify-end`}>
        <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-4'}`}>
            {!isMobile && (
              <div className="hidden md:flex items-center gap-2 bg-muted rounded-full px-4 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar productos"
                  className="bg-transparent border-none outline-none text-sm w-48"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('desktop')}
                title="Vista PC"
                className={isMobile ? 'h-8 w-8' : ''}
              >
                <Monitor className={isMobile ? 'h-4 w-4' : 'h-5 w-5'} />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('mobile')}
                title="Vista Móvil"
                className={isMobile ? 'h-8 w-8' : ''}
              >
                <Smartphone className={isMobile ? 'h-4 w-4' : 'h-5 w-5'} />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/mis-pedidos")}
              title="Mis Pedidos"
              className={isMobile ? 'h-8 w-8' : ''}
            >
              <Package className={isMobile ? 'h-4 w-4' : 'h-5 w-5'} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`relative ${isMobile ? 'h-8 w-8' : ''}`}
              onClick={() => navigate("/carrito")}
            >
              <ShoppingCart className={isMobile ? 'h-4 w-4' : 'h-5 w-5'} />
              {totalItems > 0 && (
                <Badge className={`absolute -top-1 -right-1 ${isMobile ? 'h-4 w-4 text-[10px]' : 'h-5 w-5 text-xs'} flex items-center justify-center p-0 bg-destructive`}>
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
