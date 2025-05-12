import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Download, Type } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface TShirtPreviewProps {
  imageUrl: string | null;
  customText: string;
  tshirtColor: string;
}

// Map for color values
const colorMap: Record<string, string> = {
  white: '#ffffff',
  black: '#000000',
  gray: '#9ca3af',
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#facc15',
  purple: '#a855f7',
  pink: '#ec4899',
  navy: '#1e3a8a',
  'dark-green': '#166534',
  orange: '#f97316'
};

// Text color options
const textColorOptions = [
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Yellow', value: '#facc15' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Orange', value: '#f97316' },
];

// Constants for text limits
const MAX_LINES = 3;
const MAX_CHARS_PER_LINE = 20;

const TShirtPreview: React.FC<TShirtPreviewProps> = ({ imageUrl, customText, tshirtColor }) => {
  const { currentTheme } = useTheme();
  const { register, watch, setValue } = useFormContext();
  const tshirtRef = useRef<HTMLDivElement>(null);
  const designRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textColor, setTextColor] = useState('#ffffff'); // Default white text
  
  // Watch for text changes
  const currentText = watch("customText");

  // Process text to enforce line and character limits
  const processedText = currentText ? 
    currentText.split('\n')
      .slice(0, MAX_LINES)
      .map(line => line.slice(0, MAX_CHARS_PER_LINE))
      .join('\n') 
    : '';

  // Update form value if text was truncated
  useEffect(() => {
    if (currentText && currentText !== processedText) {
      setValue("customText", processedText);
    }
  }, [currentText, processedText, setValue]);

  const getTShirtStyle = () => {
    // Base styles
    const baseStyle: React.CSSProperties = {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#d1d5db', // gray-300
      borderRadius: '0.5rem',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    };
    
    // Add background color from the colorMap
    if (tshirtColor && colorMap[tshirtColor]) {
      baseStyle.backgroundColor = colorMap[tshirtColor];
    } else {
      // Fallback to theme-based colors
      switch (currentTheme) {
        case 'minimal':
          baseStyle.backgroundColor = '#ffffff'; // white
          break;
        case 'vibrant':
          baseStyle.backgroundColor = '#E5DEFF'; // customizer-light-purple
          baseStyle.borderColor = '#9b87f5'; // customizer-purple
          baseStyle.borderWidth = '2px';
          break;
        default:
          baseStyle.backgroundColor = '#ffffff'; // white
          break;
      }
    }
    
    return baseStyle;
  };

  const getCollarStyle = () => {
    // Collar color based on t-shirt color
    return {
      backgroundColor: tshirtColor === 'white' ? '#e5e7eb' : '#d1d5db', // gray-200 or gray-300
      borderWidth: '1px', 
      borderStyle: 'solid',
      borderColor: '#d1d5db', // gray-300
      width: '50%',
      height: '60%',
      borderBottomLeftRadius: '0.75rem',
      borderBottomRightRadius: '0.75rem',
    };
  };

  const getTextStyle = () => {
    return {
      color: textColor,
      textShadow: textColor === '#ffffff' ? '1px 1px 3px rgba(0, 0, 0, 0.5)' : 'none',
      fontWeight: 500,
      textAlign: 'center' as const,
      width: '100%',
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 10,
      padding: '10px',
      whiteSpace: 'pre-line' as const,
      fontSize: '18px',
      lineHeight: 1.4,
      maxWidth: '90%',
    };
  };

  const handleSaveImage = async () => {
    if (!designRef.current) return;
    
    try {
      // Show loading toast
      toast({
        title: "Capturing design...",
        description: "Please wait while we generate your image.",
      });
      
      // Capture only the design area (image + text)
      const canvas = await html2canvas(designRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
        allowTaint: true,
        useCORS: true
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `tshirt-design-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success toast
      toast({
        title: "Design saved!",
        description: "Your t-shirt design has been saved as an image.",
      });
    } catch (error) {
      console.error('Error saving image:', error);
      toast({
        title: "Error saving image",
        description: "There was a problem generating your design image.",
        variant: "destructive"
      });
    }
  };

  // Handle text input with line and character limits
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const lines = text.split('\n');
    
    // Limit to MAX_LINES and MAX_CHARS_PER_LINE
    const limitedLines = lines.slice(0, MAX_LINES).map(line => 
      line.slice(0, MAX_CHARS_PER_LINE)
    );
    
    const limitedText = limitedLines.join('\n');
    
    // Update the form value
    setValue("customText", limitedText);
  };

  return (
    <div className="space-y-4">
      {/* T-shirt Preview */}
      <div className="w-full h-[500px] relative">
        <div 
          ref={tshirtRef}
          style={getTShirtStyle()}
          className="rounded-lg overflow-hidden"
        >
          {/* T-shirt collar */}
          <div className="h-[10%] flex justify-center pt-2">
            <div style={getCollarStyle()}></div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            {/* Design area - contains both image and text overlay */}
            <div 
              ref={designRef} 
              className="relative w-full max-w-[400px] h-[300px] flex items-center justify-center"
            >
              {/* Image */}
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  alt="Custom design" 
                  className="max-w-full max-h-full object-contain"
                  crossOrigin="anonymous"
                  style={{
                    filter: tshirtColor === 'white' ? 'none' : 'drop-shadow(0 0 8px rgba(255,255,255,0.2))'
                  }}
                />
              )}
              
              {/* Text overlay */}
              {processedText && (
                <div style={getTextStyle()}>
                  {processedText}
                </div>
              )}
            </div>
            
            {/* Text input - hidden from view but still functional */}
            <div className="w-full max-w-[280px] hidden">
              <textarea
                {...register("customText")}
                placeholder="Type your text here"
              />
            </div>
            
            {/* Text input instructions */}
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Type in the field below to add text to your design</p>
              <p className="text-xs mt-1 mb-2">
                (Maximum 3 lines, 20 characters per line)
              </p>
              <textarea
                ref={textareaRef}
                value={currentText || ''}
                onChange={handleTextChange}
                placeholder="Type your text here"
                rows={3}
                className="mt-2 w-full max-w-[280px] mx-auto border border-gray-300 rounded-md p-2 focus:border-customizer-purple focus:ring-1 focus:ring-customizer-purple font-mono"
              />
              <div className="flex justify-between text-xs mt-1 text-gray-400 max-w-[280px] mx-auto px-1">
                <span>{processedText.split('\n').length}/{MAX_LINES} lines</span>
                <span>
                  {processedText.split('\n').length > 0 
                    ? `Line ${processedText.split('\n').length}: ${
                        processedText.split('\n')[processedText.split('\n').length - 1].length
                      }/${MAX_CHARS_PER_LINE}`
                    : '0/20 chars'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Text color selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              size="sm"
            >
              <Type className="w-4 h-4" />
              <span>Text Color</span>
              <div 
                className="w-4 h-4 rounded-full border border-gray-300" 
                style={{ backgroundColor: textColor }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Select Text Color</h4>
              <div className="grid grid-cols-5 gap-2">
                {textColorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setTextColor(color.value)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      textColor === color.value ? 'border-customizer-purple ring-2 ring-customizer-purple ring-offset-2' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Download button */}
        <Button 
          variant="outline"
          className="border-customizer-purple text-customizer-purple hover:bg-customizer-light-purple"
          onClick={handleSaveImage}
        >
          <Download className="w-4 h-4 mr-2" />
          Save Design
        </Button>
      </div>
    </div>
  );
};

export default TShirtPreview;
