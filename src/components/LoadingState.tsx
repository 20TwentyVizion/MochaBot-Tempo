import React from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

interface LoadingStateProps {
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
}

const LoadingState = ({
  isLoading = true,
  error = "",
  onRetry = () => {},
}: LoadingStateProps) => {
  return (
    <div className="flex items-center justify-center w-[200px] h-[200px] bg-background rounded-lg shadow-lg">
      {isLoading && !error && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading 3D Model...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="w-full">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mb-4">{error}</AlertDescription>
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            className="w-full"
          >
            Retry Loading
          </Button>
        </Alert>
      )}
    </div>
  );
};

export default LoadingState;
