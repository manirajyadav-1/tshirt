import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { Check } from 'lucide-react';

interface ColorOption {
  value: string;
  label: string;
  hexColor: string;
  textColor: string; // For the check icon
}

const TShirtColorPicker: React.FC = () => {
  const { register, watch } = useFormContext();
  const { currentTheme } = useTheme();
  const selectedColor = watch('tshirtColor');

  const colorOptions: ColorOption[] = [
    { value: 'white', label: 'White', hexColor: '#ffffff', textColor: '#000000' },
    { value: 'black', label: 'Black', hexColor: '#000000', textColor: '#ffffff' },
    { value: 'gray', label: 'Gray', hexColor: '#9ca3af', textColor: '#ffffff' },
    { value: 'red', label: 'Red', hexColor: '#ef4444', textColor: '#ffffff' },
    { value: 'blue', label: 'Blue', hexColor: '#3b82f6', textColor: '#ffffff' },
    { value: 'green', label: 'Green', hexColor: '#22c55e', textColor: '#ffffff' },
    { value: 'yellow', label: 'Yellow', hexColor: '#facc15', textColor: '#000000' },
    { value: 'purple', label: 'Purple', hexColor: '#a855f7', textColor: '#ffffff' },
    { value: 'pink', label: 'Pink', hexColor: '#ec4899', textColor: '#ffffff' },
    { value: 'navy', label: 'Navy', hexColor: '#1e3a8a', textColor: '#ffffff' },
    { value: 'dark-green', label: 'Dark Green', hexColor: '#166534', textColor: '#ffffff' },
    { value: 'orange', label: 'Orange', hexColor: '#f97316', textColor: '#ffffff' },
  ];

  const getLabelClass = () => {
    switch (currentTheme) {
      case 'minimal': return 'text-gray-600 font-light';
      case 'vibrant': return 'text-customizer-dark-purple font-medium';
      default: return 'text-gray-700';
    }
  };

  const getContainerClass = () => {
    switch (currentTheme) {
      case 'minimal': return 'bg-white p-0 rounded-none border-0';
      case 'vibrant': return 'bg-white p-4 rounded-xl border border-customizer-purple/30 shadow-sm';
      default: return 'bg-white p-4 rounded-lg border border-gray-200';
    }
  };

  return (
    <div className={`space-y-4 ${getContainerClass()} transition-all duration-300`}>
      <Label className={getLabelClass()}>T-Shirt Color</Label>
      
      <div className="grid grid-cols-6 gap-2">
        {colorOptions.map((color) => (
          <div key={color.value} className="relative">
            <input
              type="radio"
              id={`color-${color.value}`}
              value={color.value}
              className="peer sr-only"
              {...register('tshirtColor')}
            />
            <label
              htmlFor={`color-${color.value}`}
              className="h-10 w-10 rounded-full cursor-pointer border-2 flex items-center justify-center transition-all duration-200"
              style={{
                backgroundColor: color.hexColor,
                borderColor: selectedColor === color.value 
                  ? '#9b87f5' // customizer-purple
                  : '#d1d5db', // gray-300
                boxShadow: selectedColor === color.value 
                  ? '0 0 0 2px #9b87f5, 0 0 0 4px white' 
                  : 'none',
              }}
              title={color.label}
            >
              {selectedColor === color.value && (
                <Check style={{ color: color.textColor }} className="w-4 h-4" />
              )}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TShirtColorPicker; 