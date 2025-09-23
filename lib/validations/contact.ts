import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters')
    .optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  // Honeypot field - should be empty
  website: z.string().max(0, 'Invalid submission').optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export const contactFormDefaults: Partial<ContactFormData> = {
  name: '',
  email: '',
  subject: '',
  message: '',
  website: '', // Honeypot field
}