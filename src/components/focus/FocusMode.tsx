import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  FileText, 
  Play, 
  Square, 
  Volume2, 
  VolumeX,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import { Task } from '../tasks/TaskItem';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import FocusSettings from './FocusSettings';
import { useLanguage } from '@/context/LanguageContext';

interface FocusModeProps {
  tasks?: Task[];
  onTaskComplete?: (id: string) => void;
}

const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'rainfall' },
  { id: 'forest', name: 'forest' },
  { id: 'cafe', name: 'cafe' },
  { id: 'lofi', name: 'lofi' },
  { id: 'white-noise', name: 'whiteNoise' },
];

const FocusMode = ({ tasks = [], onTaskComplete }: FocusModeProps) => {
  const { t } = useLanguage();
  const [isFocusing, setIsFocusing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [taskListOpen, setTaskListOpen] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusHistory, setFocusHistory] = useState<{ date: Date; duration: number }[]>([]);
  const [totalFocusedToday, setTotalFocusedToday] = useState(0);
  
  const { toast } = useToast();
  
  useEffect(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayFocus = focusHistory
      .filter(entry => new Date(entry.date).setHours(0, 0, 0, 0) === today)
      .reduce((total, entry) => total + entry.duration, 0);
    
    setTotalFocusedToday(todayFocus);
  }, [focusHistory]);

  useEffect(() => {
    let interval: number | null = null;
    
    if (isFocusing) {
      interval = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocusing]);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isFullscreen]);

  const startFocus = () => {
    if (!selectedTask) {
      toast({
        title: t('focus.noTaskSelected'),
        description: t('focus.selectTaskToFocus'),
        variant: "destructive",
      });
      return;
    }

    setIsFocusing(true);
    setElapsedTime(0);
    
    toast({
      title: t('focus.focusSessionStarted'),
      description: `${t('focus.focusingOn')} ${selectedTask.title}`,
    });
  };

  const stopFocus = () => {
    if (isFocusing) {
      setFocusHistory(prev => [
        ...prev,
        { date: new Date(), duration: elapsedTime }
      ]);
      
      toast({
        title: t('focus.focusSessionCompleted'),
        description: `${t('focus.youFocusedFor')} ${formatTime(elapsedTime)}`,
      });
      
      setIsFocusing(false);
    }
  };

  const completeTask = () => {
    if (selectedTask && onTaskComplete) {
      onTaskComplete(selectedTask.id);
      toast({
        title: t('focus.taskCompleted'),
        description: t('focus.wellDoneCompleting'),
      });
      setSelectedTask(null);
    }
  };

  const toggleSound = (soundId: string) => {
    if (soundPlaying === soundId) {
      setSoundPlaying(null);
    } else {
      setSoundPlaying(soundId);
    }
  };

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className={cn(
      "relative transition-all duration-300",
      isFullscreen && "fixed inset-0 z-50 bg-background p-8"
    )}>
      <div className="max-w-2xl mx-auto">
        {isFocusing ? (
          <div className="text-center space-y-10">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-zenta-purple animate-fade-in">
                {t('focus.focusMode')}
              </h1>
              <p className="text-muted-foreground animate-fade-in delay-100">
                {t('focus.stayPresent')}
              </p>
            </div>
            
            <div className="bg-secondary/50 rounded-xl p-6 space-y-4 mx-auto max-w-md glass-morphism animate-fade-in delay-200">
              <h2 className="text-xl font-semibold">{t('focus.currentlyFocusing')}</h2>
              <p className="text-2xl font-bold text-zenta-purple">
                {selectedTask?.title}
              </p>
              
              <div className="flex justify-center pt-2">
                <Badge variant="outline" className="text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(elapsedTime)}
                </Badge>
              </div>
              
              <Progress value={100} className="animate-pulse" />
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 animate-fade-in delay-300">
              {AMBIENT_SOUNDS.map(sound => (
                <Button
                  key={sound.id}
                  variant={soundPlaying === sound.id ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => toggleSound(sound.id)}
                >
                  {soundPlaying === sound.id ? (
                    <Volume2 className="w-4 h-4 mr-2" />
                  ) : (
                    <VolumeX className="w-4 h-4 mr-2" />
                  )}
                  {t(`focusSettings.ambientSounds.${sound.name}`)}
                </Button>
              ))}
            </div>
            
            <div className="flex justify-center gap-4 pt-4 animate-fade-in delay-400">
              <Button 
                variant="destructive" 
                size="lg" 
                className="rounded-full px-8" 
                onClick={stopFocus}
              >
                <Square className="w-5 h-5 mr-2" />
                {t('focus.endFocus')}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full" 
                onClick={completeTask}
              >
                {t('focus.completeTask')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{t('focus.title')}</h1>
              <p className="text-muted-foreground">
                {t('focus.subtitle')}
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              <Card className="flex-1 glass-morphism border-zenta-purple/20">
                <CardContent className="pt-6 h-full flex flex-col">
                  <h2 className="text-xl font-semibold mb-4">{t('focus.taskSelection')}</h2>
                  
                  {selectedTask ? (
                    <div className="task-card !bg-secondary border-zenta-purple">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`priority-dot priority-${selectedTask.priority}`} />
                            <h3 className="text-base font-medium">{selectedTask.title}</h3>
                          </div>
                          {selectedTask.estimatedTime && (
                            <div className="text-xs text-muted-foreground mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {selectedTask.estimatedTime} min
                            </div>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedTask(null)}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-muted rounded-lg p-4 text-center cursor-pointer hover:border-zenta-purple/50 transition-colors"
                         onClick={() => setTaskListOpen(!taskListOpen)}
                    >
                      <p className="text-muted-foreground">
                        {t('focus.selectTask')}
                      </p>
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          {t('focus.browseTasks')}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {taskListOpen && (
                    <div className="mt-4 max-h-[200px] overflow-y-auto scrollbar-none">
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        {t('focus.availableTasks')}
                      </div>
                      {tasks.length > 0 ? (
                        tasks.map(task => (
                          <div 
                            key={task.id}
                            className="task-card cursor-pointer"
                            onClick={() => {
                              setSelectedTask(task);
                              setTaskListOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`priority-dot priority-${task.priority}`} />
                              <h3 className="text-base font-medium">{task.title}</h3>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          {t('focus.noTasksAvailable')}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-auto pt-6">
                    <Button 
                      className="w-full rounded-full" 
                      size="lg" 
                      onClick={startFocus}
                      disabled={!selectedTask}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      {t('focus.startFocusing')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="flex-1 glass-morphism border-zenta-purple/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{t('focus.focusStats')}</h2>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <FocusSettings />
                      </SheetContent>
                    </Sheet>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('focus.todayFocusTime')}</span>
                        <span className="text-sm font-medium">{formatTime(totalFocusedToday)}</span>
                      </div>
                      <Progress value={Math.min((totalFocusedToday / (4 * 3600)) * 100, 100)} />
                    </div>
                    
                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{t('focus.recentSessions')}</h3>
                      </div>
                      
                      <div className="space-y-2 max-h-[150px] overflow-y-auto scrollbar-none">
                        {focusHistory.length > 0 ? (
                          [...focusHistory]
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 5)
                            .map((session, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span>{formatTime(session.duration)}</span>
                              </div>
                            ))
                        ) : (
                          <div className="text-center py-2 text-muted-foreground text-sm">
                            {t('focus.noFocusSessions')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={enterFullscreen}
                    >
                      {t('focus.enableDistraction')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusMode;
