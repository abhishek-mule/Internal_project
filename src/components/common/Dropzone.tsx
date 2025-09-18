import { useDropzone, DropzoneOptions } from 'react-dropzone';

interface DropzoneProps extends DropzoneOptions {
  children: React.ReactNode;
  className?: string;
}

export const Dropzone = ({ children, className = '', ...props }: DropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...props,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer transition-colors ${
        isDragActive ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'
      } ${className}`}
    >
      <input {...getInputProps()} />
      {children}
    </div>
  );
};
