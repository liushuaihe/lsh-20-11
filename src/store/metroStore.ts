import { create } from 'zustand';
import type { RouteResult, RouteStrategy, TimePeriod, TravelMode } from '@/types/metro';
import { findAllRoutes } from '@/lib/pathfinding';

interface MetroState {
  startStationId: string | null;
  endStationId: string | null;
  selectedStrategy: RouteStrategy;
  timePeriod: TimePeriod;
  travelMode: TravelMode;
  userOrigin: { x: number; y: number } | null;
  userDestination: { x: number; y: number } | null;
  blockedStations: string[];
  routeResults: Map<RouteStrategy, RouteResult | null>;
  highlightedRoute: RouteResult | null;
  isCalculating: boolean;
  error: string | null;

  setStartStation: (id: string | null) => void;
  setEndStation: (id: string | null) => void;
  setSelectedStrategy: (strategy: RouteStrategy) => void;
  setTimePeriod: (period: TimePeriod) => void;
  setTravelMode: (mode: TravelMode) => void;
  setUserOrigin: (pos: { x: number; y: number } | null) => void;
  setUserDestination: (pos: { x: number; y: number } | null) => void;
  toggleBlockedStation: (id: string) => void;
  clearBlockedStations: () => void;
  calculateRoutes: () => void;
  setHighlightedRoute: (route: RouteResult | null) => void;
  resetAll: () => void;
}

export const useMetroStore = create<MetroState>((set, get) => ({
  startStationId: null,
  endStationId: null,
  selectedStrategy: 'shortest-time',
  timePeriod: 'off-peak',
  travelMode: 'metro-only',
  userOrigin: null,
  userDestination: null,
  blockedStations: [],
  routeResults: new Map(),
  highlightedRoute: null,
  isCalculating: false,
  error: null,

  setStartStation: (id) => {
    set({ startStationId: id, routeResults: new Map(), highlightedRoute: null, error: null });
  },

  setEndStation: (id) => {
    set({ endStationId: id, routeResults: new Map(), highlightedRoute: null, error: null });
  },

  setSelectedStrategy: (strategy) => {
    set({ selectedStrategy: strategy });
    const results = get().routeResults;
    const route = results.get(strategy) ?? null;
    set({ highlightedRoute: route });
  },

  setTimePeriod: (period) => {
    set({ timePeriod: period, routeResults: new Map(), highlightedRoute: null });
  },

  setTravelMode: (mode) => {
    set({ travelMode: mode, routeResults: new Map(), highlightedRoute: null });
  },

  setUserOrigin: (pos) => {
    set({ userOrigin: pos, routeResults: new Map(), highlightedRoute: null });
  },

  setUserDestination: (pos) => {
    set({ userDestination: pos, routeResults: new Map(), highlightedRoute: null });
  },

  toggleBlockedStation: (id) => {
    const { blockedStations } = get();
    const exists = blockedStations.includes(id);
    const newBlocked = exists
      ? blockedStations.filter((s) => s !== id)
      : [...blockedStations, id];
    set({ blockedStations: newBlocked, routeResults: new Map(), highlightedRoute: null });
  },

  clearBlockedStations: () => {
    set({ blockedStations: [], routeResults: new Map(), highlightedRoute: null });
  },

  calculateRoutes: () => {
    const {
      startStationId,
      endStationId,
      blockedStations,
      timePeriod,
      selectedStrategy,
      travelMode,
      userOrigin,
      userDestination,
    } = get();

    if (!startStationId || !endStationId) {
      set({ error: '请先选择起点和终点' });
      return;
    }

    if (startStationId === endStationId) {
      set({ error: '起点和终点不能相同' });
      return;
    }

    set({ isCalculating: true, error: null });

    try {
      const results = findAllRoutes(
        startStationId,
        endStationId,
        blockedStations,
        timePeriod,
        travelMode,
        userOrigin ?? undefined,
        userDestination ?? undefined,
      );

      const hasAnyResult = Array.from(results.values()).some((r) => r !== null);

      if (!hasAnyResult) {
        set({
          isCalculating: false,
          error: '无法找到可用路线，可能存在站点封锁导致路径中断',
          routeResults: new Map(),
          highlightedRoute: null,
        });
        return;
      }

      const highlighted = results.get(selectedStrategy) ?? null;

      set({
        isCalculating: false,
        routeResults: results,
        highlightedRoute: highlighted,
      });
    } catch (e) {
      set({
        isCalculating: false,
        error: '路线计算出错，请重试',
      });
    }
  },

  setHighlightedRoute: (route) => {
    set({ highlightedRoute: route });
  },

  resetAll: () => {
    set({
      startStationId: null,
      endStationId: null,
      selectedStrategy: 'shortest-time',
      timePeriod: 'off-peak',
      travelMode: 'metro-only',
      userOrigin: null,
      userDestination: null,
      blockedStations: [],
      routeResults: new Map(),
      highlightedRoute: null,
      isCalculating: false,
      error: null,
    });
  },
}));
