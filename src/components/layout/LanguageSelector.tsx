
import { useState } from "react";
import { Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Language = {
  code: string;
  name: string;
  flag: string;
  active: boolean;
};

const LanguageSelector = () => {
  const [languages, setLanguages] = useState<Language[]>([
    { code: "en", name: "English", flag: "🇺🇸", active: true },
    { code: "pt-BR", name: "Português (Brasil)", flag: "🇧🇷", active: false },
  ]);

  const activeLanguage = languages.find((lang) => lang.active) || languages[0];

  const handleLanguageChange = (code: string) => {
    setLanguages(
      languages.map((lang) => ({
        ...lang,
        active: lang.code === code,
      }))
    );
    // Here you would typically handle actual language change in your app
    console.log(`Language changed to: ${code}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start px-2 gap-2"
        >
          <span className="text-lg">{activeLanguage.flag}</span>
          <span className="text-sm">{activeLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={cn(
              "cursor-pointer gap-2",
              language.active && "font-medium bg-secondary"
            )}
            onClick={() => handleLanguageChange(language.code)}
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
