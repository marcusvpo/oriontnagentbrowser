import { describe, expect, it } from "vitest";
import { anchoredTransform, wheelScale } from "./viewerZoom";

describe("zoom das prints", () => {
  it("um evento de 100 pixels não dispara até o zoom máximo", () => {
    expect(wheelScale(0.5, -100, 0, 600, 0.3)).toBeCloseTo(0.580917);
  });
  it("eventos pequenos e grandes com a mesma distância produzem o mesmo zoom", () => {
    let scale = 0.5;
    for (let i = 0; i < 100; i++) scale = wheelScale(scale, -1, 0, 600, 0.3);
    expect(scale).toBeCloseTo(wheelScale(0.5, -100, 0, 600, 0.3));
  });
  it("normaliza linhas e páginas", () => {
    expect(wheelScale(1, 1, 1, 600, 0.1)).toBe(wheelScale(1, 16, 0, 600, 0.1));
    expect(wheelScale(1, 1, 2, 600, 0.1)).toBe(wheelScale(1, 600, 0, 600, 0.1));
  });
  it("limita o zoom ao enquadramento e ao máximo", () => {
    expect(wheelScale(0.5, 10000, 0, 600, 0.3)).toBe(0.3);
    expect(wheelScale(0.5, -10000, 0, 600, 0.3)).toBe(6);
  });
  it("mantém o ponto sob o cursor estacionário", () => {
    const next = anchoredTransform(20, 40, 0.5, 0.6, 200, 150);
    expect((200 - next.x) / 0.6).toBeCloseTo((200 - 20) / 0.5);
    expect((150 - next.y) / 0.6).toBeCloseTo((150 - 40) / 0.5);
  });
});