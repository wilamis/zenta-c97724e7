
import { useLanguage } from "@/context/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Language = {
  code: "pt-BR";
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: "pt-BR", name: "Português (Brasil)", flag: "🇧🇷" },
];

const LanguageSelector = () => {
  const { language } = useLanguage();

  const activeLanguage = languages[0];

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
            className="cursor-pointer gap-2 font-medium bg-secondary"
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
