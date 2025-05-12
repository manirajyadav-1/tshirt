import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { 
  convertFileToBase64, 
  validateImageFile, 
  resizeImage, 
  applyImageFilter 
} from '@/utils/imageUtils';
import { Upload, Image, SlidersHorizontal, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (imageBase64: string) => void;
  className?: string;
}

type FilterType = 'normal' | 'grayscale' | 'sepia' | 'vintage' | 'bright';

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('normal');

  const processAndUploadImage = useCallback(async (file: File) => {
    try {
      setIsLoading(true);
      
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: 'Invalid file',
          description: validation.message,
          variant: 'destructive',
        });
        return;
      }
      
      // Convert to base64
      const base64 = await convertFileToBase64(file);
      
      // Resize image
      const resized = await resizeImage(base64);
      
      // Store the current image for filtering
      setCurrentImage(resized);
      
      // Apply the selected filter (normal by default)
      const filtered = await applyImageFilter(resized, selectedFilter);
      
      // Send to parent component
      onImageUpload(filtered);
      
      toast({
        title: 'Image uploaded',
        description: 'Your image has been successfully uploaded',
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error processing your image',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [onImageUpload, selectedFilter]);

  const handleFilterChange = async (filter: FilterType) => {
    if (!currentImage) return;
    
    try {
      setIsLoading(true);
      setSelectedFilter(filter);
      
      // Apply new filter to the current image
      const filtered = await applyImageFilter(currentImage, filter);
      
      // Send to parent component
      onImageUpload(filtered);
      
      toast({
        title: 'Filter applied',
        description: `Applied ${filter} filter to your image`,
      });
    } catch (error) {
      console.error('Error applying filter:', error);
      toast({
        title: 'Filter failed',
        description: 'There was an error applying the filter',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setCurrentImage(null);
    onImageUpload('');
    toast({
      title: 'Image removed',
      description: 'The image has been removed from your design',
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        await processAndUploadImage(acceptedFiles[0]);
      }
    },
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 transition-all duration-200 h-[200px]
          ${isDragActive ? 'border-customizer-purple bg-customizer-light-purple/50' : 'border-gray-300 hover:border-customizer-purple'}
          flex flex-col items-center justify-center cursor-pointer bg-white
          ${currentImage ? 'relative' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {currentImage ? (
          <>
            {/* Show the uploaded image in the drop area */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img 
                src={currentImage} 
                alt="Uploaded design" 
                className="max-h-full object-contain rounded"
              />
            </div>
            
            {/* Overlay with instructions */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg text-white text-center p-4">
              <div>
                <p className="font-medium">Click or drag to replace image</p>
              </div>
            </div>
            
            {/* Clear button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4 text-customizer-purple" />
            </button>
          </>
        ) : (
          /* Default drop zone content */
          <div className="flex flex-col items-center justify-center gap-2">
            {isLoading ? (
              <div className="w-12 h-12 border-4 border-customizer-purple border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-customizer-purple mb-2" />
            )}
            <p className="text-center text-sm text-gray-700">
              {isDragActive 
                ? "Drop your image here..." 
                : "Drag & drop your image here, or click to select"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        )}
      </div>
      
      {currentImage && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-customizer-purple" />
            <Label htmlFor="filter" className="text-sm font-medium">Image Filter</Label>
          </div>
          
          <Select 
            value={selectedFilter} 
            onValueChange={(value) => handleFilterChange(value as FilterType)}
          >
            <SelectTrigger className="w-full border-customizer-purple/30">
              <SelectValue placeholder="Select a filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="grayscale">Grayscale</SelectItem>
              <SelectItem value="sepia">Sepia</SelectItem>
              <SelectItem value="vintage">Vintage</SelectItem>
              <SelectItem value="bright">Brighter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="mt-4 flex justify-center">
        <Button 
          onClick={() => document.getElementById('fileInput')?.click()} 
          type="button" 
          variant="outline"
          className="border-customizer-purple text-customizer-purple hover:bg-customizer-light-purple"
        >
          <Image className="w-4 h-4 mr-2" />
          Browse Files
        </Button>
      </div>
    </div>
  );
};

export default ImageUploader;
