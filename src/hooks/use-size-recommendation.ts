import { useMemo } from 'react';

type Build = 'lean' | 'regular' | 'athletic' | 'big';
type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';

interface SizeRecommendationProps {
  height: number;
  weight: number;
  build: Build;
}

export function useSizeRecommendation({ height, weight, build }: SizeRecommendationProps) {
  const bmi = useMemo(() => {
    // BMI calculation: weight (kg) / (height (m) * height (m))
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }, [height, weight]);

  const recommendedSize = useMemo((): Size => {
    // Base size recommendation on BMI and build adjustments
    let baseSize: Size;
    
    // Basic size based on BMI
    if (bmi < 18.5) {
      baseSize = 'XS';
    } else if (bmi < 20) {
      baseSize = 'S';
    } else if (bmi < 23) {
      baseSize = 'M';
    } else if (bmi < 26) {
      baseSize = 'L';
    } else if (bmi < 30) {
      baseSize = 'XL';
    } else if (bmi < 35) {
      baseSize = 'XXL';
    } else {
      baseSize = '3XL';
    }
    
    // Apply build-specific adjustments
    const sizeOrder: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
    let sizeIndex = sizeOrder.indexOf(baseSize);
    
    switch (build) {
      case 'lean':
        // Lean build may prefer more fitted clothes
        sizeIndex = Math.max(0, sizeIndex - 1);
        break;
      case 'athletic':
        // Athletic builds often need larger sizes for shoulders/chest
        sizeIndex = Math.min(sizeOrder.length - 1, sizeIndex + (bmi < 25 ? 1 : 0));
        break;
      case 'big':
        // Big builds generally need more room
        sizeIndex = Math.min(sizeOrder.length - 1, sizeIndex + 1);
        break;
      // regular build uses the base size
    }
    
    return sizeOrder[sizeIndex];
  }, [bmi, build]);

  // Calculate fit details based on the data
  const fitDetails = useMemo(() => {
    let chest = '';
    let length = '';
    let shoulders = '';
    
    // These are approximations and should be replaced with actual size chart data
    switch (recommendedSize) {
      case 'XS':
        chest = '86-91cm';
        length = '65-67cm';
        shoulders = '41-42cm';
        break;
      case 'S':
        chest = '91-96cm';
        length = '67-69cm';
        shoulders = '42-44cm';
        break;
      case 'M':
        chest = '96-102cm';
        length = '69-71cm';
        shoulders = '44-46cm';
        break;
      case 'L':
        chest = '102-107cm';
        length = '71-73cm';
        shoulders = '46-48cm';
        break;
      case 'XL':
        chest = '107-112cm';
        length = '73-75cm';
        shoulders = '48-50cm';
        break;
      case 'XXL':
        chest = '112-118cm';
        length = '75-78cm';
        shoulders = '50-52cm';
        break;
      case '3XL':
        chest = '118-123cm';
        length = '78-81cm';
        shoulders = '52-54cm';
        break;
    }
    
    return { chest, length, shoulders };
  }, [recommendedSize]);

  return {
    recommendedSize,
    bmi,
    fitDetails
  };
}

export default useSizeRecommendation; 