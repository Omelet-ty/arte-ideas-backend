import { useViewMode } from "@/contexts/ViewModeContext";
import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const { viewMode } = useViewMode();
  
  if (viewMode === 'mobile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center p-4">
        <div className="relative">
          {/* Phone frame */}
          <div className="w-[375px] h-[812px] bg-black rounded-[3rem] p-3 shadow-2xl">
            {/* Phone notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50"></div>
            
            {/* Phone screen */}
            <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden overflow-y-auto relative">
              {children}
            </div>
          </div>
          
          {/* Phone buttons */}
          <div className="absolute right-0 top-28 w-1 h-12 bg-gray-700 rounded-l"></div>
          <div className="absolute right-0 top-44 w-1 h-16 bg-gray-700 rounded-l"></div>
          <div className="absolute left-0 top-32 w-1 h-8 bg-gray-700 rounded-r"></div>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default MobileLayout;
