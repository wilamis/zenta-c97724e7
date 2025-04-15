
import { useState } from 'react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { SheetHeader, SheetTitle } from '../ui/sheet';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useLanguage } from '@/context/LanguageContext';

const FocusSettings = () => {
  const { t } = useLanguage();
  const [blockNotifications, setBlockNotifications] = useState(true);
  const [enableSoundEffects, setEnableSoundEffects] = useState(true);
  const [soundVolume, setSoundVolume] = useState([60]);
  const [focusGoal, setFocusGoal] = useState('4hours');
  const [autoBreak, setAutoBreak] = useState(true);
  
  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle>{t('focusSettings.title')}</SheetTitle>
      </SheetHeader>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="blockNotifications">{t('focusSettings.blockNotifications')}</Label>
          <Switch
            id="blockNotifications"
            checked={blockNotifications}
            onCheckedChange={setBlockNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="enableSoundEffects">{t('focusSettings.soundEffects')}</Label>
          <Switch
            id="enableSoundEffects"
            checked={enableSoundEffects}
            onCheckedChange={setEnableSoundEffects}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="soundVolume">{t('focusSettings.soundVolume')}</Label>
          <Slider
            id="soundVolume"
            value={soundVolume}
            min={0}
            max={100}
            step={1}
            onValueChange={setSoundVolume}
            disabled={!enableSoundEffects}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="focusGoal">{t('focusSettings.dailyFocusGoal')}</Label>
          <Select value={focusGoal} onValueChange={setFocusGoal}>
            <SelectTrigger className="w-full">
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
        
        <div className="flex items-center justify-between">
          <Label htmlFor="autoBreak">{t('focusSettings.autoScheduleBreaks')}</Label>
          <Switch
            id="autoBreak"
            checked={autoBreak}
            onCheckedChange={setAutoBreak}
          />
        </div>
      </div>
      
      <Button className="w-full">{t('focusSettings.saveSettings')}</Button>
    </div>
  );
};

export default FocusSettings;
