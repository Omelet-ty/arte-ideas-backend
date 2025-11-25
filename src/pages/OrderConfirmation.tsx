import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOrders } from "@/contexts/OrdersContext";
import { CheckCircle, Calendar, Package, MapPin } from "lucide-react";
import { useViewMode } from "@/contexts/ViewModeContext";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { viewMode } = useViewMode();
  const isMobile = viewMode === 'mobile';
  const { getOrderById } = useOrders();

  const order = orderId ? getOrderById(orderId) : null;

  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) return null;

  const statusText = {
    processing: "En Procesamiento",
    "in-preparation": "En Preparación",
    ready: "Listo para Recoger",
    delivered: "Entregado",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <Header />

      <div className={`container mx-auto ${isMobile ? 'px-2 py-6' : 'px-4 py-12'}`}>
        <div className="max-w-4xl mx-auto">
          {/* Success Icon */}
          <div className={`text-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
            <div className={`inline-flex items-center justify-center ${isMobile ? 'w-16 h-16' : 'w-20 h-20'} rounded-full bg-gradient-to-br from-primary to-secondary ${isMobile ? 'mb-3' : 'mb-4'}`}>
              <CheckCircle className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-white`} />
            </div>
            <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold text-foreground ${isMobile ? 'mb-1' : 'mb-2'}`}>
              ¡Pedido Confirmado!
            </h1>
            <p className="text-muted-foreground mb-2">Gracias por tu compra</p>
            <p className="text-sm text-muted-foreground">
              Número de pedido: <span className="font-semibold text-primary">{order.orderNumber}</span>
            </p>
          </div>

          {/* Status Cards */}
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3 mb-6' : 'md:grid-cols-3 gap-4 mb-8'}`}>
            <Card className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
              <Calendar className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} mx-auto ${isMobile ? 'mb-2' : 'mb-3'} text-orange-500`} />
              <h3 className={`font-bold text-foreground ${isMobile ? 'mb-0.5 text-sm' : 'mb-1'}`}>Fecha Estimada</h3>
              <p className="text-sm text-muted-foreground">
                {order.estimatedDeliveryDate.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Package className="w-8 h-8 mx-auto mb-3 text-orange-500" />
              <h3 className="font-bold text-foreground mb-1">Estado</h3>
              <p className="text-sm text-muted-foreground">{statusText[order.status]}</p>
            </Card>

            <Card className="p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-orange-500" />
              <h3 className="font-bold text-foreground mb-1">Entrega</h3>
              <p className="text-sm text-muted-foreground">
                {order.deliveryType === "delivery" ? "Envío a Domicilio" : "Recojo en Tienda"}
              </p>
            </Card>
          </div>

          {/* Order Details */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">
              Detalles del Pedido
            </h2>

            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b last:border-0">
                  <img
                    src={item.image}
                    alt={item.projectName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.projectName}</p>
                    <p className="text-xs text-muted-foreground">{item.format}</p>
                    <p className="text-xs text-muted-foreground">Papel: {item.paperType}</p>
                    <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({order.items.length} producto{order.items.length !== 1 ? 's' : ''})
                </span>
                <span className="font-semibold">€{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className="font-semibold">
                  €{order.shippingCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Pagado</span>
                <span className="text-primary">€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* What's Next */}
          <Card className="p-6 mb-8 bg-pink-50 border-pink-200">
            <h3 className="font-bold mb-3 text-foreground">¿Qué sigue?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Recibirás un email de confirmación con los detalles de tu pedido</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Tu pedido será procesado y preparado en las próximas 24-48 horas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Te notificaremos cuando tu pedido esté en camino</span>
              </li>
            </ul>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/")}
            >
              Volver a la Tienda
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary"
              onClick={() => navigate("/mis-pedidos")}
            >
              Ver Mis Pedidos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
