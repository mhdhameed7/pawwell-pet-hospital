# Start Pawwell on your computer

## 1. Install Node.js

Use Node.js 22.12 or newer (Node.js 24 is suitable). npm is included with Node.js.

## 2. Extract the ZIP

Extract all files. Open the `pawwell-pet-hospital` folder in your code editor.
If using VS Code, select **Terminal > New Terminal**. Make sure your terminal is
in the folder containing `package.json`.

## 3. Install the dependencies

```sh
npm ci
```

An internet connection is required for this first installation.

## 4. Start the project

```sh
npm run dev
```

Open http://localhost:4173 in your browser. Keep the terminal running.
Press Ctrl+C in the terminal when you want to stop the server.
Do not open `index.html` directly by double-clicking it; use the local server.

## Edit the project

- Page sections: `src/App.jsx`
- Colors, spacing, and responsive styles: `src/styles.css`
- Reveal and hover animations: `src/components/Motion.jsx`
- Booking form: `src/components/Booking.jsx`
- Service content: `src/data.js`
- Images, fonts, and icons: `public/assets/`

Save your changes and the development server updates the browser automatically.

## Other commands

```sh
npm test
npm run build
npm run preview
```

`npm run build` produces the deployable website in `dist/`. Run
`npm run preview` after building to view that production build locally.

## Included and excluded

This download includes the complete React source, dependency lockfile, tests,
images, and fonts. Dependencies (`node_modules`), Git history, the generated
build, and the original hosted Site's configuration are excluded. The commands
above recreate the dependencies and build.

This is a frontend demonstration. Appointment requests are sample data stored
in your browser; no real appointments or emails are sent.
