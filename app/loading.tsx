import { ShatterLoader } from "@/components/ui/shatter-loader";

export default function Loading() {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-white z-[9999] relative">
            <ShatterLoader />
        </div>
    );
}
