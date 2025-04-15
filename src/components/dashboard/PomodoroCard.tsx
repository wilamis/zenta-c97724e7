
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

const PomodoroCard = () => {
  const { t } = useLanguage();
  
  return (
    <Card className="glass-morphism border-zenta-purple/20 hover:border-zenta-purple/50 transition-all duration-300">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <PlayCircle className="h-10 w-10 text-zenta-purple mb-2" />
          <h3 className="font-medium">{t("dashboard.focusMode")}</h3>
          <p className="text-xs text-muted-foreground mb-4">
            {t("dashboard.focusModeDescription")}
          </p>
          <Button className="mt-auto w-full" asChild>
            <a href="/focus">{t("dashboard.enterFocusMode")}</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroCard;
