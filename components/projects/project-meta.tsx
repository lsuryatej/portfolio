'use client';

import { Project } from 'contentlayer/generated';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building, Target, Wrench } from 'lucide-react';
import { FadeIn } from '@/lib/motion/primitives';

interface ProjectMetaProps {
  project: Project;
}

export function ProjectMeta({ project }: ProjectMetaProps) {
  const metaItems = [
    {
      icon: User,
      label: 'Role',
      value: project.role,
    },
    {
      icon: Calendar,
      label: 'Year',
      value: project.year?.toString(),
    },
    {
      icon: Building,
      label: 'Client',
      value: project.client,
    },
    {
      icon: Target,
      label: 'Outcome',
      value: project.outcome,
    },
  ].filter(item => item.value);

  return (
    <FadeIn>
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Meta Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Project Details</h3>
            {metaItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <item.icon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="text-sm mt-1">
                    {item.value}
                  </dd>
                </div>
              </div>
            ))}
          </div>

          {/* Tools & Technologies */}
          {project.tools && project.tools.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Tools & Technologies</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <Badge key={tool} variant="outline">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </FadeIn>
  );
}