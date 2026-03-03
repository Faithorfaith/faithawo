import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c4cf44c5`;

interface MediaUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
}

export function MediaUpload({ label, value, onChange, accept = "image/*" }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      await new Promise((resolve, reject) => {
        reader.onload = resolve;
        reader.onerror = reject;
      });

      const base64Data = (reader.result as string).split(',')[1];
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      // Upload through server to bypass RLS
      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName,
          fileData: base64Data,
          contentType: file.type
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const { publicUrl } = await response.json();

      setPreview(publicUrl);
      onChange(publicUrl);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm text-[#808080] mb-2">{label}</label>
      
      {preview ? (
        <div className="relative w-full aspect-video bg-[#0f0f0f] border border-[#333] rounded-lg overflow-hidden group">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500/90 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="w-full">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            id={`file-upload-${label}`}
          />
          <label
            htmlFor={`file-upload-${label}`}
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#333] rounded-lg cursor-pointer hover:border-[#e2a336] transition-colors bg-[#0f0f0f]"
          >
            {uploading ? (
              <Loader2 className="w-10 h-10 text-[#e2a336] animate-spin" />
            ) : (
              <>
                <Upload className="w-10 h-10 text-[#808080] mb-2" />
                <p className="text-sm text-[#808080]">Click to upload or drag and drop</p>
                <p className="text-xs text-[#666] mt-1">PNG, JPG, GIF up to 10MB</p>
              </>
            )}
          </label>
        </div>
      )}
      
      <div className="mt-2">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value);
            setPreview(e.target.value);
          }}
          placeholder="Or paste image URL"
          className="w-full bg-[#0f0f0f] border border-[#333] text-[#f5f4f0] px-4 py-2 rounded-lg focus:border-[#e2a336] outline-none text-sm"
        />
      </div>
    </div>
  );
}