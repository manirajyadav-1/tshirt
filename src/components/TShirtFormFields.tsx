import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import SizeRecommendation from './SizeRecommendation';

const TShirtFormFields: React.FC = () => {
  const { register, control, formState: { errors } } = useFormContext();
  const { currentTheme } = useTheme();

  const buildOptions = [
    { value: 'lean', label: 'Lean' },
    { value: 'regular', label: 'Regular' },
    { value: 'athletic', label: 'Athletic' },
    { value: 'big', label: 'Big' },
  ];

  const getThemeClasses = () => {
    switch (currentTheme) {
      case 'minimal':
        return {
          container: 'bg-white p-6 rounded-none border-0',
          label: 'text-gray-600 font-light',
          input: 'border-b border-gray-300 rounded-none focus:border-gray-800 bg-transparent',
          select: 'border-b border-gray-300 rounded-none focus:border-gray-800 bg-transparent',
        };
      case 'vibrant':
        return {
          container: 'bg-customizer-light-purple p-6 rounded-xl border border-customizer-purple/30',
          label: 'text-customizer-dark-purple font-medium',
          input: 'border-2 border-customizer-purple/50 rounded-lg focus:border-customizer-purple bg-white shadow-sm',
          select: 'border-2 border-customizer-purple/50 rounded-lg focus:border-customizer-purple bg-white shadow-sm',
        };
      default:
        return {
          container: 'bg-white p-6 rounded-lg border border-gray-200',
          label: 'text-gray-700',
          input: 'border border-gray-300 rounded-md focus:border-customizer-purple',
          select: 'border border-gray-300 rounded-md focus:border-customizer-purple',
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className={`space-y-6 ${themeClasses.container} transition-all duration-300`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="height" className={themeClasses.label}>Height (cm)</Label>
          <Input
            id="height"
            type="number"
            min="120"
            max="220"
            className={themeClasses.input}
            {...register("height", { 
              required: "Height is required",
              min: { value: 120, message: "Height must be at least 120cm" },
              max: { value: 220, message: "Height must not exceed 220cm" }
            })}
          />
          {errors.height && (
            <p className="text-sm text-red-500">{errors.height.message?.toString()}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weight" className={themeClasses.label}>Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            min="30"
            max="200"
            className={themeClasses.input}
            {...register("weight", { 
              required: "Weight is required",
              min: { value: 30, message: "Weight must be at least 30kg" },
              max: { value: 200, message: "Weight must not exceed 200kg" }
            })}
          />
          {errors.weight && (
            <p className="text-sm text-red-500">{errors.weight.message?.toString()}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="build" className={themeClasses.label}>Build</Label>
        <Controller
          name="build"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className={themeClasses.select}>
                <SelectValue placeholder="Select your build" />
              </SelectTrigger>
              <SelectContent>
                {buildOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.build && (
          <p className="text-sm text-red-500">{errors.build.message?.toString()}</p>
        )}
      </div>

      <SizeRecommendation />
    </div>
  );
};

export default TShirtFormFields;
