
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

const FocusCard = () => {
  const { t } = useLanguage();
  
  return (
    <Card className="glass-morphism border-zenta-purple/20 hover:border-zenta-purple/50 transition-all duration-300">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Timer className="h-10 w-10 text-zenta-purple mb-2" />
          <h3 className="font-medium">{t("dashboard.pomodoro")}</h3>
          <p className="text-xs text-muted-foreground mb-4">
            {t("dashboard.pomodoroDescription")}
          </p>
          <Button className="mt-auto w-full" asChild>
            <a href="/pomodoro">{t("dashboard.startSession")}</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusCard;
