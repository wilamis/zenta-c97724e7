
import { useLanguage } from "@/context/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Language = {
  code: "en" | "pt-BR";
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt-BR", name: "Português (Brasil)", flag: "🇧🇷" },
];

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const activeLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (code: "en" | "pt-BR") => {
    setLanguage(code);
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
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={cn(
              "cursor-pointer gap-2",
              lang.code === language && "font-medium bg-secondary"
            )}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
