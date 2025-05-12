import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import TShirtFormFields from './TShirtFormFields';
import TShirtPreview from './TShirtPreview';
import ImageUploader from './ImageUploader';
import ThemeSwitcher from './ThemeSwitcher';
import TShirtColorPicker from './TShirtColorPicker';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  height: z.coerce.number().min(120, "Height must be at least 120cm").max(220, "Height must not exceed 220cm"),
  weight: z.coerce.number().min(30, "Weight must be at least 30kg").max(200, "Weight must not exceed 200kg"),
  build: z.enum(['lean', 'regular', 'athletic', 'big']),
  customText: z.string().refine(text => {
    const lines = text.split('\n');
    return lines.length <= 3;
  }, { message: "Maximum 3 lines allowed" }),
  tshirtColor: z.string().default('white'),
});

type FormValues = z.infer<typeof formSchema>;

const TShirtCustomizer: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { currentTheme } = useTheme();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: 180,
      weight: 80,
      build: 'athletic',
      customText: '',
      tshirtColor: 'white',
    }
  });
  
  const { watch, handleSubmit, reset } = methods;
  const customText = watch('customText');
  const tshirtColor = watch('tshirtColor');

  const onSubmit = (data: FormValues) => {
    toast({
      title: 'T-Shirt Design Submitted!',
      description: 'Your customized t-shirt design has been saved.',
    });
    console.log('Form data:', data, 'Image:', uploadedImage);
  };

  const handleImageUpload = (imageBase64: string) => {
    setUploadedImage(imageBase64);
  };

  const resetForm = () => {
    reset();
    setUploadedImage(null);
    toast({
      title: 'Form Reset',
      description: 'All customizations have been cleared.',
    });
  };

  // Get container classes based on the current theme
  const getContainerClasses = () => {
    switch (currentTheme) {
      case 'minimal':
        return 'bg-gray-50 shadow-none';
      case 'vibrant':
        return 'bg-gradient-to-br from-white to-customizer-light-purple shadow-lg';
      default:
        return 'bg-white shadow';
    }
  };

  return (
    <FormProvider {...methods}>
      <div className={`max-w-5xl mx-auto p-4 md:p-8 rounded-xl transition-all duration-300 ${getContainerClasses()}`}>
        <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${currentTheme === 'vibrant' ? 'text-customizer-purple' : 'text-gray-800'}`}>
          T-Shirt Customizer
        </h1>
        <p className={`mb-6 ${currentTheme === 'minimal' ? 'text-gray-500' : 'text-gray-600'}`}>
          Personalize your t-shirt with custom text, images, and colors
        </p>
        
        <ThemeSwitcher />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left side - Form & Image Upload */}
          <div className="md:col-span-7 space-y-8">
            <TShirtFormFields />
            
            <TShirtColorPicker />
            
            <div className={`p-6 ${currentTheme === 'minimal' ? 'bg-white' : currentTheme === 'vibrant' ? 'bg-customizer-light-purple border border-customizer-purple/30 rounded-xl' : 'bg-white border border-gray-200 rounded-lg'}`}>
              <h3 className={`text-lg font-medium mb-4 ${currentTheme === 'vibrant' ? 'text-customizer-dark-purple' : 'text-gray-700'}`}>
                Upload Your Design
              </h3>
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>
            
            <div className="flex space-x-4">
              <Button 
                onClick={handleSubmit(onSubmit)} 
                className={currentTheme === 'vibrant' ? 'bg-customizer-purple hover:bg-customizer-dark-purple transition-all' : ''}
              >
                Save Design
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
              >
                Reset
              </Button>
            </div>
          </div>
          
          {/* Right side - Preview */}
          <div className="md:col-span-5">
            <div className={`p-6 ${currentTheme === 'minimal' ? 'bg-gray-100' : currentTheme === 'vibrant' ? 'bg-white/80 shadow-lg rounded-xl border border-customizer-purple/20' : 'bg-gray-50 rounded-lg border border-gray-200'}`}>
              <h3 className={`text-lg font-medium mb-4 ${currentTheme === 'vibrant' ? 'text-customizer-dark-purple' : 'text-gray-700'}`}>
                Preview
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Click on the text area on the t-shirt to add your custom text (max 3 lines)
              </p>
              <TShirtPreview 
                imageUrl={uploadedImage} 
                customText={customText}
                tshirtColor={tshirtColor}
              />
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default TShirtCustomizer;
