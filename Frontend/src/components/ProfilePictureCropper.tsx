import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Loader2 } from 'lucide-react';

interface ProfilePictureCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImage: Blob) => Promise<void>;
}

/**
 * Helper function to create an image element from a URL
 */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

/**
 * Helper function to get cropped image as a Blob
 */
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // Set canvas size to the crop size
  const size = Math.max(pixelCrop.width, pixelCrop.height);
  canvas.width = size;
  canvas.height = size;

  // Draw the circular crop
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.clip();

  // Draw the image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size
  );

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, 'image/png');
  });
}

const ProfilePictureCropper: React.FC<ProfilePictureCropperProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropAreaChange = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropImage = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      await onCropComplete(croppedImage);
      onClose();
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 gap-0 bg-gradient-to-br from-[#1a1d29] via-[#242938] to-[#1a1d29] border-gray-700/50 shadow-2xl">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
          <h2 className="text-2xl font-bold text-white mb-1">Adjust Profile Picture</h2>
          <p className="text-sm text-gray-400">
            Drag to reposition • Pinch or scroll to zoom • Circular crop area will be applied
          </p>
        </div>

        {/* Cropper Area with Enhanced Visuals */}
        <div className="relative w-full h-[500px] bg-gradient-to-br from-black via-gray-900 to-black">
          {/* Corner Markers for Visual Reference */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Top Left Corner */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-white/30 rounded-tl-lg"></div>
            {/* Top Right Corner */}
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30 rounded-tr-lg"></div>
            {/* Bottom Left Corner */}
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white/30 rounded-bl-lg"></div>
            {/* Bottom Right Corner */}
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-white/30 rounded-br-lg"></div>
          </div>

          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropAreaChange}
            onZoomChange={setZoom}
            style={{
              containerStyle: {
                backgroundColor: 'transparent',
              },
              cropAreaStyle: {
                border: '4px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65), 0 0 40px rgba(255, 255, 255, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.1)',
              },
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-6 pt-5 space-y-6 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm">
          {/* Zoom Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <ZoomOut className="h-4 w-4 text-gray-400" />
                Zoom Level
              </label>
              <span className="text-sm font-bold text-white bg-gray-700/50 px-3 py-1 rounded-full">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-all"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.05}
                onValueChange={([value]) => setZoom(value)}
                className="flex-1"
              />
              <button
                onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-all"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 h-12 border-2 border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500 font-semibold transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCropImage}
              disabled={isProcessing}
              className="flex-1 h-12 bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-700 hover:via-green-600 hover:to-green-700 text-white font-bold shadow-lg shadow-green-500/20 transition-all hover:shadow-green-500/30 hover:scale-[1.02]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Image...
                </>
              ) : (
                'Set new profile picture'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureCropper;
