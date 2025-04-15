
import { Calendar, ListTodo, PlayCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

const QuickActions = () => {
  const { t } = useLanguage();
  
  return (
    <Card className="glass-morphism border-zenta-purple/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-zenta-orange" />
          {t("dashboard.quickActions")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-3">
        <Button variant="outline" className="justify-start h-12 border-zenta-purple/20 hover:border-zenta-purple/50" asChild>
          <a href="/tasks">
            <ListTodo className="h-4 w-4 mr-2" />
            {t("dashboard.newTask")}
          </a>
        </Button>
        <Button variant="outline" className="justify-start h-12 border-zenta-purple/20 hover:border-zenta-purple/50" asChild>
          <a href="/focus">
            <PlayCircle className="h-4 w-4 mr-2" />
            {t("dashboard.startFocus")}
          </a>
        </Button>
        <Button variant="outline" className="justify-start h-12 border-zenta-purple/20 hover:border-zenta-purple/50" asChild>
          <a href="/planner">
            <Calendar className="h-4 w-4 mr-2" />
            {t("dashboard.planWeek")}
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
