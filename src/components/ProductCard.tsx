import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useViewMode } from "@/contexts/ViewModeContext";

interface ProductCardProps {
  title: string;
  description: string;
  price: string;
  oldPrice?: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  cardColor?: string;
  productId: string;
}

const ProductCard = ({ 
  title, 
  description, 
  price, 
  oldPrice, 
  image, 
  badge, 
  badgeColor = "bg-primary",
  cardColor = "bg-card-pink",
  productId
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { viewMode } = useViewMode();
  const isMobile = viewMode === 'mobile';

  return (
    <Card 
      className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${cardColor} border-0 cursor-pointer`}
      onClick={() => navigate(`/producto/${productId}`)}
    >
      <CardContent className="p-0">
        {badge && (
          <Badge className={`absolute ${isMobile ? 'top-2 left-2 text-[10px] px-2 py-0.5' : 'top-4 left-4 px-4 py-1'} z-10 ${badgeColor} text-white border-0 rounded-full font-bold`}>
            {badge}
          </Badge>
        )}
        
        <div className={`aspect-square overflow-hidden bg-white/50 flex items-center justify-center ${isMobile ? 'p-4' : 'p-8'}`}>
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className={`${isMobile ? 'p-3' : 'p-6'} space-y-3 bg-white`}>
          <h3 className={`font-bold ${isMobile ? 'text-[10px]' : 'text-sm'} uppercase leading-tight ${isMobile ? 'min-h-[30px]' : 'min-h-[40px]'}`}>
            {title}
          </h3>
          <p className={`${isMobile ? 'text-[9px]' : 'text-xs'} text-muted-foreground leading-relaxed ${isMobile ? 'min-h-[35px]' : 'min-h-[45px]'}`}>
            {description}
          </p>
          
          <div className="flex items-baseline gap-2 pt-2">
            {oldPrice && (
              <span className={`${isMobile ? 'text-[9px]' : 'text-xs'} text-muted-foreground line-through`}>
                desde {oldPrice}
              </span>
            )}
            <span className={`${isMobile ? 'text-sm' : 'text-xl'} font-bold text-primary`}>
              {price}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
