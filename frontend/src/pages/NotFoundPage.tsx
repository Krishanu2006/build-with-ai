import { Home, Radio } from 'lucide-react';
import { Button } from '../components/primitives/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <BareLayout>
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-brand-surface-alt border border-brand-border flex items-center justify-center mx-auto text-brand-primary font-bold text-2xl">
          404
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-brand-text">
            Page Not Found
          </h1>
          <p className="text-sm text-brand-text-muted">
            The requested destination does not exist or has been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link to="/dashboard">
            <Button variant="primary" icon={<Home className="w-4 h-4" />}>
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/submit">
            <Button variant="outline" icon={<Radio className="w-4 h-4" />}>
              Submit Request
            </Button>
          </Link>
        </div>
      </div>
    </BareLayout>
  );
};
