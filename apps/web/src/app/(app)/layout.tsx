import { AppNav } from "@/components/shared/app-nav";
import { DotPattern } from "@/components/background/dotted-background";
import { cn } from "@/lib/utils";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <DotPattern
        className={cn(
          "mask-[radial-gradient(900px_circle_at_center,white,transparent)] opacity-60",
        )}
      />
      <AppNav />
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
    </div>
  );
}
