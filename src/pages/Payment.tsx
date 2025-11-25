import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrdersContext";
import { CreditCard, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useViewMode } from "@/contexts/ViewModeContext";

const Payment = () => {
  const navigate = useNavigate();
  const { viewMode } = useViewMode();
  const isMobile = viewMode === 'mobile';
  const { items, clearCart, totalPrice } = useCart();
  const { addOrder } = useOrders();
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  // Obtener datos del checkout
  const checkoutData = localStorage.getItem("checkoutData");
  if (!checkoutData || items.length === 0) {
    navigate("/carrito");
    return null;
  }

  const checkout = JSON.parse(checkoutData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    // Formatear número de tarjeta
    if (name === "cardNumber") {
      value = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
      if (value.length > 19) return;
    }

    // Formatear fecha de expiración
    if (name === "expiryDate") {
      value = value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }

    // Limitar CVV
    if (name === "cvv" && value.length > 3) return;

    setCardData({
      ...cardData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardData.cardNumber || !cardData.cardName || !cardData.expiryDate || !cardData.cvv) {
      toast.error("Por favor completa todos los datos de la tarjeta");
      return;
    }

    // Simular procesamiento de pago
    toast.success("Pago procesado exitosamente");
    
    // Calcular fecha estimada de entrega (7-10 días)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);

    // Crear el pedido
    const orderId = addOrder({
      items: [...items],
      customerInfo: {
        fullName: checkout.fullName,
        phone: checkout.phone,
        dni: checkout.dni,
        email: checkout.email,
        address: checkout.address,
        city: checkout.city,
        postalCode: checkout.postalCode,
        notes: checkout.notes,
      },
      deliveryType: checkout.deliveryType,
      subtotal: totalPrice,
      shippingCost: checkout.deliveryType === "delivery" ? 5.0 : 0,
      total: checkout.total,
      status: "processing",
      estimatedDeliveryDate: deliveryDate,
    });

    // Limpiar carrito y datos
    clearCart();
    localStorage.removeItem("checkoutData");

    // Redirigir a la página de confirmación
    setTimeout(() => {
      navigate(`/pedido/${orderId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <Header />

      <div className={`container mx-auto ${isMobile ? 'px-2 py-4' : 'px-4 py-8'}`}>
        <h1 className={`${isMobile ? 'text-2xl mb-4' : 'text-4xl mb-8'} font-bold text-foreground`}>
          Realizar Pago
        </h1>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'lg:grid-cols-3 gap-8'}`}>
          {/* Left Column - Payment Form */}
          <div className={isMobile ? '' : 'lg:col-span-2'}>
            <Card className={`${isMobile ? 'p-4 mb-4' : 'p-6 mb-6'}`}>
              <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-6'}`}>
                <CreditCard className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-primary`} />
                <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-foreground`}>
                  Información de Pago
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder="JUAN PEREZ"
                    value={cardData.cardName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Fecha de Vencimiento</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/AA"
                      value={cardData.expiryDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      type="password"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg mt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Fecha Estimada de Entrega</span>
                  </div>
                  <p className="font-semibold text-foreground">
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    (Aproximadamente 7-10 días hábiles)
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-secondary mt-6"
                >
                  Confirmar Pago - €{checkout.total.toFixed(2)}
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-foreground">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.projectName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.projectName}</p>
                      <p className="text-xs text-muted-foreground">{item.format}</p>
                      <p className="text-sm font-semibold text-primary">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span>
                    {checkout.deliveryType === "delivery" ? "€5.00" : "Gratis"}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span className="text-primary">€{checkout.total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-3 text-foreground">
                Datos de {checkout.deliveryType === "delivery" ? "Envío" : "Recojo"}
              </h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p><strong>Nombre:</strong> {checkout.fullName}</p>
                <p><strong>Teléfono:</strong> {checkout.phone}</p>
                <p><strong>DNI:</strong> {checkout.dni}</p>
                {checkout.deliveryType === "delivery" && (
                  <>
                    <p><strong>Dirección:</strong> {checkout.address}</p>
                    <p><strong>Ciudad:</strong> {checkout.city}</p>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
