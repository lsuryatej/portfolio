'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateAccessibilityReport } from '@/lib/accessibility-testing';
import { Eye, Keyboard, Palette, Navigation, Zap, RefreshCw } from 'lucide-react';

interface AccessibilityReport {
  timestamp: string;
  summary: {
    colorContrast: {
      total: number;
      passedAA: number;
      failedAA: number;
    };
    keyboard: {
      total: number;
      accessible: number;
    };
    aria: {
      issues: number;
      suggestions: number;
    };
    landmarks: {
      issues: number;
      suggestions: number;
    };
    motion: {
      issues: number;
      suggestions: number;
    };
  };
  details: {
    colorContrast: {
      results: Array<{ combination: string; ratio: number; passes: { aa: boolean; aaa: boolean } }>;
      failedAA: Array<{ combination: string; ratio: number; passes: { aa: boolean; aaa: boolean } }>;
    };
    keyboard: Array<{ element: string; isVisible: boolean; hasAccessibleName: boolean }>;
    tabOrder: Array<{ index: number; element: string; tabIndex: number; isVisible: boolean }>;
    aria: Array<{ element: string; issues: string[]; suggestions: string[] }>;
    landmarks: { landmarks: Record<string, number>; issues: string[]; suggestions: string[] };
    motion: { prefersReducedMotion: boolean; animatedElementsCount: number; issues: string[]; suggestions: string[] };
  };
}

export function AccessibilityPanel() {
  const [report, setReport] = useState<AccessibilityReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'contrast' | 'keyboard' | 'aria' | 'motion'>('overview');

  const runAccessibilityTest = async () => {
    setIsLoading(true);
    try {
      // Small delay to allow UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      const newReport = generateAccessibilityReport();
      setReport(newReport);
    } catch (error) {
      console.error('Error running accessibility test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Run initial test
    runAccessibilityTest();
  }, []);

  if (!report) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Accessibility Testing Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runAccessibilityTest} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Accessibility Tests'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (passed: number, total: number) => {
    const percentage = (passed / total) * 100;
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'contrast', label: 'Color Contrast', icon: Palette },
    { id: 'keyboard', label: 'Keyboard', icon: Keyboard },
    { id: 'aria', label: 'ARIA & Semantics', icon: Navigation },
    { id: 'motion', label: 'Motion', icon: Zap },
  ] as const;

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Accessibility Testing Panel
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Last run: {new Date(report.timestamp).toLocaleTimeString()}
            </span>
            <Button onClick={runAccessibilityTest} disabled={isLoading} size="sm">
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Color Contrast Score */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Color Contrast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getScoreColor(report.summary.colorContrast.passedAA, report.summary.colorContrast.total)}`} />
                    <span className="font-semibold">
                      {report.summary.colorContrast.passedAA}/{report.summary.colorContrast.total}
                    </span>
                    <span className="text-sm text-muted-foreground">passed AA</span>
                  </div>
                </CardContent>
              </Card>

              {/* Keyboard Navigation Score */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Keyboard className="h-4 w-4" />
                    Keyboard Navigation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getScoreColor(report.summary.keyboard.accessible, report.summary.keyboard.total)}`} />
                    <span className="font-semibold">
                      {report.summary.keyboard.accessible}/{report.summary.keyboard.total}
                    </span>
                    <span className="text-sm text-muted-foreground">accessible</span>
                  </div>
                </CardContent>
              </Card>

              {/* ARIA Issues */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    ARIA & Semantics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={report.summary.aria.issues === 0 ? 'default' : 'destructive'}>
                        {report.summary.aria.issues} issues
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {report.summary.aria.suggestions} suggestions
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Color Contrast Tab */}
        {activeTab === 'contrast' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Color Contrast Results</h3>
            <div className="space-y-2">
              {report.details.colorContrast.results.map((result: { combination: string; ratio: number; passes: { aa: boolean; aaa: boolean } }, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{result.combination}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{result.ratio}:1</span>
                    <Badge variant={result.passes.aa ? 'default' : 'destructive'}>
                      {result.passes.aa ? 'AA ✓' : 'AA ✗'}
                    </Badge>
                    <Badge variant={result.passes.aaa ? 'default' : 'secondary'}>
                      {result.passes.aaa ? 'AAA ✓' : 'AAA ✗'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Tab */}
        {activeTab === 'keyboard' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Keyboard Navigation</h3>
            <div className="space-y-2">
              {report.details.keyboard.map((item: { element: string; isVisible: boolean; hasAccessibleName: boolean }, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-mono text-sm">{item.element}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.isVisible ? 'default' : 'secondary'}>
                      {item.isVisible ? 'Visible' : 'Hidden'}
                    </Badge>
                    <Badge variant={item.hasAccessibleName ? 'default' : 'destructive'}>
                      {item.hasAccessibleName ? 'Named' : 'No Name'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ARIA Tab */}
        {activeTab === 'aria' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ARIA & Semantic Issues</h3>
            <div className="space-y-4">
              {report.details.aria.map((item: { element: string; issues: string[]; suggestions: string[] }, index: number) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-mono">{item.element}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {item.issues.length > 0 && (
                      <div className="mb-2">
                        <h4 className="text-sm font-semibold text-red-600 mb-1">Issues:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {item.issues.map((issue: string, i: number) => (
                            <li key={i}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.suggestions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-yellow-600 mb-1">Suggestions:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {item.suggestions.map((suggestion: string, i: number) => (
                            <li key={i}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Motion Tab */}
        {activeTab === 'motion' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Motion & Animation</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Prefers Reduced Motion:</span>
                    <Badge variant={report.details.motion.prefersReducedMotion ? 'default' : 'secondary'}>
                      {report.details.motion.prefersReducedMotion ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Animated Elements Found:</span>
                    <Badge variant="secondary">
                      {report.details.motion.animatedElementsCount}
                    </Badge>
                  </div>
                  {report.details.motion.issues.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-red-600 mb-2">Issues:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {report.details.motion.issues.map((issue: string, i: number) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {report.details.motion.suggestions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-600 mb-2">Suggestions:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {report.details.motion.suggestions.map((suggestion: string, i: number) => (
                          <li key={i}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Development-only wrapper
export function AccessibilityDevPanel() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <details className="group">
        <summary className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg list-none">
          <span className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            A11y Panel
          </span>
        </summary>
        <div className="absolute bottom-full right-0 mb-2 w-screen max-w-4xl">
          <AccessibilityPanel />
        </div>
      </details>
    </div>
  );
}