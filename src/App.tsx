import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { OrdersProvider } from "@/contexts/OrdersContext";
import MobileLayout from "@/components/MobileLayout";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import CustomizePhoto from "./pages/CustomizePhoto";
import PhotoEditor from "./pages/PhotoEditor";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <OrdersProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MobileLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/producto/:productId" element={<ProductDetail />} />
                <Route path="/personalizar/:productId" element={<CustomizePhoto />} />
                <Route path="/editar-foto" element={<PhotoEditor />} />
                <Route path="/carrito" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/pago" element={<Payment />} />
                <Route path="/mis-pedidos" element={<Orders />} />
                <Route path="/pedido/:orderId" element={<OrderConfirmation />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MobileLayout>
          </BrowserRouter>
        </CartProvider>
      </OrdersProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
