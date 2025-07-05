import React from 'react';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

export default function ExamplePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Example Components</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Prediction Market</CardTitle>
            <CardDescription>
              Create and manage decentralized prediction markets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Build markets for any future event and let users trade on outcomes.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="primary">Learn More</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Dashboard</CardTitle>
            <CardDescription>
              Track market performance and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Comprehensive analytics for all your prediction markets.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary">View Dashboard</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Manager</CardTitle>
            <CardDescription>
              Manage your positions and earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Keep track of all your positions across different markets.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Portfolio</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Button Examples</h2>
        <div className="flex gap-4 justify-center items-center flex-wrap">
          <Button variant="primary" size="sm">Small Primary</Button>
          <Button variant="secondary" size="md">Medium Secondary</Button>
          <Button variant="outline" size="lg">Large Outline</Button>
          <Button disabled>Disabled Button</Button>
        </div>
      </div>
    </div>
  );
}
