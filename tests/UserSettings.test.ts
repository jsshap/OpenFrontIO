import { beforeEach, describe, expect, it } from "vitest";
import {
  LEADERBOARD_COLUMNS_KEY,
  UserSettings,
} from "../src/core/game/UserSettings";

const DEFAULT_LEADERBOARD_COLUMNS = [
  "tiles",
  "gold",
  "goldPerMinute",
  "maxtroops",
];

function clearUserSettingsCache(): void {
  (
    UserSettings as unknown as { cache: Map<string, string | null> }
  ).cache.clear();
}

describe("UserSettings leaderboard columns", () => {
  beforeEach(() => {
    localStorage.clear();
    clearUserSettingsCache();
  });

  it("falls back to defaults for invalid JSON", () => {
    localStorage.setItem(LEADERBOARD_COLUMNS_KEY, "not-json");

    expect(new UserSettings().leaderboardColumns()).toEqual(
      DEFAULT_LEADERBOARD_COLUMNS,
    );
  });

  it("filters unknown keys", () => {
    localStorage.setItem(
      LEADERBOARD_COLUMNS_KEY,
      JSON.stringify(["gold", "unknown", "cities"]),
    );

    expect(new UserSettings().leaderboardColumns()).toEqual(["gold", "cities"]);
  });

  it("falls back to defaults for empty or fully invalid selections", () => {
    const settings = new UserSettings();

    settings.setLeaderboardColumns([]);
    expect(settings.leaderboardColumns()).toEqual(DEFAULT_LEADERBOARD_COLUMNS);

    clearUserSettingsCache();
    localStorage.setItem(LEADERBOARD_COLUMNS_KEY, JSON.stringify(["unknown"]));
    expect(new UserSettings().leaderboardColumns()).toEqual(
      DEFAULT_LEADERBOARD_COLUMNS,
    );
  });

  it("keeps the last selected column enabled", () => {
    const settings = new UserSettings();

    settings.setLeaderboardColumns(["gold"]);
    expect(settings.toggleLeaderboardColumn("gold")).toEqual(["gold"]);
  });
});
