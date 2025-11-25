import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useViewMode } from "@/contexts/ViewModeContext";

const Cart = () => {
  const navigate = useNavigate();
  const { viewMode } = useViewMode();
  const isMobile = viewMode === 'mobile';
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
        <Header />
        
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              Tu carrito está vacío
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              ¡Empieza a agregar productos para crear tus marcos personalizados!
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              Ver Productos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <Header />
      
      <div className={`container mx-auto ${isMobile ? 'px-2 py-4' : 'px-4 py-8'}`}>
        <h1 className={`${isMobile ? 'text-2xl mb-4' : 'text-4xl mb-8'} font-bold text-foreground`}>
          Carrito de Compras
        </h1>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'lg:grid-cols-3 gap-8'}`}>
          {/* Products List */}
          <div className={`${isMobile ? 'space-y-3' : 'lg:col-span-2 space-y-4'}`}>
            {items.map((item) => (
              <Card key={item.id} className={isMobile ? 'p-3' : 'p-6'}>
                <div className={`flex ${isMobile ? 'gap-3' : 'gap-6'}`}>
                  {/* Product Image */}
                  <div className={`${isMobile ? 'w-20 h-20' : 'w-32 h-32'} rounded-lg overflow-hidden bg-muted flex-shrink-0`}>
                    <img
                      src={item.image}
                      alt={item.projectName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className={`${isMobile ? 'text-base' : 'text-xl'} font-bold text-foreground ${isMobile ? 'mb-1' : 'mb-2'}`}>
                      {item.projectName}
                    </h3>
                    <div className={`${isMobile ? 'space-y-0' : 'space-y-1'} ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                      <p>Formato: {item.format}</p>
                      <p>Tipo de Papel: {item.paperType}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className={`flex items-center gap-3 ${isMobile ? 'mt-2' : 'mt-4'}`}>
                      <Button
                        size="icon"
                        variant="outline"
                        className={isMobile ? 'h-6 w-6' : 'h-8 w-8'}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />
                      </Button>
                      <span className={`font-semibold ${isMobile ? 'w-6 text-sm' : 'w-8'} text-center`}>
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className={isMobile ? 'h-6 w-6' : 'h-8 w-8'}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />
                      </Button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-primary`}>
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`text-destructive hover:text-destructive ${isMobile ? 'h-6 w-6' : ''}`}
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.success("Producto eliminado del carrito");
                      }}
                    >
                      <Trash2 className={isMobile ? 'h-3 w-3' : 'h-5 w-5'} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className={isMobile ? '' : 'lg:col-span-1'}>
            <Card className={`${isMobile ? 'p-4' : 'p-6 sticky top-8'}`}>
              <h2 className={`${isMobile ? 'text-xl mb-4' : 'text-2xl mb-6'} font-bold text-foreground`}>
                Resumen del Pedido
              </h2>

              <div className={`${isMobile ? 'space-y-3 mb-4' : 'space-y-4 mb-6'}`}>
                <div className={`flex justify-between ${isMobile ? 'text-sm' : ''}`}>
                  <span className="text-muted-foreground">Productos ({totalItems})</span>
                  <span className="font-semibold">€{totalPrice.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between ${isMobile ? 'text-sm' : ''}`}>
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-semibold">€3.99</span>
                </div>
                <div className={`border-t ${isMobile ? 'pt-3' : 'pt-4'}`}>
                  <div className={`flex justify-between ${isMobile ? 'text-base' : 'text-lg'}`}>
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">
                      €{(totalPrice + 3.99).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                size={isMobile ? 'default' : 'lg'}
                className={`w-full bg-gradient-to-r from-primary to-secondary ${isMobile ? 'mb-2' : 'mb-3'}`}
                onClick={handleCheckout}
              >
                Proceder al Pago
              </Button>

              <Button
                size={isMobile ? 'sm' : 'lg'}
                variant="outline"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Seguir Comprando
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
