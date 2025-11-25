import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/contexts/OrdersContext";
import { Package, Calendar, MapPin, ShoppingBag } from "lucide-react";
import { useViewMode } from "@/contexts/ViewModeContext";

const Orders = () => {
  const navigate = useNavigate();
  const { viewMode } = useViewMode();
  const isMobile = viewMode === 'mobile';
  const { orders } = useOrders();

  const statusColors = {
    processing: "bg-blue-500",
    "in-preparation": "bg-yellow-500",
    ready: "bg-green-500",
    delivered: "bg-gray-500",
  };

  const statusText = {
    processing: "En Procesamiento",
    "in-preparation": "En Preparación",
    ready: "Listo para Recoger",
    delivered: "Entregado",
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4 text-foreground">
              No tienes pedidos aún
            </h1>
            <p className="text-muted-foreground mb-8">
              Cuando realices tu primera compra, tus pedidos aparecerán aquí.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary"
              onClick={() => navigate("/")}
            >
              Empezar a Comprar
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
        <div className="max-w-4xl mx-auto">
          <h1 className={`${isMobile ? 'text-2xl mb-4' : 'text-4xl mb-8'} font-bold text-foreground`}>Mis Pedidos</h1>

          <div className={isMobile ? 'space-y-4' : 'space-y-6'}>
            {orders.map((order) => (
              <Card key={order.id} className={isMobile ? 'p-4' : 'p-6'}>
                <div className={`flex flex-col md:flex-row md:items-center justify-between ${isMobile ? 'mb-3 pb-3' : 'mb-4 pb-4'} border-b`}>
                  <div>
                    <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-foreground ${isMobile ? 'mb-0.5' : 'mb-1'}`}>
                      Pedido {order.orderNumber}
                    </h3>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                      {order.createdAt.toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge className={`${statusColors[order.status]} text-white`}>
                    {statusText[order.status]}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Fecha Estimada</p>
                      <p className="text-sm font-semibold">
                        {order.estimatedDeliveryDate.toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Tipo de Entrega</p>
                      <p className="text-sm font-semibold">
                        {order.deliveryType === "delivery" ? "Envío" : "Recojo"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Productos</p>
                      <p className="text-sm font-semibold">{order.items.length} item(s)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.projectName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.projectName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.format} • {item.paperType}
                        </p>
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

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pagado</p>
                    <p className="text-xl font-bold text-primary">€{order.total.toFixed(2)}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/pedido/${order.id}`)}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
