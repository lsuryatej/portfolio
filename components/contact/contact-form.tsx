'use client'

import * as React from 'react'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'
import { contactFormSchema, type ContactFormData, contactFormDefaults } from '@/lib/validations/contact'
import { cn } from '@/lib/utils'
import { Send, Loader2 } from 'lucide-react'

interface FormErrors {
  [key: string]: string
}

export function ContactForm() {
  const [formData, setFormData] = React.useState<ContactFormData>(contactFormDefaults as ContactFormData)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const { addToast } = useToast()
  const formRef = React.useRef<HTMLFormElement>(null)

  const validateField = (name: string, value: string) => {
    try {
      const fieldSchema = contactFormSchema.shape[name as keyof typeof contactFormSchema.shape]
      if (fieldSchema) {
        fieldSchema.parse(value)
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ message: string }> }
        const firstError = zodError.errors?.[0]
        if (firstError?.message) {
          setErrors(prev => ({ ...prev, [name]: firstError.message }))
        }
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate all fields
      const validatedData = contactFormSchema.parse(formData)

      // Check honeypot field
      if (validatedData.website && validatedData.website.length > 0) {
        addToast({
          type: 'error',
          title: 'Submission failed',
          description: 'Invalid form submission detected.'
        })
        setIsSubmitting(false)
        return
      }

      // Submit form
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSuccess(true);
        addToast({
          type: 'success',
          title: 'Message sent!',
          description: 'Thank you for your message. I\'ll get back to you soon.'
        })
        
        // Reset form with animation
        setTimeout(() => {
          setFormData(contactFormDefaults as ContactFormData)
          setErrors({})
          setIsSuccess(false);
        }, 2000);
      } else {
        addToast({
          type: 'error',
          title: 'Failed to send message',
          description: result.error || 'Please try again later.'
        })
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errors' in error) {
        // Zod validation errors
        const zodError = error as { errors: Array<{ path?: string[]; message: string }> }
        const newErrors: FormErrors = {}
        zodError.errors.forEach((err) => {
          if (err.path?.[0]) {
            newErrors[err.path[0]] = err.message
          }
        })
        setErrors(newErrors)
      } else {
        addToast({
          type: 'error',
          title: 'Failed to send message',
          description: 'Please check your connection and try again.'
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      className={cn(
        "space-y-6 transition-all duration-500",
        isSuccess && "scale-[0.98] opacity-80"
      )}
    >
      {/* Honeypot field - hidden from users */}
      <div className="hidden">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          type="text"
          value={formData.website || ''}
          onChange={handleInputChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={cn(errors.name && 'border-red-500 focus-visible:ring-red-500')}
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && <div id="name-error" className="sr-only">{errors.name}</div>}
          {errors.name && (
            <p className="text-sm text-red-500" role="alert" aria-live="polite">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={cn(errors.email && 'border-red-500 focus-visible:ring-red-500')}
            placeholder="your.email@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <div id="email-error" className="sr-only">{errors.email}</div>}
          {errors.email && (
            <p className="text-sm text-red-500" role="alert" aria-live="polite">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject || ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={cn(errors.subject && 'border-red-500 focus-visible:ring-red-500')}
          placeholder="What's this about?"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
        />
        {errors.subject && <div id="subject-error" className="sr-only">{errors.subject}</div>}
        {errors.subject && (
          <p className="text-sm text-red-500" role="alert" aria-live="polite">
            {errors.subject}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Message <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={cn(errors.message && 'border-red-500 focus-visible:ring-red-500')}
          placeholder="Tell me about your project, question, or just say hello..."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : 'message-count'}
        />
        {errors.message && <div id="message-error" className="sr-only">{errors.message}</div>}
        {errors.message && (
          <p className="text-sm text-red-500" role="alert" aria-live="polite">
            {errors.message}
          </p>
        )}
        <p id="message-count" className="text-sm text-muted-foreground" aria-live="polite">
          {formData.message.length}/2000 characters
        </p>
      </div>

      <MagneticButton
        type="submit"
        disabled={isSubmitting}
        variant="primary"
        size="lg"
        strength={0.3}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </MagneticButton>
    </form>
  )
}