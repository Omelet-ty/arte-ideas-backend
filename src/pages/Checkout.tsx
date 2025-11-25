import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useViewMode } from "@/contexts/ViewModeContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { viewMode } = useViewMode();
  const isMobile = viewMode === 'mobile';
  const { items, totalPrice } = useCart();
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dni: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const shippingCost = deliveryType === "delivery" ? 5.0 : 0;
  const total = totalPrice + shippingCost;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!formData.fullName || !formData.phone || !formData.dni) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    if (deliveryType === "delivery" && (!formData.address || !formData.city)) {
      toast.error("Por favor completa la dirección de envío");
      return;
    }

    // Guardar datos en localStorage para la página de pago
    localStorage.setItem("checkoutData", JSON.stringify({
      ...formData,
      deliveryType,
      total,
    }));

    navigate("/pago");
  };

  if (items.length === 0) {
    navigate("/carrito");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <Header />

      <div className={`container mx-auto ${isMobile ? 'px-2 py-4' : 'px-4 py-8'}`}>
        <h1 className={`${isMobile ? 'text-2xl mb-4' : 'text-4xl mb-8'} font-bold text-foreground`}>
          Finalizar Compra
        </h1>

        <form onSubmit={handleSubmit}>
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'lg:grid-cols-3 gap-8'}`}>
            {/* Left Column - Forms */}
            <div className={`${isMobile ? 'space-y-4' : 'lg:col-span-2 space-y-6'}`}>
              {/* Delivery Type */}
              <Card className={isMobile ? 'p-4' : 'p-6'}>
                <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold ${isMobile ? 'mb-3' : 'mb-4'} text-foreground`}>
                  Tipo de Entrega
                </h2>
                <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="cursor-pointer">
                      Envío a Domicilio (€5.00)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="cursor-pointer">
                      Recojo en Tienda (Gratis)
                    </Label>
                  </div>
                </RadioGroup>

                {deliveryType === "pickup" && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold mb-2 text-foreground">Dirección de la Tienda</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>ArteIDEAS</strong>
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      Calle Principal 123, Local 5
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      28001 Madrid, España
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Horario: Lunes a Viernes 9:00 - 18:00
                    </p>
                  </div>
                )}
              </Card>

              {/* Personal Information */}
              <Card className={isMobile ? 'p-4' : 'p-6'}>
                <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold ${isMobile ? 'mb-3' : 'mb-4'} text-foreground`}>
                  Información Personal
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">
                      Nombre Completo <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      Teléfono/Celular <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dni">
                      DNI <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="dni"
                      name="dni"
                      value={formData.dni}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              {deliveryType === "delivery" && (
                <Card className={isMobile ? 'p-4' : 'p-6'}>
                  <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold ${isMobile ? 'mb-3' : 'mb-4'} text-foreground`}>
                    Dirección de Envío
                  </h2>
                  <div className={isMobile ? 'space-y-3' : 'space-y-4'}>
                    <div>
                      <Label htmlFor="address">
                        Dirección <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required={deliveryType === "delivery"}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">
                          Ciudad <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required={deliveryType === "delivery"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Código Postal</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notas de Entrega (opcional)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Referencias adicionales..."
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Summary */}
            <div className={isMobile ? '' : 'lg:col-span-1'}>
              <Card className={`${isMobile ? 'p-4' : 'p-6 sticky top-8'}`}>
                <h2 className={`${isMobile ? 'text-xl mb-4' : 'text-2xl mb-6'} font-bold text-foreground`}>
                  Resumen
                </h2>

                <div className={`${isMobile ? 'space-y-3 mb-4' : 'space-y-4 mb-6'}`}>
                  <div className={`flex justify-between ${isMobile ? 'text-sm' : ''}`}>
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">€{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between ${isMobile ? 'text-sm' : ''}`}>
                    <span className="text-muted-foreground">Envío</span>
                    <span className="font-semibold">
                      {deliveryType === "delivery" ? `€${shippingCost.toFixed(2)}` : "Gratis"}
                    </span>
                  </div>
                  <div className={`border-t ${isMobile ? 'pt-3' : 'pt-4'}`}>
                    <div className={`flex justify-between ${isMobile ? 'text-base' : 'text-lg'}`}>
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary">
                        €{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size={isMobile ? 'default' : 'lg'}
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                >
                  Continuar al Pago
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
