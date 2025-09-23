// Simple in-memory rate limiting
// In production, you'd want to use Redis or a database

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 15 * 60 * 1000, maxRequests: 5 } // 5 requests per 15 minutes
): { success: boolean; limit: number; remaining: number; resetTime: number } {
  const now = Date.now()
  const { windowMs, maxRequests } = options

  // Clean up expired entries
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key)
    }
  }

  const entry = rateLimitMap.get(identifier)

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    const resetTime = now + windowMs
    rateLimitMap.set(identifier, { count: 1, resetTime })
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetTime,
    }
  }

  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  // Increment count
  entry.count++
  rateLimitMap.set(identifier, entry)

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

export function getClientIP(request: Request): string {
  // Try to get real IP from headers (for production with proxies)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  
  if (realIP) {
    return realIP
  }
  
  // Fallback for development
  return 'unknown'
}