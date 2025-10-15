import * as React from "react"
import { X, Plus, FileText, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { customInstance } from "@/lib/api-client"
import type { ManufacturerCertificate } from "@/lib/api"
import { useTranslation } from "react-i18next"
import { DatePicker } from "@/components/ui/date-picker"

interface CertificateFile {
    id: string
    file: File
    receivedDate?: Date
    expirationDate?: Date
    uploadedId?: number
    isUploading?: boolean
    uploadError?: string
}

interface CertificateUploaderProps {
    label?: string
    onCertificateIdsChange?: (certificateIds: number[]) => void
    className?: string
    error?: string
}

const CertificateUploader: React.FC<CertificateUploaderProps> = ({
    label,
    onCertificateIdsChange,
    className,
    error
}) => {
    const { t } = useTranslation()
    const [certificates, setCertificates] = React.useState<CertificateFile[]>([])
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Update parent component with certificate IDs whenever they change
    React.useEffect(() => {
        const uploadedIds = certificates
            .filter(cert => cert.uploadedId)
            .map(cert => cert.uploadedId!)
        onCertificateIdsChange?.(uploadedIds)
    }, [certificates, onCertificateIdsChange])

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || [])

        selectedFiles.forEach(file => {
            const newCertificate: CertificateFile = {
                id: Math.random().toString(36).substr(2, 9),
                file,
                receivedDate: undefined,
                expirationDate: undefined
            }

            setCertificates(prev => [...prev, newCertificate])
        })

        // Reset input value
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const removeCertificate = (certificateId: string) => {
        setCertificates(prev => prev.filter(cert => cert.id !== certificateId))
    }

    const updateCertificate = (certificateId: string, updates: Partial<CertificateFile>) => {
        setCertificates(prev => prev.map(cert =>
            cert.id === certificateId ? { ...cert, ...updates } : cert
        ))
    }

    const uploadCertificate = async (certificate: CertificateFile) => {
        if (!certificate.receivedDate) {
            updateCertificate(certificate.id, {
                uploadError: t('app.buyurtmachi.registerForm.certificates.fillRequiredFields')
            })
            return
        }

        // Mark as uploading
        updateCertificate(certificate.id, {
            isUploading: true,
            uploadError: undefined
        })

        try {
            // Create FormData for file upload
            const formData = new FormData()
            formData.append('certificate', certificate.file)
            formData.append('certificate_received_date', certificate.receivedDate.toISOString().split('T')[0])
            if (certificate.expirationDate) {
                formData.append('certificate_expiration_date', certificate.expirationDate.toISOString().split('T')[0])
            }

            // Use customInstance directly with FormData
            const response = await customInstance<ManufacturerCertificate>({
                url: '/api/v1/manufacturer/certificate/',
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            // Update certificate with uploaded ID
            updateCertificate(certificate.id, {
                uploadedId: response.id,
                isUploading: false,
                uploadError: undefined
            })
        } catch (error) {
            // Handle error
            updateCertificate(certificate.id, {
                isUploading: false,
                uploadError: (error as Error)?.message || t('app.buyurtmachi.registerForm.certificates.uploadFailed')
            })
            console.error('Certificate upload error:', error)
        }
    }

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase()

        switch (extension) {
            case 'pdf':
                return <FileText className="w-6 h-6 text-status-warning" />
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <FileText className="w-6 h-6 text-status-info" />
            default:
                return <FileText className="w-6 h-6 text-text-secondary" />
        }
    }

    const getCertificateStatus = (certificate: CertificateFile) => {
        if (certificate.isUploading) {
            return <Upload className="w-5 h-5 text-status-info animate-pulse" />
        }
        if (certificate.uploadedId) {
            return <CheckCircle className="w-5 h-5 text-status-success" />
        }
        if (certificate.uploadError) {
            return <AlertCircle className="w-5 h-5 text-status-error" />
        }
        return null
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

            {error && (
                <div className="mb-2 text-status-error text-sm">
                    {error}
                </div>
            )}

            {/* Certificate List */}
            {certificates.map((certificate) => (
                <div
                    key={certificate.id}
                    className="rounded-[18px] bg-background-tertiary p-4 mb-3 space-y-3"
                >
                    {/* File Info Header */}
                    <div className="flex items-center">
                        <div className="w-[48px] h-[48px] rounded-[8px] bg-brand-primary/13 flex items-center justify-center mr-4">
                            {getFileIcon(certificate.file.name)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="font-normal text-white mb-1 truncate">
                                {certificate.file.name}
                            </div>
                            <div className="text-sm font-normal text-text-secondary truncate">
                                {(certificate.file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {getCertificateStatus(certificate)}
                            <button
                                type="button"
                                onClick={() => removeCertificate(certificate.id)}
                                className="size-6 flex items-center justify-center text-white hover:bg-gray-700 rounded-full transition-colors duration-200"
                                disabled={certificate.isUploading}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Certificate Details Form */}
                    <div className="space-y-4">
                        {/* Received Date */}
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">
                                {t('app.buyurtmachi.registerForm.certificates.receivedDate')} *
                            </label>
                            <DatePicker
                                value={certificate.receivedDate}
                                onChange={(date) => updateCertificate(certificate.id, { receivedDate: date })}
                                placeholder={t('app.buyurtmachi.registerForm.certificates.receivedDate')}
                                disabled={certificate.isUploading || !!certificate.uploadedId}
                                fromYear={1990}
                                toYear={new Date().getFullYear()}
                                disabledDates={(date) => date > new Date()}
                            />
                        </div>

                        {/* Expiration Date */}
                        <div>
                            <label className="block text-sm text-text-secondary mb-1">
                                {t('app.buyurtmachi.registerForm.certificates.expirationDateOptional')}
                            </label>
                            <DatePicker
                                value={certificate.expirationDate}
                                onChange={(date) => updateCertificate(certificate.id, { expirationDate: date })}
                                placeholder={t('app.buyurtmachi.registerForm.certificates.expirationDate')}
                                disabled={certificate.isUploading || !!certificate.uploadedId}
                                fromYear={1990}
                                toYear={2100}
                            />
                        </div>

                        {/* Upload Error */}
                        {certificate.uploadError && (
                            <div className="text-status-error text-sm">
                                {certificate.uploadError}
                            </div>
                        )}

                        {/* Upload Button */}
                        {!certificate.uploadedId && (
                            <button
                                type="button"
                                onClick={() => uploadCertificate(certificate)}
                                disabled={certificate.isUploading || !certificate.receivedDate}
                                className="w-full px-4 min-h-12 py-2 bg-yellow-400 text-black rounded-xl font-medium hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {certificate.isUploading
                                    ? t('app.buyurtmachi.registerForm.certificates.uploading')
                                    : t('app.buyurtmachi.registerForm.certificates.uploadCertificate')
                                }
                            </button>
                        )}

                        {/* Upload Success Message */}
                        {certificate.uploadedId && (
                            <div className="text-status-success text-sm flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {t('app.buyurtmachi.registerForm.certificates.uploaded')}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Add Certificate Button */}
            <div className="h-[41px] rounded-[19px] bg-background-tertiary flex items-center justify-center cursor-pointer hover:bg-background-tertiary/80 transition-colors duration-200">
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full flex items-center justify-center"
                >
                    <Plus className="size-6 text-white rounded-sm" />
                    <span className="ml-2 text-white text-sm">
                        {t('app.buyurtmachi.registerForm.certificates.addCertificate')}
                    </span>
                </button>
            </div>
        </div>
    )
}

export { CertificateUploader }