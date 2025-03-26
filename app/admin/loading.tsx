export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Loading...
        </div>
      </div>
    </div>
  );
} 