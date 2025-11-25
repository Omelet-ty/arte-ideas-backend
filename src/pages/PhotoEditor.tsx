import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Save, RotateCw, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface PhotoEditorState {
  croppedImage: string;
  selectedFormat: string;
  customWidth: string;
  customHeight: string;
  paperType: string;
  projectName: string;
}

const filters = [
  { name: "Normal", filter: "none" },
  { name: "B&N", filter: "grayscale(100%)" },
  { name: "Sepia", filter: "sepia(100%)" },
  { name: "Vintage", filter: "sepia(50%) contrast(85%) brightness(95%)" },
  { name: "Frío", filter: "brightness(110%) contrast(90%) saturate(110%) hue-rotate(180deg)" },
];

const PhotoEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PhotoEditorState;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [selectedFilter, setSelectedFilter] = useState("Normal");
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [rotation, setRotation] = useState([0]);
  const [blur, setBlur] = useState([0]);

  useEffect(() => {
    if (!state?.croppedImage) {
      toast.error("No hay imagen para editar");
      navigate(-1);
    }
  }, [state, navigate]);

  const applyFilters = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply rotation
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation[0] * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Build filter string
    const filterValue = filters.find((f) => f.name === selectedFilter)?.filter || "none";
    const customFilters = `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%) blur(${blur[0]}px)`;
    const finalFilter = filterValue === "none" ? customFilters : `${filterValue} ${customFilters}`;

    ctx.filter = finalFilter;

    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.restore();
  };

  useEffect(() => {
    if (imageRef.current?.complete) {
      applyFilters();
    }
  }, [selectedFilter, brightness, contrast, saturation, rotation, blur]);

  const handleImageLoad = () => {
    applyFilters();
  };

  const handleSaveChanges = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const editedImage = canvas.toDataURL("image/jpeg", 0.95);
    
    toast.success("Cambios guardados correctamente");
    
    // Navigate back with updated image
    navigate(`/personalizar/${state.selectedFormat.replace(/\s/g, '-')}`, {
      state: {
        editedImage,
        selectedFormat: state.selectedFormat,
        customWidth: state.customWidth,
        customHeight: state.customHeight,
        paperType: state.paperType,
        projectName: state.projectName,
      },
    });
  };

  const resetFilters = () => {
    setSelectedFilter("Normal");
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setRotation([0]);
    setBlur([0]);
    toast.info("Filtros restablecidos");
  };

  if (!state?.croppedImage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
          Editar Foto
        </h1>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left side - Preview */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Vista Previa
            </h2>
            
            <div className="relative w-full aspect-square bg-muted rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                ref={imageRef}
                src={state.croppedImage}
                alt="Original"
                className="hidden"
                onLoad={handleImageLoad}
                crossOrigin="anonymous"
              />
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={handleSaveChanges} className="flex-1 bg-primary">
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
              <Button onClick={resetFilters} variant="outline">
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-foreground">Filtros</h3>
              <div className="grid grid-cols-5 gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.name}
                    onClick={() => setSelectedFilter(filter.name)}
                    className={`aspect-square rounded-xl border-2 transition-all ${
                      selectedFilter === filter.name
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-2">
                      <div
                        className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary mb-1"
                        style={{ filter: filter.filter }}
                      />
                      <span className="text-xs font-medium">{filter.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Brightness */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <Label className="text-base font-semibold mb-3 block">
                Brillo: {brightness[0]}%
              </Label>
              <Slider
                value={brightness}
                onValueChange={setBrightness}
                min={0}
                max={200}
                step={1}
                className="mb-4"
              />
            </div>

            {/* Contrast */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <Label className="text-base font-semibold mb-3 block">
                Contraste: {contrast[0]}%
              </Label>
              <Slider
                value={contrast}
                onValueChange={setContrast}
                min={0}
                max={200}
                step={1}
                className="mb-4"
              />
            </div>

            {/* Saturation */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <Label className="text-base font-semibold mb-3 block">
                Saturación: {saturation[0]}%
              </Label>
              <Slider
                value={saturation}
                onValueChange={setSaturation}
                min={0}
                max={200}
                step={1}
                className="mb-4"
              />
            </div>

            {/* Rotation */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <Label className="text-base font-semibold mb-3 block">
                Rotación: {rotation[0]}°
              </Label>
              <Slider
                value={rotation}
                onValueChange={setRotation}
                min={-180}
                max={180}
                step={1}
                className="mb-4"
              />
            </div>

            {/* Blur */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <Label className="text-base font-semibold mb-3 block">
                Desenfoque: {blur[0]}px
              </Label>
              <Slider
                value={blur}
                onValueChange={setBlur}
                min={0}
                max={10}
                step={0.1}
                className="mb-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;
