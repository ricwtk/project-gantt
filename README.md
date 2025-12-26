# Project Gantt - Vue 3 Modern Edition

A modern Gantt chart editor built with Vue 3, Vite, shadcn-vue, Tailwind CSS, and Google Drive integration.

## Features

- ✨ Modern UI with shadcn-vue components
- 📊 Interactive Gantt chart visualization
- 🔐 Google Drive authentication and file storage
- 📴 **Offline mode** - Work without signing in
- 💾 **Download/Upload** - Save and load .pgjson files locally
- 📁 Hierarchical task management with subtasks
- 📊 **Multiple charts** - Organize complex projects with multiple Gantt charts per file
- 🎨 Customizable color schemes
- 📅 Flexible date formatting
- 📱 Responsive design
- 💰 **Monetization ready** - Carbon Ads + Ko-fi integration
- 📘 **Full TypeScript** - Type-safe codebase with excellent IDE support

## Prerequisites

- Node.js 18+ and npm
- Google Cloud Console project with Drive API enabled
- Modern web browser

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url> project-gantt
cd project-gantt
npm install
```

### 2. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Drive API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Drive API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - Your production domain
   - Add authorized redirect URIs (same URLs)
   - Copy your **Client ID**

5. Create an API Key:
   - Click "Create Credentials" → "API Key"
   - Copy your **API Key**

### 3. Environment Configuration

Create a `.env.local` file in the project root:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your-api-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. (Optional) Configure Monetization

To enable Carbon Ads and Ko-fi support:

**Set up Ko-fi:**
1. Create account at https://ko-fi.com/
2. Update your Ko-fi username in `src/components/layout/AdSpace.vue`

**Apply for Carbon Ads:**
1. Apply at https://www.carbonads.net/
2. After approval, update Zone ID in `src/components/layout/AdSpace.vue`

See `docs/Ads-Setup-Guide.md` for detailed instructions.

## Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn-vue components
│   ├── gantt/                 # Gantt chart components
│   │   ├── GanttChart.vue
│   │   ├── GanttTask.vue
│   │   ├── GanttTimeline.vue
│   │   └── TaskDialog.vue
│   ├── google-drive/          # Google Drive components
│   │   └── DriveFilePicker.vue
│   └── layout/                # Layout components
│       ├── Header.vue
│       ├── Toolbar.vue
│       └── SettingsDialog.vue
├── composables/               # Reusable logic
│   ├── useGoogleAuth.js
│   ├── useGoogleDrive.js
│   └── useGanttChart.js
├── stores/                    # Pinia stores
│   ├── auth.js
│   ├── gantt.js
│   └── settings.js
└── utils/                     # Utility functions
```

## Usage

### Working Modes

**Offline Mode (Default)**
- Start using immediately without signing in
- All features available except Google Drive sync
- Save/load files locally using Download/Upload buttons
- Perfect for quick projects or privacy-focused users

**Online Mode (with Google Sign-In)**
- Sign in to enable Google Drive integration
- Auto-save to Google Drive
- Access files from anywhere
- Share and collaborate

### Authentication

1. Click "Sign In with Google" in the header (optional)
2. Grant permissions to access Google Drive
3. You're ready to save to the cloud!

### Creating a Gantt Chart

1. Click "New Chart" to create additional Gantt charts in the same file
2. Switch between charts using the tabs
3. Click "Add Task" to create a new task in the active chart
4. Fill in task details:
   - Task name
   - Description
   - Planned start/end dates
   - Actual start/end dates (optional)
5. Click "Save"

### Working with Multiple Charts

- **Create Chart**: Click "New Chart" button
- **Switch Charts**: Click on chart tabs
- **Rename Chart**: Click ⋮ menu → "Rename"
- **Duplicate Chart**: Click ⋮ menu → "Duplicate"
- **Delete Chart**: Click ⋮ menu → "Delete" (requires at least one chart)

**Use cases for multiple charts:**
- Different project phases (Planning, Execution, Review)
- Multiple teams or departments
- Different timelines or scenarios
- Before/after comparisons

### Working with Tasks

- **Add Subtask**: Click the "+" button on any task
- **Edit Task**: Click the edit icon
- **Delete Task**: Click the trash icon
- **Collapse/Expand**: Click the chevron for tasks with subtasks

### File Operations

**Creating New Files**
- Click "New" to start fresh
- Any unsaved changes will prompt for confirmation

**Opening Files**

*Offline Mode:*
- Click "Open" → Select .pgjson file from your computer
- Or drag and drop files into the dialog

*Online Mode:*
- Click "Open" → Browse Google Drive
- Navigate folders and select .pgjson files

**Saving Files**

*Offline Mode:*
- Click "Save" or "Download" to save locally
- Choose filename and location

*Online Mode:*
- Click "Save" to update existing Drive file
- Click "Save As" to create a new Drive file
- Click "Download" for a local backup

**Uploading Files**
- Click "Upload" to load a .pgjson file
- Or drag and drop directly into the Open dialog

### Settings

Access via Settings button in toolbar:
- Change Gantt chart name
- Customize date format
- Select color scheme

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to GitHub Pages

```bash
npm run build
# Deploy the dist/ directory to your hosting service
```

### Update `vite.config.js` for production

```javascript
export default defineConfig({
  base: '/project-gantt/', // Your repo name
  // ... rest of config
})
```

## Key Technologies

- **Vue 3**: Composition API with TypeScript, reactive framework
- **TypeScript**: Full type safety and excellent developer experience
- **Vite**: Fast build tool and dev server
- **shadcn-vue**: Beautiful, accessible component library
- **Tailwind CSS**: Utility-first CSS framework
- **Pinia**: State management with TypeScript support
- **Google Drive API**: File storage and sync
- **date-fns**: Modern date utility library

## File Format

Project files are saved as `.pgjson` with the following structure:

```json
{
  "charts": [
    {
      "id": "chart_xxx",
      "name": "Project Phase 1",
      "tasks": [
        {
          "id": "task_xxx",
          "name": "Task Name",
          "description": "Task description",
          "planned": ["2025-01-01", "2025-01-15"],
          "actual": ["2025-01-02", "2025-01-14"],
          "subtasks": [],
          "collapsed": false,
          "color": null
        }
      ]
    },
    {
      "id": "chart_yyy",
      "name": "Project Phase 2",
      "tasks": [...]
    }
  ],
  "activeChartId": "chart_xxx"
}
```

**Legacy format support**: Files with single chart format (without `charts` array) are automatically converted.

## Troubleshooting

### "This app isn't verified" warning

- Add yourself as a test user in Google Cloud Console
- Or go through Google's verification process for public apps

### Files not loading

- Check console for CORS errors
- Verify API credentials are correct
- Ensure Drive API is enabled

### Authentication issues

- Clear browser cache and cookies
- Check redirect URIs match exactly
- Verify OAuth consent screen is configured

### Offline mode issues

- **Can't sign in**: Check Google API credentials in `.env.local`
- **Want to work offline**: Just skip sign-in, all features work locally
- **Lost work**: Use Download regularly to backup your work

### File format issues

- **Can't open file**: Ensure it's a valid .pgjson file
- **Invalid format error**: File may be corrupted or wrong type
- **Upload fails**: Check file size and format

## Development Tips

### Adding shadcn-vue Components

```bash
npx shadcn-vue@latest add [component-name]
```

### Hot Module Replacement

Vite provides instant HMR. Changes reflect immediately during development.

### State Management

Use Pinia stores for global state. All stores are in `src/stores/`.

## License

MIT License - feel free to use this project for any purpose.

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review Google Drive API docs

---

Built with ❤️ using Vue 3, Vite, and shadcn-vue
