
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

interface DashboardHeaderProps {
  formattedDate: string;
}

const DashboardHeader = ({ formattedDate }: DashboardHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">{formattedDate}</p>
      </div>
      <Badge variant="outline" className="bg-zenta-purple text-white px-3 py-1 text-sm">
        {t("dashboard.level")} 3
      </Badge>
    </header>
  );
};

export default DashboardHeader;
