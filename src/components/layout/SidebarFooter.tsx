
import { CheckSquare } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export const SidebarFooter = ({ isCollapsed }: SidebarFooterProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 mt-auto">
      {!isCollapsed && (
        <div className="rounded-lg bg-secondary p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-zenta-purple flex items-center justify-center">
              <CheckSquare className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{t("sidebar.freePlan")}</p>
              <p className="text-xs text-muted-foreground">
                {t("sidebar.upgradeText")}
              </p>
            </div>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-zenta-purple flex items-center justify-center">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};
