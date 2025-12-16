import { ShatterLoader } from "@/components/ui/shatter-loader";

export default function DashboardLoading() {
    return (
        <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center">
            <ShatterLoader />
        </div>
    );
}
