import * as React from "react"
import { X, Plus, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface SingleFileUploaderProps {
    label?: string
    onFileChange?: (file: File | null) => void
    className?: string
    accept?: string
}

const SingleFileUploader: React.FC<SingleFileUploaderProps> = ({
    label,
    onFileChange,
    className,
    accept = "image/*"
}) => {
    const [file, setFile] = React.useState<File | null>(null)
    const [imagePreview, setImagePreview] = React.useState<string | null>(null)
    const [showModal, setShowModal] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null
        setFile(selectedFile)
        onFileChange?.(selectedFile)

        // Create image preview
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(selectedFile)
        } else {
            setImagePreview(null)
        }

        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const removeFile = () => {
        setFile(null)
        setImagePreview(null)
        setShowModal(false)
        onFileChange?.(null)
    }

    const openModal = () => {
        if (imagePreview) {
            setShowModal(true)
            // Disable body scroll completely
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
            document.body.style.width = '100%'
            document.body.style.top = `-${window.scrollY}px`
        }
    }

    const closeModal = () => {
        setShowModal(false)
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

    // Cleanup effect to re-enable scroll when component unmounts
    React.useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset'
            document.body.style.position = ''
            document.body.style.width = ''
            document.body.style.top = ''
        }
    }, [])

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

            {/* File Display */}
            {file && (
                <div className="h-[78px] rounded-[18px] bg-border-primary/50 flex items-center px-4 mb-3">
                    {/* Image Preview or File Icon */}
                    <div
                        className="w-[48px] h-[48px] rounded-[8px] bg-brand-primary/13 flex items-center justify-center mr-4 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={openModal}
                    >
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-[8px]"
                            />
                        ) : (
                            getFileIcon(file.name)
                        )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                        <div className="font-normal text-text-primary mb-1 truncate">
                            {file.name}
                        </div>
                        <div className="text-sm font-normal text-text-muted truncate">
                            {getFileType(file.name)}
                        </div>
                    </div>

                    {/* Remove Button */}
                    <button
                        type="button"
                        onClick={removeFile}
                        className="size-6 flex items-center justify-center text-white hover:bg-gray-700 rounded-full transition-colors duration-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Upload Button - Only show if no file is selected */}
            {!file && (
                <div className="h-[41px] rounded-[19px] border-border-primary border bg-transparent flex items-center justify-center cursor-pointer transition-colors duration-200">
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
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
            )}

            {/* Image Modal */}
            {showModal && imagePreview && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full">
                        <img
                            src={imagePreview}
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

export { SingleFileUploader }
