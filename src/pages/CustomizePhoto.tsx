import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingCart, Scissors, Upload, Wand2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useViewMode } from "@/contexts/ViewModeContext";

const cropImage = (
  imageSrc: string,
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number,
  imageElement: HTMLImageElement
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return resolve(imageSrc);

    // Calculate scale factor between displayed image and actual image
    const scaleX = imageElement.naturalWidth / imageElement.width;
    const scaleY = imageElement.naturalHeight / imageElement.height;

    // Set canvas size to crop size
    canvas.width = cropWidth * scaleX;
    canvas.height = cropHeight * scaleY;

    // Draw cropped portion
    ctx.drawImage(
      imageElement,
      cropX * scaleX,
      cropY * scaleY,
      cropWidth * scaleX,
      cropHeight * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    resolve(canvas.toDataURL('image/jpeg', 0.95));
  });
};

const formatOptions = [
  { size: "9x13 cm", price: 0.70, width: 9, height: 13 },
  { size: "10x15 cm", price: 0.75, width: 10, height: 15 },
  { size: "11x15 cm", price: 0.80, width: 11, height: 15 },
  { size: "13x13 cm", price: 0.85, width: 13, height: 13 },
  { size: "13x18 cm", price: 0.90, width: 13, height: 18 },
  { size: "15x15 cm", price: 0.95, width: 15, height: 15 },
  { size: "15x20 cm", price: 1.00, width: 15, height: 20 },
  { size: "20x20 cm", price: 1.20, width: 20, height: 20 },
];

const CustomizePhoto = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { viewMode } = useViewMode();
  const isMobile = viewMode === 'mobile';
  const { addToCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("11x15 cm");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [paperType, setPaperType] = useState("mate");
  const [projectName, setProjectName] = useState("");
  const [cropBox, setCropBox] = useState({ x: 50, y: 50, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Check if returning from photo editor with edited image
  useEffect(() => {
    const state = location.state as any;
    if (state?.editedImage) {
      setCroppedImage(state.editedImage);
      setSelectedFormat(state.selectedFormat);
      setCustomWidth(state.customWidth);
      setCustomHeight(state.customHeight);
      setPaperType(state.paperType);
      setProjectName(state.projectName);
    }
  }, [location.state]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormatChange = (format: string) => {
    setSelectedFormat(format);
    const selected = formatOptions.find(f => f.size === format);
    if (selected) {
      const ratio = selected.width / selected.height;
      setCropBox(prev => ({
        ...prev,
        width: 200,
        height: 200 / ratio,
      }));
    }
  };

  const handleCustomDimensions = () => {
    const width = parseFloat(customWidth);
    const height = parseFloat(customHeight);
    if (width > 0 && height > 0) {
      const ratio = width / height;
      setCropBox(prev => ({
        ...prev,
        width: 200,
        height: 200 / ratio,
      }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cropBox.x,
      y: e.clientY - cropBox.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setCropBox(prev => ({
        ...prev,
        x: Math.max(0, Math.min(e.clientX - dragStart.x, 440 - prev.width)),
        y: Math.max(0, Math.min(e.clientY - dragStart.y, 440 - prev.height)),
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleApplyCrop = async () => {
    if (!uploadedImage || !imageRef.current || !imageContainerRef.current) {
      toast.error("No hay imagen para recortar");
      return;
    }

    try {
      const croppedImageData = await cropImage(
        uploadedImage,
        cropBox.x,
        cropBox.y,
        cropBox.width,
        cropBox.height,
        imageRef.current
      );
      
      setCroppedImage(croppedImageData);
      toast.success("Recorte aplicado correctamente");
    } catch (error) {
      toast.error("Error al recortar la imagen");
      console.error(error);
    }
  };

  const handleAddToCart = () => {
    if (!croppedImage) {
      toast.error("Por favor aplica el recorte primero");
      return;
    }
    if (!projectName.trim()) {
      toast.error("Por favor ingresa un nombre para el proyecto");
      return;
    }

    const format = customWidth && customHeight 
      ? `${customWidth}x${customHeight} cm`
      : selectedFormat;
    
    const price = formatOptions.find(f => f.size === selectedFormat)?.price || 1.50;

    addToCart({
      productId: productId || "",
      productName: "Marco Personalizado",
      image: croppedImage,
      format,
      paperType: paperType === "mate" ? "Mate" : "Brillante",
      projectName,
      price,
    });

    toast.success("Producto agregado al carrito");
    navigate("/carrito");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
          Personaliza tu Foto
        </h1>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left side - Image Upload & Crop */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Subir Foto</h2>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full mb-4"
              >
                Elegir archivo
              </Button>

              {uploadedImage && !croppedImage && (
                <div 
                  ref={imageContainerRef}
                  className="relative w-full aspect-square bg-muted rounded-2xl overflow-hidden"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    ref={imageRef}
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute border-2 border-primary bg-primary/10 cursor-move"
                    style={{
                      left: `${cropBox.x}px`,
                      top: `${cropBox.y}px`,
                      width: `${cropBox.width}px`,
                      height: `${cropBox.height}px`,
                    }}
                    onMouseDown={handleMouseDown}
                  />
                </div>
              )}

              {croppedImage && (
                <div className="w-full aspect-square bg-muted rounded-2xl overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={croppedImage}
                    alt="Cropped"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}

              {uploadedImage && !croppedImage && (
                <Button
                  onClick={handleApplyCrop}
                  className="w-full mt-4 bg-primary"
                >
                  <Scissors className="mr-2 h-4 w-4" />
                  Aplicar Recorte
                </Button>
              )}

              {croppedImage && (
                <>
                  <Button
                    onClick={() => {
                      setCroppedImage(null);
                      toast.info("Puedes hacer un nuevo recorte");
                    }}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    Hacer Nuevo Recorte
                  </Button>
                  
                  <Button
                    onClick={() => {
                      navigate("/editar-foto", {
                        state: {
                          croppedImage,
                          selectedFormat,
                          customWidth,
                          customHeight,
                          paperType,
                          projectName,
                        },
                      });
                    }}
                    className="w-full mt-2 bg-gradient-to-r from-primary to-secondary"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Editar Foto
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right side - Configuration */}
          <div className={isMobile ? 'space-y-3' : 'space-y-6'}>
            {/* Format Selection */}
            <div className={`bg-white ${isMobile ? 'rounded-2xl p-4' : 'rounded-3xl p-6'} shadow-lg`}>
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold ${isMobile ? 'mb-3' : 'mb-4'} text-foreground`}>
                Configuración de Recorte
              </h3>
              
              <Label className="text-base font-semibold mb-3 block">Formatos</Label>
              <RadioGroup value={selectedFormat} onValueChange={handleFormatChange}>
                <div className="space-y-2">
                  {formatOptions.map((option) => (
                    <div key={option.size} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.size} id={option.size} />
                      <Label htmlFor={option.size} className="cursor-pointer">
                        {option.size} - €{option.price.toFixed(2)}
                      </Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="personalizado" id="personalizado" />
                    <Label htmlFor="personalizado" className="cursor-pointer">
                      Personalizado - €1.50
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              {selectedFormat === "personalizado" && (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Ancho (cm)</Label>
                      <Input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        onBlur={handleCustomDimensions}
                        placeholder="Ej: 15"
                      />
                    </div>
                    <div>
                      <Label>Largo (cm)</Label>
                      <Input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        onBlur={handleCustomDimensions}
                        placeholder="Ej: 20"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className={`bg-white ${isMobile ? 'rounded-2xl p-4' : 'rounded-3xl p-6'} shadow-lg`}>
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold ${isMobile ? 'mb-3' : 'mb-4'} text-foreground`}>
                Detalles del Producto
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold mb-2 block">Tipo de Papel</Label>
                  <RadioGroup value={paperType} onValueChange={setPaperType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mate" id="mate" />
                      <Label htmlFor="mate" className="cursor-pointer">Mate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="brillante" id="brillante" />
                      <Label htmlFor="brillante" className="cursor-pointer">Brillante</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Nombre del Proyecto
                  </Label>
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Ej: Vacaciones 2024"
                  />
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              size={isMobile ? 'default' : 'lg'}
              className={`w-full ${isMobile ? 'h-12 text-base' : 'h-14 text-lg'} font-bold bg-gradient-to-r from-primary to-secondary hover:opacity-90`}
            >
              <ShoppingCart className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
              Agregar al Carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizePhoto;
