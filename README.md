# Persona 5 Royal - Save File Fusion Calculator

A fully client-side web application that decrypts Persona 5 Royal save files, extracts your persona inventory, and calculates optimal fusion paths to create any persona you want.

## Features

- **In-Browser Decryption**: Decrypt P5R save files (DATA.DAT) entirely in your browser using AES-256-CBC
- **Persona Extraction**: Automatically identifies all personas in your compendium and inventory
- **Fusion Calculation**: Find all possible fusion recipes to create any target persona
- **Optimal Pathfinding**: Shows fusion paths using only personas you already own
- **Privacy First**: All processing happens client-side - your save file never leaves your computer
- **Static Deployment**: No backend required - can be hosted anywhere

## Important: P5R Only

This tool is designed specifically for **Persona 5 Royal** (2019 PS4, 2022 PC/Switch/Xbox). The original Persona 5 (2016) uses a different save format and is **not supported**.

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/P5R-fusion-calc.git
cd P5R-fusion-calc/p5r-fusion-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. **Locate Your Save File**
   - Steam: `%appdata%/sega/P5R/`
   - Other platforms: Check your game's save directory
   - Look for `DATA.DAT` or similar encrypted save file

2. **Upload to the App**
   - Open the web app
   - Upload your encrypted `DATA.DAT` file
   - The app will decrypt and extract your persona inventory automatically

3. **Calculate Fusions**
   - Search for any persona you want to create
   - View all possible fusion recipes
   - See which combinations use personas you already own

## How It Works

### Save File Decryption

The app decrypts P5R save files using:
- **AES-256-CBC encryption** with known game key
- **zlib decompression** for save data
- **CRC32 checksums** for validation

All decryption happens in-browser using `crypto-js`, `pako`, and `crc-32`.

### Persona Extraction

Personas are identified by scanning for the hex pattern `0x01-00-##-##` or `0x01-08-##-##` at 16-byte aligned offsets where `##-##` is the persona UID in little-endian format. The scanner:
- Searches specific memory range: `0x4000-0x9FFF`
- Maps UIDs to persona names using a pre-built dictionary

### Fusion Calculation

The fusion calculator uses a breadth-first search (BFS) algorithm to:
- Build a graph of all possible fusion combinations
- Find the shortest path from owned personas to target
- Support normal, rare, and special fusion recipes
- Calculate fusion costs

## Project Structure

```
p5r-fusion-calculator/
├── src/
│   ├── components/          # React UI components
│   ├── data/                # Persona UID dictionaries
│   ├── fusion-calculator-core/  # Core fusion logic (Apache Licensed)
│   │   ├── data/            # P5R persona data and fusion recipes
│   │   ├── FusionCalculator.js
│   │   └── DataUtil.js
│   └── utils/               # Decryption and extraction utilities
├── public/                  # Static assets
└── package.json
```

## Building for Production

```bash
npm run build
```

This generates static files in `dist/` that can be deployed to:
- GitHub Pages
- Vercel
- Netlify
- Any static file host
- Your own VPS with nginx

## Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **crypto-js** - AES-256-CBC decryption
- **pako** - zlib decompression
- **crc-32** - Checksum validation

## Known Limitations

- DLC personas are included by default

## Example Save Files

The `example saves/` directory contains sample encrypted and decrypted save files for testing purposes.

## Development

```bash
# Run development server
npm run dev

# Lint code
npm run lint

# Preview production build
npm run build && npm run preview
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

### Third-Party Code Attribution

The fusion calculation engine (`src/fusion-calculator-core/`) is based on the Persona 5 fusion calculator originally created by Chin (chinhodado) and is licensed under the Apache License 2.0.

Original work:
- Copyright 2013, Anthony Lieuallen
- Based on https://github.com/chinhodado/persona5_calculator
- See `src/fusion-calculator-core/LICENSE` for full license text

All other code:
- Copyright 2025, Eric Peterson

## Credits

- **Fusion Calculator Core**: Based on work by Chin (chinhodado) and Anthony Lieuallen
- **Persona Data**: Derived from https://github.com/aqiu384/aqiu384.github.io/
- **Save File Format**: Reverse-engineered from Persona 5 Royal save files
- **UID Mappings**: https://amicitia.miraheze.org/wiki/Persona_5_Royal/Personas

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This is a fan-made tool and is not affiliated with or endorsed by Atlus or Sega. Persona 5 Royal and all related trademarks are property of their respective owners.
