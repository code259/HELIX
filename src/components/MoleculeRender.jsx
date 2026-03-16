import React, { useEffect, useRef } from 'react';
import SmilesDrawer from 'smiles-drawer';

export default function MoleculeRender({ smiles, width = 200, height = 150, id }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!smiles || !canvasRef.current) return;

    try {
      const drawer = new SmilesDrawer.Drawer({ 
        width, 
        height,
        padding: 5,
        themes: {
          light: {
            C: '#1a365d',
            O: '#e53e3e',
            N: '#3182ce',
            F: '#38a169',
            Cl: '#38a169',
            Br: '#805ad5',
            I: '#805ad5',
            P: '#dd6b20',
            S: '#d69e2e',
            B: '#e53e3e',
            Si: '#e53e3e',
            H: '#718096',
            BACKGROUND: 'transparent'
          }
        }
      });

      SmilesDrawer.parse(smiles, (tree) => {
        drawer.draw(tree, canvasRef.current, 'light', false);
      }, (err) => {
        console.error("Error parsing SMILES:", smiles, err);
      });
    } catch (e) {
      console.error("SmilesDrawer initialization error:", e);
    }
  }, [smiles, width, height]);

  return (
    <canvas 
      ref={canvasRef} 
      id={id}
      width={width} 
      height={height}
      style={{ display: 'block', margin: '0 auto' }}
    />
  );
}
