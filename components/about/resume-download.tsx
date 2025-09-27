'use client';

import { motion } from 'framer-motion';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RiseIn } from '@/lib/motion/primitives';

interface ResumeDownloadProps {
  resumeUrl?: string;
  linkedInUrl?: string;
  githubUrl?: string;
}

export function ResumeDownload({ 
  resumeUrl = '/resume.pdf',
  linkedInUrl = 'https://linkedin.com/in/suryatejlalam',
  githubUrl = 'https://github.com/suryatejlalam'
}: ResumeDownloadProps) {
  const handleDownload = () => {
    // Create a temporary link element and trigger download
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <RiseIn>
      <Card className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/10 dark:to-purple-950/10 border border-border/20 shadow-lg">
        <CardContent className="p-8 text-center space-y-4">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <FileText className="w-8 h-8 text-primary" />
          </motion.div>
          
          <h3 className="text-xl font-semibold mb-2">Download Resume</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
            Get a detailed overview of my experience, skills, and achievements in a downloadable PDF format.
          </p>
          
          <div className="flex flex-col gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleDownload}
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </Button>
            </motion.div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="default"
                  asChild
                >
                  <a 
                    href={linkedInUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    LinkedIn
                  </a>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="default"
                  asChild
                >
                  <a 
                    href={githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    GitHub
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
          
          <motion.div
            className="mt-6 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Last updated: 27/9/2025
          </motion.div>
        </CardContent>
      </Card>
    </RiseIn>
  );
}