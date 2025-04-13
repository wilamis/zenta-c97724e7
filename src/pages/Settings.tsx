
import Layout from "../components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { BellRing, Clock, CloudOff, Moon, Volume2 } from "lucide-react";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [offline, setOffline] = useState(false);
  const [pomodoroPreset, setPomodoroPreset] = useState("2510");
  const [focusGoal, setFocusGoal] = useState("4hours");
  
  return (
    <Layout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure your ZenTa experience
          </p>
        </header>
        
        <div className="space-y-6">
          <Card className="glass-morphism border-zenta-purple/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BellRing className="h-5 w-5 mr-2 text-zenta-purple" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Enable notifications</Label>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="soundEffects" className="flex items-center">
                  <Volume2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  Sound effects
                </Label>
                <Switch
                  id="soundEffects"
                  checked={soundEffects}
                  onCheckedChange={setSoundEffects}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-zenta-purple/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-zenta-purple" />
                Productivity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pomodoroPreset">Default Pomodoro cycle</Label>
                <Select value={pomodoroPreset} onValueChange={setPomodoroPreset}>
                  <SelectTrigger id="pomodoroPreset">
                    <SelectValue placeholder="Select Pomodoro preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2505">25min work / 5min break</SelectItem>
                    <SelectItem value="2510">25min work / 10min break</SelectItem>
                    <SelectItem value="5010">50min work / 10min break</SelectItem>
                    <SelectItem value="6015">60min work / 15min break</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="focusGoal">Daily focus goal</Label>
                <Select value={focusGoal} onValueChange={setFocusGoal}>
                  <SelectTrigger id="focusGoal">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2hours">2 hours</SelectItem>
                    <SelectItem value="4hours">4 hours</SelectItem>
                    <SelectItem value="6hours">6 hours</SelectItem>
                    <SelectItem value="8hours">8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-zenta-purple/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Moon className="h-5 w-5 mr-2 text-zenta-purple" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode">Dark mode</Label>
                <Switch
                  id="darkMode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-zenta-purple/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CloudOff className="h-5 w-5 mr-2 text-zenta-purple" />
                Data & Sync
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="offline">Offline mode</Label>
                <Switch
                  id="offline"
                  checked={offline}
                  onCheckedChange={setOffline}
                />
              </div>
              
              <div className="pt-2 space-y-2">
                <Button variant="outline" className="w-full">Export Data</Button>
                <Button variant="outline" className="w-full">Clear All Data</Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>ZenTa v1.0.0</p>
            <p>©2025 ZenTa Productivity</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
