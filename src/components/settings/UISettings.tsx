
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Palette, Type, Sparkles } from "lucide-react";
import { toast } from "sonner";

const UISettings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedFont, setSelectedFont] = useState("inter");
  const [selectedTemplate, setSelectedTemplate] = useState("default");

  const fontOptions = [
    { value: "inter", label: "Inter", family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
    { value: "roboto", label: "Roboto", family: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif" },
    { value: "playfair", label: "Playfair Display", family: "'Playfair Display', Georgia, serif" },
    { value: "lato", label: "Lato", family: "'Lato', -apple-system, BlinkMacSystemFont, sans-serif" },
    { value: "opensans", label: "Open Sans", family: "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif" },
    { value: "montserrat", label: "Montserrat", family: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif" },
    { value: "poppins", label: "Poppins", family: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif" },
    { value: "sourcesans", label: "Source Sans Pro", family: "'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif" },
    { value: "nunito", label: "Nunito", family: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif" },
    { value: "worksans", label: "Work Sans", family: "'Work Sans', -apple-system, BlinkMacSystemFont, sans-serif" },
    { value: "fira", label: "Fira Sans", family: "'Fira Sans', -apple-system, BlinkMacSystemFont, sans-serif" },
    { value: "ubuntu", label: "Ubuntu", family: "'Ubuntu', -apple-system, BlinkMacSystemFont, sans-serif" },
    { value: "raleway", label: "Raleway", family: "'Raleway', -apple-system, BlinkMacSystemFont, sans-serif" },
    { value: "merriweather", label: "Merriweather", family: "'Merriweather', Georgia, serif" },
    { value: "oswald", label: "Oswald", family: "'Oswald', -apple-system, BlinkMacSystemFont, sans-serif" },
    { value: "dmsans", label: "DM Sans", family: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif" },
  ];

  const templateOptions = [
    { 
      value: "default", 
      label: "Default", 
      description: "Clean and professional design",
      colors: ["#3b82f6", "#e5e7eb", "#ffffff"]
    },
    { 
      value: "glass", 
      label: "Glass Effect", 
      description: "Modern glassmorphism design",
      colors: ["#6366f1", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]
    },
    { 
      value: "minimal", 
      label: "Minimal", 
      description: "Ultra-clean minimal interface",
      colors: ["#000000", "#f8f9fa", "#ffffff"]
    },
    { 
      value: "vibrant", 
      label: "Vibrant", 
      description: "Bold and colorful design",
      colors: ["#ec4899", "#fbbf24", "#8b5cf6"]
    },
    { 
      value: "nature", 
      label: "Nature", 
      description: "Earthy and organic feel",
      colors: ["#059669", "#84cc16", "#eab308"]
    },
    { 
      value: "ocean", 
      label: "Ocean", 
      description: "Cool blue ocean theme",
      colors: ["#0891b2", "#06b6d4", "#67e8f9"]
    }
  ];

  useEffect(() => {
    // Load saved preferences
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const savedFont = localStorage.getItem("selectedFont") || "inter";
    const savedTemplate = localStorage.getItem("selectedTemplate") || "default";

    setIsDarkMode(savedDarkMode);
    setSelectedFont(savedFont);
    setSelectedTemplate(savedTemplate);

    // Apply initial settings
    applyTheme(savedDarkMode);
    applyFont(savedFont);
    applyTemplate(savedTemplate);
  }, []);

  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const loadGoogleFont = (fontValue: string) => {
    const fontUrls = {
      inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
      roboto: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
      playfair: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
      lato: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
      opensans: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap',
      montserrat: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
      poppins: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
      sourcesans: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap',
      nunito: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap',
      worksans: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap',
      fira: 'https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400;500;600;700&display=swap',
      ubuntu: 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap',
      raleway: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap',
      merriweather: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap',
      oswald: 'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap',
      dmsans: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap',
    };

    const fontUrl = fontUrls[fontValue];
    if (!fontUrl) return;

    // Remove existing font link if any
    const existingLink = document.querySelector('link[data-font-family]');
    if (existingLink) {
      existingLink.remove();
    }

    // Add new font link
    const link = document.createElement('link');
    link.href = fontUrl;
    link.rel = 'stylesheet';
    link.setAttribute('data-font-family', fontValue);
    document.head.appendChild(link);
  };

  const applyFont = (fontValue: string) => {
    const font = fontOptions.find(f => f.value === fontValue);
    if (font) {
      // Load Google Font
      loadGoogleFont(fontValue);
      
      // Apply font family
      document.documentElement.style.setProperty("--font-family", font.family);
      document.body.style.fontFamily = font.family;
    }
  };

  const applyTemplate = (template: string) => {
    // Remove existing template classes
    document.documentElement.classList.remove("template-glass", "template-minimal", "template-vibrant", "template-nature", "template-ocean");
    
    // Apply new template class
    if (template !== "default") {
      document.documentElement.classList.add(`template-${template}`);
    }
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem("darkMode", checked.toString());
    applyTheme(checked);
    toast.success(`${checked ? "Dark" : "Light"} mode enabled`);
  };

  const handleFontChange = (fontValue: string) => {
    setSelectedFont(fontValue);
    localStorage.setItem("selectedFont", fontValue);
    applyFont(fontValue);
    toast.success("Font updated successfully");
  };

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    localStorage.setItem("selectedTemplate", template);
    applyTemplate(template);
    toast.success("Template applied successfully");
  };

  return (
    <div className="space-y-6">
      {/* Theme Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Theme Mode
          </CardTitle>
          <CardDescription>Switch between light and dark themes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                {isDarkMode ? "Using dark theme" : "Using light theme"}
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Font Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Typography
          </CardTitle>
          <CardDescription>Choose your preferred font family</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="font-select">Font Family</Label>
              <Select value={selectedFont} onValueChange={handleFontChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.family }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              <p style={{ fontFamily: fontOptions.find(f => f.value === selectedFont)?.family }}>
                The quick brown fox jumps over the lazy dog. 0123456789
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Design Templates
          </CardTitle>
          <CardDescription>Choose from pre-designed themes and effects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templateOptions.map((template) => (
              <div
                key={template.value}
                className={`relative p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate === template.value 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => handleTemplateChange(template.value)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {template.label}
                      {template.value === "glass" && <Sparkles className="h-4 w-4" />}
                      {selectedTemplate === template.value && (
                        <Badge variant="secondary" className="text-xs">Active</Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {template.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reset to Defaults */}
      <Card>
        <CardHeader>
          <CardTitle>Reset Settings</CardTitle>
          <CardDescription>Restore all UI settings to default values</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => {
              setIsDarkMode(false);
              setSelectedFont("inter");
              setSelectedTemplate("default");
              localStorage.removeItem("darkMode");
              localStorage.removeItem("selectedFont");
              localStorage.removeItem("selectedTemplate");
              applyTheme(false);
              applyFont("inter");
              applyTemplate("default");
              toast.success("Settings reset to defaults");
            }}
          >
            Reset to Defaults
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UISettings;
