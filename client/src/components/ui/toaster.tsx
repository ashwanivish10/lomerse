import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

// Wavy SVG component for the left border
const WavySvg = ({ color }: { color: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={96} width={16} className="flex-shrink-0">
    <path
      strokeLinecap="round"
      strokeWidth={2}
      stroke={color}
      fill={color}
      d="M 8 0 
         Q 4 4.8, 8 9.6 
         T 8 19.2 
         Q 4 24, 8 28.8 
         T 8 38.4 
         Q 4 43.2, 8 48 
         T 8 57.6 
         Q 4 62.4, 8 67.2 
         T 8 76.8 
         Q 4 81.6, 8 86.4 
         T 8 96 
         L 0 96 
         L 0 0 
         Z"
    />
  </svg>
)

// Get the icon and color based on variant
const getVariantStyles = (variant?: string) => {
  switch (variant) {
    case "destructive":
      return {
        color: "#ef4444", // red-500
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        titleColor: "text-red-600",
      }
    case "success":
      return {
        color: "#22c55e", // green-500
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        titleColor: "text-green-600",
      }
    default:
      return {
        color: "#6366f1", // indigo-500
        icon: <Info className="w-5 h-5 text-indigo-500" />,
        titleColor: "text-indigo-600",
      }
  }
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const styles = getVariantStyles(variant as string)

        return (
          <Toast
            key={id}
            {...props}
            variant={variant}
            className="p-0 overflow-hidden border-0 shadow-xl bg-white dark:bg-slate-900 rounded-xl"
          >
            <div className="flex w-full h-24 overflow-hidden">
              {/* Wavy Border */}
              <WavySvg color={styles.color} />

              {/* Content */}
              <div className="flex-1 mx-3 py-3 overflow-hidden">
                <div className="flex items-center gap-2">
                  {styles.icon}
                  {title && (
                    <ToastTitle className={`text-lg font-bold leading-6 ${styles.titleColor}`}>
                      {title}
                    </ToastTitle>
                  )}
                </div>
                {description && (
                  <ToastDescription className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 leading-5 line-clamp-2">
                    {description}
                  </ToastDescription>
                )}
              </div>

              {/* Action */}
              {action}

              {/* Close Button */}
              <ToastClose className="relative right-0 top-0 h-full w-12 flex items-center justify-center opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" style={{ color: styles.color }} />
              </ToastClose>
            </div>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
