import { useRef, useState } from "react";

type Props = {
  currentUrl: string | null;
  uploading?: boolean;
  onFile: (file: File) => void;
};

export default function AvatarDropzone({ currentUrl, uploading = false, onFile }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => inputRef.current?.click();

  const handleFiles = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return; // only images
    onFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragActive) setDragActive(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className={`avatar-dropzone ${dragActive ? "drag-active" : ""} ${uploading ? "is-uploading" : ""}`}
      onDragOver={onDragOver}
      onDragEnter={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      role="button"
      aria-label="Upload profile picture"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openFilePicker()}
      onClick={openFilePicker}
    >
      <img
        className="avatar-dropzone__img"
        src={currentUrl ?? "https://placehold.co/160x160?text=👤"}
        alt="Profile avatar"
      />
      <div className="avatar-dropzone__hint">
        {uploading ? "Uploading…" : "Drop image here or click"}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="avatar-dropzone__input"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
