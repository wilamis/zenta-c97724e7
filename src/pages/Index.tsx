
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { useLanguage } from "../context/LanguageContext";
import { Clock } from "lucide-react";
import TaskLists from "../components/home/TaskLists";

const Index = () => {
  const { language } = useLanguage();
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("Usuário");
  
  // Get the appropriate greeting based on time of day
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
    
    // Get saved username from localStorage
    const savedName = localStorage.getItem("user-name");
    if (savedName) {
      setUserName(savedName);
    }
    
    // Update greeting based on language
    if (language === "pt-BR") {
      const ptBRGreetings: Record<string, string> = {
        goodMorning: "Bom dia",
        goodAfternoon: "Boa tarde",
        goodEvening: "Boa noite"
      };
      setGreeting(ptBRGreetings[greetingKey]);
    } else {
      const enGreetings: Record<string, string> = {
        goodMorning: "Good morning",
        goodAfternoon: "Good afternoon",
        goodEvening: "Good evening"
      };
      setGreeting(enGreetings[greetingKey]);
    }
  }, [language]);
  
  // Get formatted date
  const formattedDate = new Date().toLocaleDateString(language === "pt-BR" ? "pt-BR" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  
  return (
    <Layout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
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
