import React from 'react';
import { Warp } from "@paper-design/shaders-react";

export default function WarpShaderHero({ children }) {
    return (
        <main style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', width: '100%' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                <Warp
                    style={{ height: "100%", width: "100%" }}
                    proportion={0.45}
                    softness={1}
                    distortion={0.25}
                    swirl={0.8}
                    swirlIterations={10}
                    shape="checks"
                    shapeScale={0.1}
                    scale={1}
                    rotation={0}
                    speed={1}
                    colors={["hsl(200, 100%, 20%)", "hsl(160, 100%, 75%)", "hsl(180, 90%, 30%)", "hsl(170, 100%, 80%)"]}
                />
            </div>

            <div style={{
                position: 'relative',
                zIndex: 10,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 2rem'
            }}>
                <div style={{
                    maxWidth: '56rem',
                    width: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem'
                }}>
                    {/* 
               If children are provided, render them. 
               This allows dynamic content injection while keeping the shader background layout.
            */}
                    {children}
                </div>
            </div>
        </main>
    )
}
