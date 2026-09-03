import type { MediaKit, PastCollab, PlatformStat } from "./media-kit-types";
import { createEmptyCollab, createEmptyPlatform } from "./media-kit-utils";

type TopLevelStringField = "creatorName" | "tagline" | "niche" | "location" | "email" | "bio" | "rateNote";
type PlatformStringField = "platform" | "handle" | "engagementRate";

export type MediaKitAction =
  | { type: "LOAD_KIT"; kit: MediaKit }
  | { type: "SET_FIELD"; field: TopLevelStringField; value: string }
  | { type: "ADD_PLATFORM" }
  | { type: "REMOVE_PLATFORM"; id: string }
  | { type: "SET_PLATFORM_FIELD"; id: string; field: PlatformStringField; value: string }
  | { type: "SET_PLATFORM_FOLLOWERS"; id: string; value: number }
  | { type: "ADD_COLLAB" }
  | { type: "REMOVE_COLLAB"; id: string }
  | { type: "SET_COLLAB_FIELD"; id: string; field: keyof Omit<PastCollab, "id">; value: string };

export function mediaKitReducer(state: MediaKit, action: MediaKitAction): MediaKit {
  switch (action.type) {
    case "LOAD_KIT":
      return action.kit;

    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "ADD_PLATFORM":
      return { ...state, platforms: [...state.platforms, createEmptyPlatform()] };

    case "REMOVE_PLATFORM": {
      const remaining = state.platforms.filter((p) => p.id !== action.id);
      // Always keep at least one row so the section never disappears entirely.
      return { ...state, platforms: remaining.length > 0 ? remaining : [createEmptyPlatform()] };
    }

    case "SET_PLATFORM_FIELD":
      return {
        ...state,
        platforms: state.platforms.map((p): PlatformStat =>
          p.id === action.id ? { ...p, [action.field]: action.value } : p,
        ),
      };

    case "SET_PLATFORM_FOLLOWERS":
      return {
        ...state,
        platforms: state.platforms.map((p) =>
          p.id === action.id ? { ...p, followers: action.value } : p,
        ),
      };

    case "ADD_COLLAB":
      return { ...state, pastCollabs: [...state.pastCollabs, createEmptyCollab()] };

    case "REMOVE_COLLAB":
      return { ...state, pastCollabs: state.pastCollabs.filter((c) => c.id !== action.id) };

    case "SET_COLLAB_FIELD":
      return {
        ...state,
        pastCollabs: state.pastCollabs.map((c) =>
          c.id === action.id ? { ...c, [action.field]: action.value } : c,
        ),
      };

    default:
      return state;
  }
}
