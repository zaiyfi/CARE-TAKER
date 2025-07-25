// components/ImageCropperModal.js
import Cropper from "react-easy-crop";
import { Slider } from "@mui/material";
import { useCallback, useState } from "react";
import { Dialog } from "@mui/material";
import getCroppedImg from "../../utils/cropImage";

const ImageCropperModal = ({ open, imageSrc, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropDone = async () => {
    const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedImageBlob);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <div className="relative w-full h-[400px] bg-black">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={3 / 2}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
        />
      </div>

      <div className="p-4">
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, z) => setZoom(z)}
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={onCropDone}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Crop & Save
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ImageCropperModal;
