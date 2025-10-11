import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

import { Input } from "./input"

export interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  toggleLabel?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, toggleLabel = "Mostrar u ocultar contraseña", ...props }, ref) => {
    const [visible, setVisible] = React.useState(false)

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn("pr-10", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/60 absolute inset-y-0 right-0 flex items-center rounded-md px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label={toggleLabel}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    )
  },
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
