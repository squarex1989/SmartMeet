import { AppNav } from "@/components/layout/AppNav";
import { SidebarByRoute } from "@/components/layout/SidebarByRoute";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-[#FAFAFA]">
      <AppNav />
      <div className="flex flex-1 overflow-hidden">
        <SidebarByRoute />
        <main className="flex-1 overflow-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
