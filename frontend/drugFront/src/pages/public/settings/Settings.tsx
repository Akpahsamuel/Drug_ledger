import { useState } from "react";
import { Settings as SettingsIcon, Bell, Shield, User } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/glass-card";
import { GlassContainer } from "@/components/glass-container";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface NotificationSettings {
  emailNotifications: boolean;
  issueUpdates: boolean;
  productAlerts: boolean;
  securityAlerts: boolean;
}

interface ProfileSettings {
  name: string;
  email: string;
  phone: string;
}

export default function Settings() {
  const { toast } = useToast();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    issueUpdates: true,
    productAlerts: false,
    securityAlerts: true,
  });

  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
  });

  const handleSaveProfile = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile settings have been saved successfully.",
      });
    }, 1000);
  };

  const handleSaveNotifications = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been saved successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-300">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid gap-6">
        <GlassContainer>
          <GlassCard>
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Name</label>
                <Input
                  value={profileSettings.name}
                  onChange={(e) =>
                    setProfileSettings((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Email</label>
                <Input
                  value={profileSettings.email}
                  onChange={(e) =>
                    setProfileSettings((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Phone</label>
                <Input
                  value={profileSettings.phone}
                  onChange={(e) =>
                    setProfileSettings((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </GlassCard>
        </GlassContainer>

        <GlassContainer>
          <GlassCard>
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400 flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Email Notifications</p>
                  <p className="text-sm text-slate-400">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      emailNotifications: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Issue Updates</p>
                  <p className="text-sm text-slate-400">Get notified about issue updates</p>
                </div>
                <Switch
                  checked={notificationSettings.issueUpdates}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      issueUpdates: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Product Alerts</p>
                  <p className="text-sm text-slate-400">Receive alerts about products</p>
                </div>
                <Switch
                  checked={notificationSettings.productAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      productAlerts: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Security Alerts</p>
                  <p className="text-sm text-slate-400">Get notified about security updates</p>
                </div>
                <Switch
                  checked={notificationSettings.securityAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      securityAlerts: checked,
                    }))
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveNotifications}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  Save Notifications
                </Button>
              </div>
            </CardContent>
          </GlassCard>
        </GlassContainer>

        <GlassContainer>
          <GlassCard>
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400 flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-white">Two-Factor Authentication</p>
                <p className="text-sm text-slate-400">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline" className="border-slate-700">
                  Enable 2FA
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-white">Change Password</p>
                <p className="text-sm text-slate-400">Update your account password</p>
                <Button variant="outline" className="border-slate-700">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </GlassCard>
        </GlassContainer>
      </div>
    </div>
  );
} 