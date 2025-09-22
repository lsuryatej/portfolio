// Re-export commonly used icons from lucide-react for consistency
export {
  // Navigation
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  
  // UI Elements
  Search,
  Filter,
  Settings,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  
  // Content
  Eye,
  EyeOff,
  Heart,
  Star,
  Bookmark,
  Share,
  Copy,
  Download,
  Upload,
  Edit,
  Trash2,
  
  // Social
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Globe,
  
  // Media
  Play,
  Pause,
  Volume2,
  VolumeX,
  Image,
  Video,
  Camera,
  
  // Status
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Calendar,
  
  // Theme
  Sun,
  Moon,
  Monitor,
  
  // Code
  Code,
  Terminal,
  FileText,
  Folder,
  FolderOpen,
  
  // Misc
  Zap,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  Coffee,
} from 'lucide-react'

// Icon size variants
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const

// Icon component props type
export type IconProps = {
  size?: keyof typeof iconSizes | number
  className?: string
}