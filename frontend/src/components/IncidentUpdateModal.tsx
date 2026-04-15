import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, X } from "lucide-react";
import { postUpdate } from "@/services/api";

interface IncidentUpdateModalProps {
  reportId: number;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function IncidentUpdateModal({ reportId, isOpen, onClose, onComplete }: IncidentUpdateModalProps) {
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("Image too large (max 5MB)");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await postUpdate(reportId, notes, image || undefined);
      onComplete();
    } catch (error) {
      console.error("Failed to post update", error);
      alert("Failed to submit update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">On-Scene Update</DialogTitle>
          <DialogDescription>
            Help responders by adding a quick photo or note of the situation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Quick Note</label>
            <Textarea 
              placeholder="e.g., Two cars involved, fire visible..." 
              maxLength={200}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none h-24"
            />
            <p className="text-[10px] text-gray-500 text-right">{notes.length}/200</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Photo Evidence</label>
            {!preview ? (
              <div 
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-medium">Click to upload photo</p>
                <p className="text-[10px] text-gray-400">Max size 5MB</p>
                <input 
                  id="image-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
                <button 
                  onClick={() => { setImage(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="ghost" className="flex-1" onClick={onClose} disabled={loading}>
            Skip
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Submit Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
