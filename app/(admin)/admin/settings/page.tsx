import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, Save } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <Settings className="size-6 text-cyan-400" />
                <h1 className="text-2xl font-bold">Platform Settings</h1>
            </div>

            <Card className="p-6 border-white/10 bg-black/20">
                <h2 className="text-xl font-semibold mb-4">General Configuration</h2>
                <p className="text-gray-400 mb-6 text-sm">Manage global settings for the MSTC platform.</p>

                <div className="space-y-4 max-w-lg">
                    <div className="space-y-2">
                        <Label>Platform Name</Label>
                        <Input defaultValue="MSTC NEXT" className="bg-white/5 border-white/10" />
                    </div>

                    <div className="space-y-2">
                        <Label>Contact Email</Label>
                        <Input defaultValue="contact@mstc.edu" className="bg-white/5 border-white/10" />
                    </div>

                    <div className="pt-4">
                        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                            <Save className="size-4 mr-2" /> Save Changes
                        </Button>
                    </div>
                </div>
            </Card>

            <Card className="p-6 border-white/10 bg-black/20">
                <h2 className="text-xl font-semibold mb-4">Feature Flags</h2>
                <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5 opacity-50 cursor-not-allowed">
                    <div>
                        <div className="font-medium">Maintenance Mode</div>
                        <div className="text-xs text-gray-500">Disable access for non-admins</div>
                    </div>
                    <div className="h-6 w-11 bg-gray-700 rounded-full"></div>
                </div>
            </Card>
        </div>
    );
}
