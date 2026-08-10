import { create } from 'zustand';

interface JourneyState {
  activeTrainId: string | null;
  autoRefresh: boolean;
  followTrainMode: boolean;
  isSimulating: boolean;
  simulatedProgress: number; // 0 to 100
  simulatedSpeed: number;
  simulatedCurrentIndex: number;
  activeAlarms: string[];
  setActiveTrainId: (id: string | null) => void;
  toggleAutoRefresh: () => void;
  toggleFollowTrainMode: () => void;
  setFollowTrainMode: (val: boolean) => void;
  setSimulationState: (state: Partial<Omit<JourneyState, 'setActiveTrainId' | 'toggleAutoRefresh' | 'toggleFollowTrainMode' | 'setFollowTrainMode' | 'setSimulationState' | 'toggleAlarm' | 'clearAlarms'>>) => void;
  toggleAlarm: (stationCode: string) => void;
  clearAlarms: () => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  activeTrainId: null,
  autoRefresh: true,
  followTrainMode: true,
  isSimulating: false,
  simulatedProgress: 0,
  simulatedSpeed: 0,
  simulatedCurrentIndex: 0,
  activeAlarms: [],
  setActiveTrainId: (id) => set({ activeTrainId: id }),
  toggleAutoRefresh: () => set((state) => ({ autoRefresh: !state.autoRefresh })),
  toggleFollowTrainMode: () =>
    set((state) => ({ followTrainMode: !state.followTrainMode })),
  setFollowTrainMode: (val) => set({ followTrainMode: val }),
  setSimulationState: (state) => set(state),
  toggleAlarm: (stationCode) =>
    set((state) => {
      const exists = state.activeAlarms.includes(stationCode);
      const activeAlarms = exists
        ? state.activeAlarms.filter((code) => code !== stationCode)
        : [...state.activeAlarms, stationCode];
      return { activeAlarms };
    }),
  clearAlarms: () => set({ activeAlarms: [] }),
}));
