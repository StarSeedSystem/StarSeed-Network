
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Bell, Shield } from "lucide-react";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { PrivacySettings } from "@/components/profile/PrivacySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";


export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-card/60 rounded-xl h-auto">
                    <TabsTrigger value="profile" className="rounded-lg py-2 text-base">
                        <User className="mr-2 h-5 w-5" />
                        Perfil
                    </TabsTrigger>
                    <TabsTrigger value="account" className="rounded-lg py-2 text-base">
                        <Lock className="mr-2 h-5 w-5" />
                        Cuenta
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="rounded-lg py-2 text-base">
                        <Shield className="mr-2 h-5 w-5" />
                        Privacidad
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-lg py-2 text-base">
                        <Bell className="mr-2 h-5 w-5" />
                        Notificaciones
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="mt-6">
                   <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Información Pública del Perfil</CardTitle>
                            <CardDescription>Esta información será visible para otros según tus ajustes de privacidad.</CardDescription>
                        </CardHeader>
                        <ProfileSettings />
                   </Card>
                </TabsContent>
                <TabsContent value="account" className="mt-6">
                     <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Ajustes de la Cuenta</CardTitle>
                            <CardDescription>Gestiona tu información de inicio de sesión y seguridad.</CardDescription>
                        </CardHeader>
                        <AccountSettings />
                   </Card>
                </TabsContent>
                <TabsContent value="privacy" className="mt-6">
                     <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Privacidad Granular</CardTitle>
                            <CardDescription>Controla quién puede ver cada parte de tu perfil y actividad.</CardDescription>
                        </CardHeader>
                        <PrivacySettings />
                   </Card>
                </TabsContent>
                <TabsContent value="notifications" className="mt-6">
                     <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Preferencias de Notificación</CardTitle>
                            <CardDescription>Elige cómo y cuándo quieres que te contactemos.</CardDescription>
                        </CardHeader>
                        <NotificationSettings />
                   </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
