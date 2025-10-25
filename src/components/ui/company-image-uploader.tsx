import * as React from "react"
import { X, Plus, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { customInstance } from "@/lib/api-client"
import type { ManufacturerCompanyImage } from "@/lib/api"
import { useTranslation } from "react-i18next"

interface CompanyImageFile {
    id: string
    file: File
    uploadedId?: number
    isUploading?: boolean
    uploadError?: string
    preview?: string
}

interface CompanyImageUploaderProps {
    label?: string
    onImageIdsChange?: (imageIds: number[]) => void
    className?: string
    error?: string
}

const CompanyImageUploader: React.FC<CompanyImageUploaderProps> = ({
    label,
    onImageIdsChange,
    className,
    error
}) => {
    const { t } = useTranslation()
    const [images, setImages] = React.useState<CompanyImageFile[]>([])
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Update parent component with image IDs whenever they change
    React.useEffect(() => {
        const uploadedIds = images
            .filter(img => img.uploadedId)
            .map(img => img.uploadedId!)
        onImageIdsChange?.(uploadedIds)
    }, [images, onImageIdsChange])

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || [])

        // Filter only image files
        const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'))

        imageFiles.forEach(file => {
            const newImage: CompanyImageFile = {
                id: Math.random().toString(36).substr(2, 9),
                file,
                preview: URL.createObjectURL(file)
            }

            setImages(prev => [...prev, newImage])

            // Upload immediately
            uploadImage(newImage)
        })

        // Reset input value
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const removeImage = (imageId: string) => {
        const imageToRemove = images.find(img => img.id === imageId)
        if (imageToRemove?.preview) {
            URL.revokeObjectURL(imageToRemove.preview)
        }

        setImages(prev => prev.filter(img => img.id !== imageId))
    }

    const updateImage = (imageId: string, updates: Partial<CompanyImageFile>) => {
        setImages(prev => prev.map(img =>
            img.id === imageId ? { ...img, ...updates } : img
        ))
    }

    const uploadImage = async (image: CompanyImageFile) => {
        // Mark as uploading
        updateImage(image.id, {
            isUploading: true,
            uploadError: undefined
        })

        try {
            // Create FormData for file upload
            const formData = new FormData()
            formData.append('image', image.file)

            // Use customInstance directly with FormData
            const response = await customInstance<ManufacturerCompanyImage>({
                url: '/api/v1/manufacturer/company-image/',
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            // Update image with uploaded ID
            updateImage(image.id, {
                uploadedId: response.id,
                isUploading: false,
                uploadError: undefined
            })
        } catch (error) {
            // Handle error
            updateImage(image.id, {
                isUploading: false,
                uploadError: (error as Error)?.message || 'Upload failed'
            })
            console.error('Company image upload error:', error)
        }
    }

    // Cleanup object URLs when component unmounts
    React.useEffect(() => {
        return () => {
            images.forEach(imageItem => {
                if (imageItem.preview) {
                    URL.revokeObjectURL(imageItem.preview)
                }
            })
        }
    }, [images])

    return (
        <div className={cn("w-full", className)}>
            {label && (
                <div className="mb-2">
                    <label className="block text-base font-normal leading-6 tracking-[0.15px] text-gray-400">
                        {label}
                    </label>
                </div>
            )}

            {/* Image List */}
            {images.map((imageItem) => (
                <div
                    key={imageItem.id}
                    className="h-[78px] rounded-[18px] bg-border-primary/50 flex items-center px-4 mb-3"
                >
                    {/* Image Preview */}
                    <div className="w-[48px] h-[48px] rounded-[8px] bg-brand-primary/13 flex items-center justify-center mr-4 overflow-hidden">
                        {imageItem.preview ? (
                            <img
                                src={imageItem.preview}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-[8px]"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-300 rounded-[8px] flex items-center justify-center">
                                <Upload className="w-6 h-6 text-gray-500" />
                            </div>
                        )}
                    </div>

                    {/* Image Info */}
                    <div className="flex-1 min-w-0">
                        <div className="font-normal text-white mb-1 truncate">
                            {imageItem.file.name}
                        </div>
                        <div className="text-sm font-normal text-gray-400 truncate">
                            {imageItem.isUploading && (
                                <span className="flex items-center">
                                    <Upload className="w-4 h-4 mr-1 animate-spin" />
                                    {t('app.buyurtmachi.registerForm.companyImages.uploading')}
                                </span>
                            )}
                            {imageItem.uploadedId && !imageItem.isUploading && (
                                <span className="flex items-center text-green-400">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    {t('app.buyurtmachi.registerForm.companyImages.uploaded')}
                                </span>
                            )}
                            {imageItem.uploadError && (
                                <span className="flex items-center text-red-400">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {imageItem.uploadError}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Remove Button */}
                    <button
                        onClick={() => removeImage(imageItem.id)}
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
                    accept="image/*"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full flex items-center justify-center"
                >
                    <Plus className="size-6 text-white rounded-sm" />
                </button>
            </div>

            {error && (
                <p className="text-red-500 text-sm mt-1">
                    {error}
                </p>
            )}
        </div>
    )
}

export { CompanyImageUploader }
