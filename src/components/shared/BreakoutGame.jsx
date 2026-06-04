"use client";
import { useRef, useEffect, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const W = 480;
const H = 320;
const PADDLE_W = 72;
const PADDLE_H = 8;
const PADDLE_Y = H - 30;
const BALL_SIZE = 8;
const BALL_SPEED = 270;
const PADDLE_SPEED = 360;
const BRICK_COLS = 8;
const BRICK_ROWS = 4;
const BRICK_GAP = 3;
const BRICK_TOP = 44;
const HEADER_H = 28;

const FONT_LARGE = "bold 26px 'Courier New', monospace";
const FONT_MED   = "bold 13px 'Courier New', monospace";
const FONT_SMALL = "bold 10px 'Courier New', monospace";
const FONT_SCORE = "bold 12px 'Courier New', monospace";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildBricks() {
  const brickW = Math.floor((W - BRICK_GAP * (BRICK_COLS + 1)) / BRICK_COLS);
  const brickH = 12;
  const bricks = [];
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({
        x: BRICK_GAP + c * (brickW + BRICK_GAP),
        y: BRICK_TOP + r * (brickH + BRICK_GAP),
        w: brickW,
        h: brickH,
        alive: true,
      });
    }
  }
  return bricks;
}

function initialState() {
  const totalBricks = BRICK_COLS * BRICK_ROWS;
  return {
    paddle: { x: W / 2 - PADDLE_W / 2 },
    ball: {
      x: W / 2 - BALL_SIZE / 2,
      y: PADDLE_Y - BALL_SIZE - 4,
      dx: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
      dy: -BALL_SPEED,
    },
    bricks: buildBricks(),
    phase: "idle",   // idle | playing | won | lost
    score: 0,
    totalBricks,
  };
}

// ─── Drawing ──────────────────────────────────────────────────────────────────

function drawBrick(ctx, b) {
  // Main fill
  ctx.fillStyle = "#111";
  ctx.fillRect(b.x, b.y, b.w, b.h);
  // Top highlight
  ctx.fillStyle = "#fff";
  ctx.fillRect(b.x + 1, b.y + 1, b.w - 2, 1);
  // Left highlight
  ctx.fillRect(b.x + 1, b.y + 2, 1, b.h - 3);
  // Bottom shadow
  ctx.fillStyle = "#000";
  ctx.fillRect(b.x + 1, b.y + b.h - 1, b.w - 1, 1);
  // Right shadow
  ctx.fillRect(b.x + b.w - 1, b.y + 1, 1, b.h - 1);
}

function drawDotGrid(ctx) {
  ctx.fillStyle = "rgba(0,0,0,0.06)";
  for (let gx = 4; gx < W; gx += 8) {
    for (let gy = HEADER_H + 4; gy < H; gy += 8) {
      ctx.fillRect(gx, gy, 1, 1);
    }
  }
}

function drawHeader(ctx, score, total) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, HEADER_H);

  // Pixel divider line
  ctx.fillStyle = "#000";
  for (let x = 0; x < W; x += 6) ctx.fillRect(x, HEADER_H - 1, 4, 1);

  ctx.font = FONT_SCORE;
  ctx.textBaseline = "middle";

  ctx.textAlign = "left";
  ctx.fillStyle = "#000";
  ctx.fillText("HI-SCORE", 12, HEADER_H / 2);

  ctx.textAlign = "right";
  ctx.fillText(`${score} / ${total}`, W - 12, HEADER_H / 2);
}

function drawPixelText(ctx, lines, centerY, color = "#000") {
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  lines.forEach(({ text, font, dy }) => {
    ctx.font = font;
    ctx.fillText(text, W / 2, centerY + dy);
  });
}

function drawOverlay(ctx) {
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.fillRect(0, HEADER_H, W, H - HEADER_H);
}

function draw(ctx, state, timestamp) {
  // ── Background ──
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, H);

  drawDotGrid(ctx);
  drawHeader(ctx, state.score, state.totalBricks);

  // ── Bricks ──
  state.bricks.forEach((b) => { if (b.alive) drawBrick(ctx, b); });

  // ── Paddle ──
  ctx.fillStyle = "#000";
  ctx.fillRect(state.paddle.x, PADDLE_Y, PADDLE_W, PADDLE_H);
  ctx.fillStyle = "#fff";
  ctx.fillRect(state.paddle.x + 1, PADDLE_Y + 1, PADDLE_W - 2, 2);

  // ── Ball ──
  ctx.fillStyle = "#000";
  ctx.fillRect(state.ball.x, state.ball.y, BALL_SIZE, BALL_SIZE);
  // Small pixel glint
  ctx.fillStyle = "#fff";
  ctx.fillRect(state.ball.x + 1, state.ball.y + 1, 2, 2);

  // ── Phase overlays ──
  const blink = Math.floor(timestamp / 600) % 2 === 0;
  const mid = H / 2 + 10;

  if (state.phase === "idle") {
    drawOverlay(ctx);
    drawPixelText(ctx, [
      { text: "BREAKOUT", font: FONT_LARGE, dy: -28 },
    ], mid);
    if (blink) {
      drawPixelText(ctx, [
        { text: "CLICK  OR  SPACE  TO  PLAY", font: FONT_SMALL, dy: 8 },
      ], mid, "#555");
    }
    drawPixelText(ctx, [
      { text: "MOVE:  MOUSE  /  ARROW  KEYS", font: FONT_SMALL, dy: 34 },
    ], mid, "#aaa");
  }

  if (state.phase === "lost") {
    drawOverlay(ctx);
    drawPixelText(ctx, [
      { text: "GAME  OVER", font: FONT_LARGE, dy: -28 },
      { text: `SCORE:  ${state.score}`, font: FONT_MED, dy: 8 },
    ], mid);
    if (blink) {
      drawPixelText(ctx, [
        { text: "CLICK  OR  SPACE  TO  RETRY", font: FONT_SMALL, dy: 34 },
      ], mid, "#555");
    }
  }

  if (state.phase === "won") {
    drawOverlay(ctx);
    drawPixelText(ctx, [
      { text: "YOU  WIN!", font: FONT_LARGE, dy: -28 },
      { text: `SCORE:  ${state.score}`, font: FONT_MED, dy: 8 },
    ], mid);
    if (blink) {
      drawPixelText(ctx, [
        { text: "CLICK  OR  SPACE  TO  PLAY  AGAIN", font: FONT_SMALL, dy: 34 },
      ], mid, "#555");
    }
  }

  // ── Outer border ──
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BreakoutGame() {
  const canvasRef   = useRef(null);
  const stateRef    = useRef(initialState());
  const rafRef      = useRef(null);
  const keysRef     = useRef({ left: false, right: false });
  const resetLastTimeRef = useRef(null);

  const start = useCallback(() => {
    stateRef.current = initialState();
    stateRef.current.phase = "playing";
    resetLastTimeRef.current?.();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let lastTime = null;
    const resetLastTime = () => { lastTime = null; };
    resetLastTimeRef.current = resetLastTime;

    function loop(timestamp) {
      const dt = lastTime === null ? 0 : Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      const s   = stateRef.current;
      const keys = keysRef.current;

      if (s.phase === "playing") {
        // Paddle
        if (keys.left)  s.paddle.x = Math.max(0, s.paddle.x - PADDLE_SPEED * dt);
        if (keys.right) s.paddle.x = Math.min(W - PADDLE_W, s.paddle.x + PADDLE_SPEED * dt);

        // Ball movement
        s.ball.x += s.ball.dx * dt;
        s.ball.y += s.ball.dy * dt;

        // Wall bounces
        if (s.ball.x < 0)                { s.ball.x = 0;              s.ball.dx *= -1; }
        if (s.ball.x + BALL_SIZE > W)    { s.ball.x = W - BALL_SIZE;  s.ball.dx *= -1; }
        if (s.ball.y < HEADER_H)         { s.ball.y = HEADER_H;       s.ball.dy *= -1; }

        // Paddle collision (AABB)
        const ballCX = s.ball.x + BALL_SIZE / 2;
        if (
          s.ball.dy > 0 &&
          s.ball.y + BALL_SIZE >= PADDLE_Y &&
          s.ball.y <= PADDLE_Y + PADDLE_H &&
          s.ball.x + BALL_SIZE >= s.paddle.x &&
          s.ball.x <= s.paddle.x + PADDLE_W
        ) {
          const hit   = (ballCX - (s.paddle.x + PADDLE_W / 2)) / (PADDLE_W / 2);
          const angle = hit * (Math.PI / 3);
          const speed = Math.hypot(s.ball.dx, s.ball.dy);
          s.ball.dx   = speed * Math.sin(angle);
          s.ball.dy   = -Math.abs(speed * Math.cos(angle));
          s.ball.y    = PADDLE_Y - BALL_SIZE - 1;
        }

        // Bottom → lose
        if (s.ball.y > H) {
          s.phase = "lost";
        }

        // Brick collisions (AABB)
        for (const b of s.bricks) {
          if (!b.alive) continue;
          if (
            s.ball.x + BALL_SIZE > b.x &&
            s.ball.x < b.x + b.w &&
            s.ball.y + BALL_SIZE > b.y &&
            s.ball.y < b.y + b.h
          ) {
            b.alive = false;
            s.score++;
            const overlapLeft   = s.ball.x + BALL_SIZE - b.x;
            const overlapRight  = b.x + b.w - s.ball.x;
            const overlapTop    = s.ball.y + BALL_SIZE - b.y;
            const overlapBottom = b.y + b.h - s.ball.y;
            const minH = Math.min(overlapLeft, overlapRight);
            const minV = Math.min(overlapTop, overlapBottom);
            if (minH < minV) s.ball.dx *= -1; else s.ball.dy *= -1;
            break;
          }
        }

        if (s.bricks.every((b) => !b.alive)) s.phase = "won";
      }

      draw(ctx, s, timestamp);
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    // ── Input ──
    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft")  keysRef.current.left  = true;
      if (e.key === "ArrowRight") keysRef.current.right = true;
      if (e.key === " ") {
        if (stateRef.current.phase !== "playing") start();
        e.preventDefault();
      }
    };
    const onKeyUp = (e) => {
      if (e.key === "ArrowLeft")  keysRef.current.left  = false;
      if (e.key === "ArrowRight") keysRef.current.right = false;
    };

    const onMouseMove = (e) => {
      const rect   = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      const mx     = (e.clientX - rect.left) * scaleX;
      stateRef.current.paddle.x = Math.max(0, Math.min(W - PADDLE_W, mx - PADDLE_W / 2));
    };

    const onTouch = (e) => {
      const rect   = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      const mx     = (e.touches[0].clientX - rect.left) * scaleX;
      stateRef.current.paddle.x = Math.max(0, Math.min(W - PADDLE_W, mx - PADDLE_W / 2));
    };

    const onClick = () => {
      if (stateRef.current.phase !== "playing") start();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup",   onKeyUp);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("click", onClick);
    };
  }, [start]);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: W }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          cursor: "none",
          userSelect: "none",
          borderRadius: 4,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}










