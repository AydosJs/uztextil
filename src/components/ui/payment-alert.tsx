import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer"
import { AlertCircle, ExternalLink } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useTelegramUser } from "@/hooks/useTelegramUser"
import { apiV1PaymentCreateTransactionCreate } from "@/lib/api/api/api"
import type { TransactionCreate } from "@/lib/api/model/transactionCreate"
import { TransactionCreateProvider } from "@/lib/api/model/transactionCreateProvider"
import { isTelegramEnvironment } from "@/utils/environmentUtils"
import { TELEGRAM_SDK_CONFIG } from "@/lib/config"

// Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        openLink: (url: string) => void
        openTelegramLink: (url: string) => void
        openInvoice: (url: string, callback?: (status: string) => void) => void
      }
    }
  }
}

interface PaymentResponse {
  payment_url: string
  transaction_id?: string
  status?: string
}

interface PaymentAlertProps {
  isOpen: boolean
  onClose: () => void
  type: 'notPaid' | 'error'
  onRetry?: () => void
  price?: number
  currency?: string
  additionalService?: number
  reference?: string
  redirectUrl?: string
  onPaymentSuccess?: (transactionId: string) => void
  onPaymentError?: (error: string) => void
}

export function PaymentAlert({
  isOpen,
  onClose,
  type,
  onRetry,
  price,
  currency = 'UZS',
  additionalService,
  reference,
  redirectUrl,
  onPaymentSuccess,
  onPaymentError
}: PaymentAlertProps) {
  const { t } = useTranslation()
  const { userInfo } = useTelegramUser()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false)

  const isError = type === 'error'
  const title = isError ? t('app.payment.error.title') : t('app.payment.notPaid.title')
  const message = isError ? t('app.payment.error.message') : t('app.payment.notPaid.message')
  const buttonText = isError ? t('app.payment.error.button') : t('app.payment.notPaid.button')

  const handlePayment = async () => {
    if (!userInfo?.user_id) {
      onPaymentError?.('User not found')
      return
    }

    setIsProcessing(true)

    try {
      const transactionData: TransactionCreate = {
        user: userInfo.user_id,
        provider: TransactionCreateProvider.paylov,
        reference: reference || `PAYMENT-${Date.now()}`,
        additional_service: additionalService || undefined,
        redirect_url: redirectUrl || undefined
      }

      const response = await apiV1PaymentCreateTransactionCreate(transactionData) as unknown as PaymentResponse

      // Check if response contains payment_url
      if (response?.payment_url) {
        setPaymentUrl(response.payment_url)
        setIsWaitingForPayment(true)
        setIsProcessing(false)

        // Open payment URL within Telegram WebApp using the recommended approach
        console.log('Payment URL:', response.payment_url)
        console.log('Is Telegram Environment:', isTelegramEnvironment())
        console.log('Telegram WebApp available:', !!window.Telegram?.WebApp)

        if (TELEGRAM_SDK_CONFIG.USE_TELEGRAM_SDK && isTelegramEnvironment() && window.Telegram?.WebApp?.openLink) {
          try {
            // Use the recommended Telegram.WebApp.openLink() method
            // This opens the payment site inside Telegram's in-app browser
            console.log('Opening payment URL with Telegram.WebApp.openLink')
            window.Telegram.WebApp.openLink(response.payment_url)
          } catch (error) {
            console.error('Failed to open URL with Telegram.WebApp.openLink:', error)
            // Fallback to manual button approach
            console.log('Falling back to manual button approach')
          }
        } else {
          // Fallback for non-Telegram environments (development/testing)
          console.warn('Not in Telegram environment or openLink not available, using window.open as fallback')
          window.open(response.payment_url, '_blank')
        }
      } else {
        throw new Error('Payment URL not received from server')
      }
    } catch (error) {
      console.error('Payment error:', error)
      onPaymentError?.(error instanceof Error ? error.message : 'Payment failed')
      setIsProcessing(false)
    }
  }

  const handlePaymentComplete = () => {
    setIsWaitingForPayment(false)
    setPaymentUrl(null)
    onPaymentSuccess?.('payment_completed')
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="">
        <DrawerHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            {isWaitingForPayment ? (
              <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <AlertCircle className={`w-8 h-8 ${isError ? 'text-status-error' : 'text-status-warning'}`} />
            )}
          </div>
          <DrawerTitle className="text-white font-semibold text-xl">
            {isWaitingForPayment ? t('app.payment.waiting') : title}
          </DrawerTitle>
          <DrawerDescription className="text-text-secondary text-base mt-2">
            {isWaitingForPayment ? t('app.payment.waitingMessage') : message}
          </DrawerDescription>

          {price && (
            <div className="mt-4 p-4 bg-background-card/50 rounded-lg border border-border-primary/50">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary text-sm">{t('app.payment.price')}:</span>
                <span className="text-brand-primary font-bold text-lg">
                  {price.toLocaleString()} {currency}
                </span>
              </div>
            </div>
          )}

          {isWaitingForPayment && paymentUrl && (
            <div className="mt-4 p-4 bg-background-card/50 rounded-lg border border-border-primary/50">
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4 text-brand-primary" />
                  <span className="text-text-secondary text-sm">
                    {t('app.payment.waitingMessage')}
                  </span>
                </div>
                <Button
                  onClick={() => {
                    console.log('Manual payment URL open:', paymentUrl)
                    if (TELEGRAM_SDK_CONFIG.USE_TELEGRAM_SDK && isTelegramEnvironment() && window.Telegram?.WebApp?.openLink) {
                      window.Telegram.WebApp.openLink(paymentUrl)
                    } else {
                      window.open(paymentUrl, '_blank')
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {t('app.payment.openPaymentPage')}
                </Button>
              </div>
            </div>
          )}
        </DrawerHeader>

        <DrawerFooter className="space-y-3 pb-safe-bottom">
          {!isError && !isWaitingForPayment && (
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-brand-primary text-black hover:bg-brand-primary/90 disabled:opacity-50"
            >
              {isProcessing ? t('app.payment.processing') : t('app.payment.pay')}
            </Button>
          )}

          {isWaitingForPayment && (
            <Button
              onClick={handlePaymentComplete}
              className="w-full bg-green-600 text-white hover:bg-green-700"
            >
              {t('app.payment.completePayment')}
            </Button>
          )}

          {!isWaitingForPayment && (
            <Button
              onClick={onClose}
              variant={isError ? "default" : "outline"}
              className={`w-full ${isError ? 'bg-brand-primary text-black hover:bg-brand-primary/90' : 'border-border-primary text-white hover:bg-background-card-hover'}`}
            >
              {buttonText}
            </Button>
          )}

          {isError && onRetry && !isWaitingForPayment && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="w-full border-border-primary text-white hover:bg-background-card-hover"
            >
              {t('app.common.retry')}
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
