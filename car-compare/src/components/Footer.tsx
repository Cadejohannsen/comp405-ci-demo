export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-heading text-xl font-bold uppercase tracking-tight">
              Car<span className="text-accent">Compare</span>
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              Find the best deal on your next car.
            </p>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            &copy; {new Date().getFullYear()} CarCompare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
