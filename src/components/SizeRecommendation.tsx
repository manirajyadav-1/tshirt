import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTheme } from '@/contexts/ThemeContext';
import useSizeRecommendation from '@/hooks/use-size-recommendation';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Ruler, Info } from 'lucide-react';

const SizeRecommendation: React.FC = () => {
  const { watch } = useFormContext();
  const { currentTheme } = useTheme();
  
  const height = watch('height');
  const weight = watch('weight');
  const build = watch('build');
  
  const { recommendedSize, fitDetails } = useSizeRecommendation({
    height,
    weight,
    build
  });

  const getContainerClass = () => {
    switch (currentTheme) {
      case 'minimal':
        return 'border-t border-gray-200 pt-4 mt-4';
      case 'vibrant':
        return 'bg-white/80 p-4 rounded-lg border border-customizer-purple/20 mt-4 shadow-sm';
      default:
        return 'bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4';
    }
  };

  const getSizeClass = () => {
    switch (recommendedSize) {
      case 'XS':
      case 'S':
        return 'text-blue-600 bg-blue-50';
      case 'M':
        return 'text-green-600 bg-green-50';
      case 'L':
        return 'text-amber-600 bg-amber-50';
      case 'XL':
      case 'XXL':
      case '3XL':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={getContainerClass()}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Ruler className="w-4 h-4 text-customizer-purple" />
          <h3 className="text-sm font-medium text-gray-700">Recommended Size</h3>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <button className="text-gray-400 hover:text-gray-600">
              <Info className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">How we calculate your size</h4>
              <p className="text-xs text-gray-500">
                Our recommendation is based on your height, weight, and build. 
                These measurements are used to estimate your body proportions and 
                suggest the best t-shirt size for your comfort.
              </p>
              <div className="pt-2">
                <h5 className="text-xs font-medium">Your Measurements</h5>
                <ul className="text-xs text-gray-500 space-y-1 mt-1">
                  <li>Height: {height} cm</li>
                  <li>Weight: {weight} kg</li>
                  <li>Build: {build.charAt(0).toUpperCase() + build.slice(1)}</li>
                </ul>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSizeClass()}`}>
            {recommendedSize}
          </span>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <div>Chest: <span className="font-medium">{fitDetails.chest}</span></div>
          <div>Length: <span className="font-medium">{fitDetails.length}</span></div>
          <div>Shoulders: <span className="font-medium">{fitDetails.shoulders}</span></div>
        </div>
      </div>
    </div>
  );
};

export default SizeRecommendation; 