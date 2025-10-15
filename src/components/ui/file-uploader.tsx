import * as React from "react"
import { X, Plus, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
    label?: string
    onFileChange?: (files: File[]) => void
    className?: string
}

interface FileItem {
    id: string
    file: File
}

const FileUploader: React.FC<FileUploaderProps> = ({
    label,
    onFileChange,
    className
}) => {
    const [files, setFiles] = React.useState<FileItem[]>([])
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || [])
        const newFileItems: FileItem[] = selectedFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file
        }))

        const updatedFiles = [...files, ...newFileItems]
        setFiles(updatedFiles)
        onFileChange?.(updatedFiles.map(item => item.file))

        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const removeFile = (fileId: string) => {
        const updatedFiles = files.filter(item => item.id !== fileId)
        setFiles(updatedFiles)
        onFileChange?.(updatedFiles.map(item => item.file))
    }

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase()

        switch (extension) {
            case 'pdf':
                return <FileText className="w-6 h-6 text-brand-primary" />
            case 'doc':
            case 'docx':
                return <FileText className="w-6 h-6 text-brand-primary" />
            case 'xls':
            case 'xlsx':
                return <FileText className="w-6 h-6 text-brand-primary" />
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FileText className="w-6 h-6 text-brand-primary" />
            default:
                return <FileText className="w-6 h-6 text-brand-primary" />
        }
    }

    const getFileType = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase()

        switch (extension) {
            case 'pdf':
                return 'PDF Document'
            case 'doc':
            case 'docx':
                return 'Word Document'
            case 'xls':
            case 'xlsx':
                return 'Excel Document'
            case 'jpg':
            case 'jpeg':
                return 'JPEG Image'
            case 'png':
                return 'PNG Image'
            case 'gif':
                return 'GIF Image'
            default:
                return `${extension?.toUpperCase()} File`
        }
    }

    return (
        <div className={cn("w-full", className)}>
            {label && (
                <div className="mb-2">
                    <label className="block text-base font-normal leading-6 tracking-[0.15px] text-text-tertiary">
                        {label}
                    </label>
                </div>
            )}

            {/* File List */}
            {files.map((fileItem) => (
                <div
                    key={fileItem.id}
                    className="h-[78px] rounded-[18px] bg-background-tertiary flex items-center px-4 mb-3"
                >
                    {/* File Icon */}
                    <div className="w-[48px] h-[48px] rounded-[8px] bg-brand-primary/13 flex items-center justify-center mr-4">
                        {getFileIcon(fileItem.file.name)}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                        <div className="font-normal text-text-primary mb-1 truncate">
                            {fileItem.file.name}
                        </div>
                        <div className="text-sm font-normal text-text-muted truncate">
                            {getFileType(fileItem.file.name)}
                        </div>
                    </div>

                    {/* Remove Button */}
                    <button
                        onClick={() => removeFile(fileItem.id)}
                        className="size-6 flex items-center justify-center text-text-primary hover:bg-background-secondary rounded-full transition-colors duration-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}

            {/* Upload Button */}
            <div className="h-[41px] rounded-[19px] bg-background-tertiary flex items-center justify-center cursor-pointer hover:bg-background-tertiary/80 transition-colors duration-200">
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full flex items-center justify-center"
                >
                    <Plus className="size-6 text-text-primary rounded-sm" />
                </button>
            </div>
        </div>
    )
}

export { FileUploader }