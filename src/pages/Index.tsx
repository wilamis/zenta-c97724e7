
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { useLanguage } from "../context/LanguageContext";
import { Clock } from "lucide-react";
import TaskLists from "../components/home/TaskLists";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { language } = useLanguage();
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("Usuário");
  const isMobile = useIsMobile();
  
  // Obtém a saudação apropriada com base na hora do dia
  useEffect(() => {
    const date = new Date();
    const hours = date.getHours();
    
    let greetingKey = "";
    if (hours >= 5 && hours < 12) {
      greetingKey = "goodMorning";
    } else if (hours >= 12 && hours < 18) {
      greetingKey = "goodAfternoon";
    } else {
      greetingKey = "goodEvening";
    }
    
    // Obtém o nome de usuário salvo do localStorage
    const savedName = localStorage.getItem("user-name");
    if (savedName) {
      setUserName(savedName);
    }
    
    // Saudações em português
    const ptBRGreetings: Record<string, string> = {
      goodMorning: "Bom dia",
      goodAfternoon: "Boa tarde",
      goodEvening: "Boa noite"
    };
    setGreeting(ptBRGreetings[greetingKey]);
  }, [language]);
  
  // Obtém a data formatada sempre em Português
  const formattedDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  
  return (
    <Layout>
      <div className="space-y-8 w-full max-w-[100%]">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>
              {greeting}, {userName}
            </h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formattedDate}
            </p>
          </div>
        </header>
        
        <TaskLists />
      </div>
    </Layout>
  );
};

export default Index;
