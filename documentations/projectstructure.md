# Project Gantt - Vue 3 + Vite Structure

## Project Structure

```
project-gantt/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css
│   ├── components/
│   │   ├── ui/              # shadcn-vue components
│   │   │   ├── button/
│   │   │   ├── dialog/
│   │   │   ├── input/
│   │   │   ├── select/
│   │   │   ├── card/
│   │   │   └── ...
│   │   ├── gantt/
│   │   │   ├── GanttChart.vue
│   │   │   ├── GanttTask.vue
│   │   │   ├── GanttTimeline.vue
│   │   │   └── TaskDialog.vue
│   │   ├── google-drive/
│   │   │   ├── DriveFilePicker.vue
│   │   │   ├── DriveFileList.vue
│   │   │   └── GoogleAuthButton.vue
│   │   ├── local/
│   │   │   └── LocalFilePicker.vue
│   │   ├── layout/
│   │   │   ├── Header.vue
│   │   │   ├── Toolbar.vue
│   │   │   ├── Sidebar.vue
│   │   │   ├── AdSpace.vue
│   │   │   └── SettingsDialog.vue
│   │   └── ColorPicker.vue
│   ├── composables/
│   │   ├── useGoogleAuth.ts
│   │   ├── useGoogleDrive.ts
│   │   └── useGanttChart.ts      # NEW: Gantt utilities
│   ├── stores/
│   │   ├── gantt.js
│   │   ├── auth.js
│   │   └── settings.js
│   ├── utils/
│   │   ├── dateHelpers.js
│   │   ├── colorSchemes.js
│   │   └── fileHelpers.js
│   ├── lib/
│   │   └── utils.js         # shadcn-vue utility
│   ├── App.vue
│   ├── main.js
│   └── router.js
├── .env.example
├── .gitignore
├── components.json          # shadcn-vue config
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Installation Steps

```bash
# 1. Create Vite project
npm create vite@latest project-gantt -- --template vue
cd project-gantt

# 2. Install dependencies
npm install

# 3. Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Install shadcn-vue dependencies
npm install radix-vue class-variance-authority clsx tailwind-merge lucide-vue-next

# 5. Initialize shadcn-vue
npx shadcn-vue@latest init

# 6. Install Google APIs
npm install gapi-script
npm install -D @types/gapi @types/gapi.auth2 @types/gapi.client.drive

# 7. Install additional utilities
npm install date-fns pinia @vueuse/core vue-draggable-plus

# 8. Install shadcn-vue components (as needed)
npx shadcn-vue@latest add button
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add input
npx shadcn-vue@latest add select
npx shadcn-vue@latest add card
npx shadcn-vue@latest add dropdown-menu
npx shadcn-vue@latest add separator
npx shadcn-vue@latest add tooltip
npx shadcn-vue@latest add tabs
npx shadcn-vue@latest add label
npx shadcn-vue@latest add textarea
npx shadcn-vue@latest add popover
```

## Key Configuration Files

### package.json
```json
{
  "name": "project-gantt",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "pinia": "^2.1.7",
    "radix-vue": "^1.9.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0",
    "lucide-vue-next": "^0.390.0",
    "gapi-script": "^1.2.0",
    "date-fns": "^3.6.0",
    "@vueuse/core": "^10.11.0",
    "vue-draggable-plus": "^0.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.2.0",
    "vue-tsc": "^2.0.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.38",
    "autoprefixer": "^10.4.19",
    "@types/node": "^20.12.0",
    "@types/gapi": "^0.0.47",
    "@types/gapi.auth2": "^0.0.60",
    "@types/gapi.client.drive": "^3.0.22"
  }
}
```

### vite.config.js
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### tsconfig.node.json
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

### .env.example
```
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your-api-key-here
VITE_GOOGLE_APP_ID=your-app-id-here
```

## Next Steps

1. Copy the code files I'll provide next for each component
2. Set up your Google Cloud Console project
3. Add your credentials to `.env.local`
4. Run `npm run dev` to start development

Would you like me to provide the actual component code files next?
