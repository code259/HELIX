# HELIX - Computational Discovery Platform

HELIX is a predictive and generative platform designed for the discovery of highly selective RecA inhibitors. This repository contains the source code for the public-facing HELIX static website, which serves as a searchable database of generated candidates and an interface for conceptualizing the ML pipeline.

## Features
- **Compound Database**: Explore 250,000+ top generated compounds evaluated by our predicting pipeline (top 5,000 embedded for browser performance).
- **Structure Rendering**: Visualizes 2D molecular structures in the browser using the open-source SmilesDrawer library.
- **Evaluation Simulation**: Simulates the pipeline interface for evaluating raw novel SMILES or batch `.csv/.smi` inputs.
- **Scientific Methodology**: A complete breakdown of the target approach, generative methodology (LCG-VAE), and predictive selection thresholds.
- **Results Showcase**: Features the top 61 compounds with 10x structural selectivity improvements over existing Rad51 analogs without sacrificing pIC50.

## Tech Stack
- **Framework**: React / Vite
- **Styling**: Vanilla CSS with a bespoke, componentized design system.
- **Routing**: React Router
- **Data Parsing**: PapaParse (for client-side CSV parsing)
- **Icons**: Lucide React
- **Cheminformatics**: SmilesDrawer (for SMILES rendering)

## Local Development & Setup

This is a Vite-powered React project tailored for deployment on GitHub Pages.

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Installation

1. Clone this repository (or navigate to the project directory).
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### Building for Production / GitHub Pages

The application is configured to build relative paths (`base: './'`) to seamlessly support GitHub Pages.

To build the static HTML/JS/CSS bundle:
```bash
npm run build
```

This will output a `dist` directory. You can serve this directory using any static file server or commit its contents directly to a `gh-pages` branch for deployment.

### File Structure & Data Loading
- **`/public/data`**: Contains the raw CSV and Pickle files. Due to browser limitations, the `.pkl` files (sklearn ExtraTrees Regressor) are not parsed directly in the UI. Instead, the UI simulates model response while `PapaParse` dynamically loads the top candidates from `reca_inference_predictions copy.csv` into the Data Grid.

## License & Citation
For scientific or educational inquiries regarding the LCG-VAE and predictive components underlying the data shown, please refer to the project documentation.
