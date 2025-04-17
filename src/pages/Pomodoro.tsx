
import Layout from "../components/layout/Layout";
import PomodoroTimer from "../components/pomodoro/PomodoroTimer";
import PomodoroHeader from "../components/pomodoro/PomodoroHeader";
import { useLanguage } from "@/context/LanguageContext";
import { usePomodoroStats } from "@/hooks/usePomodoroStats";

const Pomodoro = () => {
  const { t } = useLanguage();
  const { handleFocusSessionEnd } = usePomodoroStats();

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <PomodoroHeader 
          title={t('pomodoro.title')} 
          subtitle={t('pomodoro.subtitle')} 
        />
        
        <PomodoroTimer onFocusSessionEnd={handleFocusSessionEnd} />
      </div>
    </Layout>
  );
};

export default Pomodoro;
