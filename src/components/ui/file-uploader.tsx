import * as React from "react"
import { X, Plus, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
    label?: string
    onFileChange?: (files: File[]) => void
    className?: string
    accept?: string
}

interface FileItem {
    id: string
    file: File
    preview?: string
}

const FileUploader: React.FC<FileUploaderProps> = ({
    label,
    onFileChange,
    className,
    accept = "*/*"
}) => {
    const [files, setFiles] = React.useState<FileItem[]>([])
    const [showModal, setShowModal] = React.useState(false)
    const [modalImage, setModalImage] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || [])

        // Filter only image files if accept prop is set to image/*
        const filteredFiles = accept === "image/*"
            ? selectedFiles.filter(file => file.type.startsWith('image/'))
            : selectedFiles

        const newFileItems: FileItem[] = filteredFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
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
        const fileToRemove = files.find(item => item.id === fileId)
        if (fileToRemove?.preview) {
            URL.revokeObjectURL(fileToRemove.preview)
        }

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

    const openModal = (imageSrc: string) => {
        setModalImage(imageSrc)
        setShowModal(true)
        // Disable body scroll completely
        document.body.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.width = '100%'
        document.body.style.top = `-${window.scrollY}px`
    }

    const closeModal = () => {
        setShowModal(false)
        setModalImage(null)
        // Re-enable body scroll and restore position
        const scrollY = document.body.style.top
        document.body.style.overflow = 'unset'
        document.body.style.position = ''
        document.body.style.width = ''
        document.body.style.top = ''
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1)
        }
    }

    // Cleanup object URLs when component unmounts
    React.useEffect(() => {
        return () => {
            files.forEach(fileItem => {
                if (fileItem.preview) {
                    URL.revokeObjectURL(fileItem.preview)
                }
            })
            // Cleanup body styles
            document.body.style.overflow = 'unset'
            document.body.style.position = ''
            document.body.style.width = ''
            document.body.style.top = ''
        }
    }, [files])

    return (
        <div className={cn("w-full", className)}>
            {label && (
                <div className="mb-2">
                    <label className="block text-base font-normal leading-6 tracking-[0.15px] text-gray-400">
                        {label}
                    </label>
                </div>
            )}

            {/* File List */}
            {files.map((fileItem) => (
                <div
                    key={fileItem.id}
                    className="h-[78px] rounded-[18px] bg-border-primary/50 flex items-center px-4 mb-3"
                >
                    {/* File Icon or Image Preview */}
                    <div
                        className="w-[48px] h-[48px] rounded-[8px] bg-brand-primary/13 flex items-center justify-center mr-4 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => fileItem.preview && openModal(fileItem.preview)}
                    >
                        {fileItem.preview ? (
                            <img
                                src={fileItem.preview}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-[8px]"
                            />
                        ) : (
                            getFileIcon(fileItem.file.name)
                        )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                        <div className="font-normal text-white mb-1 truncate">
                            {fileItem.file.name}
                        </div>
                        <div className="text-sm font-normal text-gray-400 truncate">
                            {getFileType(fileItem.file.name)}
                        </div>
                    </div>

                    {/* Remove Button */}
                    <button
                        onClick={() => removeFile(fileItem.id)}
                        className="size-6 flex items-center justify-center text-white hover:bg-gray-700 rounded-full transition-colors duration-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}

            {/* Upload Button */}
            <div className="h-[41px] rounded-[19px] border-border-primary border bg-transparent flex items-center justify-center cursor-pointer transition-colors duration-200">
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                    accept={accept}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full flex items-center justify-center"
                >
                    <Plus className="size-6 text-white rounded-sm" />
                </button>
            </div>

            {/* Image Modal */}
            {showModal && modalImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full">
                        <img
                            src={modalImage}
                            alt="Full size preview"
                            className="w-full h-full object-contain rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={closeModal}
                            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export { FileUploader }