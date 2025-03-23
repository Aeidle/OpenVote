# Blockchain E-Voting System

A secure and transparent voting platform built with Next.js, TypeScript, and Blockchain technology. This system enables secure electronic voting with real-time result verification and tamper-proof record keeping.

## Features

- 🔒 Secure blockchain-based voting
- 📊 Real-time election results
- 👥 User-friendly admin and voter interfaces
- 📱 Responsive design for all devices
- ⚡ Fast and modern UI with Next.js
- 🎨 Beautiful styling with Tailwind CSS

## Prerequisites

Before you begin, ensure you have installed:
- Git
- Node Version Manager (nvm)
- Yarn package manager

## Installation

### Installing NVM

#### For Ubuntu/Linux:

1. Update your package list:
```bash
sudo apt update
```

2. Install build essentials:
```bash
sudo apt install build-essential
```

3. Download and run the NVM installation script:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

4. Add these lines to your ~/.bashrc file:
```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

5. Reload your terminal configuration:
```bash
source ~/.bashrc
```

#### For Windows:

1. Download and install nvm-windows from the [official releases page](https://github.com/coreybutler/nvm-windows/releases)
2. Run the installer (nvm-setup.exe)
3. Open a new PowerShell or Command Prompt as Administrator

### Installing Yarn

After installing Node.js, install Yarn globally:

```bash
npm install -g yarn
```

### Setting Up the Project

1. Install Node.js v22.12.0:
```bash
nvm install 22.12.0
nvm use 22.12.0
```

2. Clone the repository:
```bash
git clone https://github.com/Aeidle/OpenVote.git
cd blockchain-e-voting-system
```

3. Install dependencies:
```bash
yarn install
```

### Setting Up Tailwind CSS

1. Install Tailwind CSS and its dependencies:
```bash
yarn add -D tailwindcss postcss autoprefixer
```

2. Generate Tailwind CSS and PostCSS configuration files:
```bash
npx tailwindcss init -p
```

If the above command doesn't work directly, try the following:
```bash
yarn add tailwindcss@^1
npx tailwindcss init -p
```

3. Configure your template paths in `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

4. Add Tailwind directives to your `./src/styles/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Running the Application

1. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

2. Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
blockchain-e-voting-system/
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── CreateElectionForm.tsx
│   │   │   ├── ManageCandidates.tsx
│   │   │   └── ViewResults.tsx
│   │   ├── Voter/
│   │   │   ├── Register.tsx
│   │   │   ├── CastVote.tsx
│   │   │   └── ElectionStatus.tsx
│   │   └── Shared/
│   │       ├── Layout.tsx
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── index.tsx
│   │   │   ├── create-election.tsx
│   │   │   ├── manage-candidates.tsx
│   │   │   └── view-results.tsx
│   │   ├── voter/
│   │   │   ├── index.tsx
│   │   │   ├── register.tsx
│   │   │   ├── cast-vote.tsx
│   │   │   └── election-status.tsx
│   │   └── index.tsx
│   └── styles/
│       └── globals.css
├── public/
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## Available Scripts

- `yarn dev` - Start the development server
- `yarn build` - Build the application for production
- `yarn start` - Start the production server
- `yarn lint` - Run ESLint
- `yarn type-check` - Run TypeScript compiler check

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- The blockchain community for inspiration and support
