
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

const Reminders = () => {
  const { t } = useLanguage();
  
  return (
    <Card className="glass-morphism border-zenta-purple/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-zenta-purple" />
          {t("dashboard.reminders")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="bg-secondary/30 rounded-lg p-3 border border-secondary/50">
            <div className="font-medium">{t("dashboard.teamMeeting")}</div>
            <div className="text-sm text-muted-foreground">{t("dashboard.tomorrowAt")}</div>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3 border border-secondary/50">
            <div className="font-medium">{t("dashboard.projectDeadline")}</div>
            <div className="text-sm text-muted-foreground">{t("dashboard.fridayAt")}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reminders;
