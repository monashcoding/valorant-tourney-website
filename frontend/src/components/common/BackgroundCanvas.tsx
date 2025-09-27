import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let animationId: number;
    let frameCount = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const particles: Particle[] = [];
    const numParticles = 70; // Optimized count for balance
    const maxDist = 160;
    const triangleMaxDist = 90;
    const lineOpacity = 0.2;
    const triangleOpacity = 0.08;
    const triangleFrameInterval = 3; // Draw triangles every 3 frames

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    const updateParticles = () => {
      particles.forEach((p) => {
        // Gentle random perturbation
        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x <= 0 || p.x >= canvas.width) {
          p.vx *= -0.85;
          p.x = Math.max(0, Math.min(canvas.width, p.x));
        }
        if (p.y <= 0 || p.y >= canvas.height) {
          p.vy *= -0.85;
          p.y = Math.max(0, Math.min(canvas.height, p.y));
        }

        // Light friction
        p.vx *= 0.998;
        p.vy *= 0.998;

        // Cap velocity
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 1.5) {
          p.vx = (p.vx / speed) * 1.5;
          p.vy = (p.vy / speed) * 1.5;
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      frameCount++;

      // Draw lines every frame (no shadow for performance)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0; // No shadow for lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(
            particles[i].x - particles[j].x,
            particles[i].y - particles[j].y
          );
          if (dist < maxDist) {
            ctx.globalAlpha = (1 - dist / maxDist) * lineOpacity;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw triangles only every few frames for optimization
      if (frameCount % triangleFrameInterval === 0) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 0.5;
        ctx.shadowBlur = 0; // No shadow for triangles
        for (let i = 0; i < particles.length - 2; i++) {
          for (let j = i + 1; j < particles.length - 1; j++) {
            const d1 = Math.hypot(
              particles[i].x - particles[j].x,
              particles[i].y - particles[j].y
            );
            if (d1 > triangleMaxDist) continue;
            for (let k = j + 1; k < particles.length; k++) {
              const d2 = Math.hypot(
                particles[j].x - particles[k].x,
                particles[j].y - particles[k].y
              );
              const d3 = Math.hypot(
                particles[k].x - particles[i].x,
                particles[k].y - particles[i].y
              );
              if (d2 < triangleMaxDist && d3 < triangleMaxDist) {
                const avgDist = (d1 + d2 + d3) / 3;
                ctx.globalAlpha =
                  triangleOpacity * (1 - avgDist / triangleMaxDist);
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.lineTo(particles[k].x, particles[k].y);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
              }
            }
          }
        }
      }

      // Draw particles with shadow
      ctx.shadowBlur = 15;
      ctx.shadowColor = "white";

      particles.forEach((p) => {
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * 4
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.5)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      updateParticles();
      draw();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resizeCanvas();
      particles.forEach((p) => {
        p.x = Math.random() * canvas.width;
        p.y = Math.random() * canvas.height;
        p.vx = (Math.random() - 0.5) * 0.4;
        p.vy = (Math.random() - 0.5) * 0.4;
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
};

export default BackgroundCanvas;
