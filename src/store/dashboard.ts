import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  DashboardData,
  BrandWithRelations,
  Theme,
  Priority,
  Alert
} from '@/types'

interface DashboardState {
  // Data
  dashboardData: DashboardData | null
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null

  // UI State
  theme: Theme
  sidebarOpen: boolean
  commandPaletteOpen: boolean
  expandedSections: Record<string, boolean>
  selectedBrandId: string | null

  // Filters
  brandStageFilter: string[]
  brandStatusFilter: string[]
  searchQuery: string

  // Actions
  setDashboardData: (data: DashboardData) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
  setCommandPaletteOpen: (open: boolean) => void
  toggleSection: (sectionId: string) => void
  setSelectedBrand: (brandId: string | null) => void

  setBrandStageFilter: (stages: string[]) => void
  setBrandStatusFilter: (statuses: string[]) => void
  setSearchQuery: (query: string) => void

  // Optimistic updates
  updatePriority: (priorityId: string, updates: Partial<Priority>) => void
  updateBrand: (brandId: string, updates: Partial<BrandWithRelations>) => void
  markAlertRead: (alertId: string) => void

  // Reset
  reset: () => void
}

const initialState = {
  dashboardData: null,
  isLoading: true,
  error: null,
  lastUpdated: null,
  theme: 'system' as Theme,
  sidebarOpen: true,
  commandPaletteOpen: false,
  expandedSections: {},
  selectedBrandId: null,
  brandStageFilter: [],
  brandStatusFilter: [],
  searchQuery: '',
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setDashboardData: (data) => set({
        dashboardData: data,
        lastUpdated: new Date(),
        isLoading: false,
        error: null
      }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      setTheme: (theme) => set({ theme }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      toggleSection: (sectionId) => set((state) => ({
        expandedSections: {
          ...state.expandedSections,
          [sectionId]: !state.expandedSections[sectionId]
        }
      })),

      setSelectedBrand: (brandId) => set({ selectedBrandId: brandId }),

      setBrandStageFilter: (stages) => set({ brandStageFilter: stages }),

      setBrandStatusFilter: (statuses) => set({ brandStatusFilter: statuses }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      updatePriority: (priorityId, updates) => set((state) => {
        if (!state.dashboardData) return state

        const updatedPriorities = state.dashboardData.weeklyFocus.priorities.map((p) =>
          p.id === priorityId ? { ...p, ...updates } : p
        )

        const completedCount = updatedPriorities.filter(p => p.completed).length

        return {
          dashboardData: {
            ...state.dashboardData,
            weeklyFocus: {
              ...state.dashboardData.weeklyFocus,
              priorities: updatedPriorities,
              completedCount
            }
          }
        }
      }),

      updateBrand: (brandId, updates) => set((state) => {
        if (!state.dashboardData) return state

        const updatedBrands = state.dashboardData.activeBrands.map((b) =>
          b.id === brandId ? { ...b, ...updates } : b
        )

        return {
          dashboardData: {
            ...state.dashboardData,
            activeBrands: updatedBrands
          }
        }
      }),

      markAlertRead: (alertId) => set((state) => {
        if (!state.dashboardData) return state

        const updatedAlerts = state.dashboardData.recentAlerts.map((a) =>
          a.id === alertId ? { ...a, isRead: true } : a
        )

        return {
          dashboardData: {
            ...state.dashboardData,
            recentAlerts: updatedAlerts
          }
        }
      }),

      reset: () => set(initialState),
    }),
    {
      name: 'gtm-dashboard-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        expandedSections: state.expandedSections,
      }),
    }
  )
)

// Selectors
export const selectFilteredBrands = (state: DashboardState) => {
  const brands = state.dashboardData?.activeBrands || []
  const { brandStageFilter, brandStatusFilter, searchQuery } = state

  return brands.filter((brand) => {
    const matchesStage = brandStageFilter.length === 0 || brandStageFilter.includes(brand.stage)
    const matchesStatus = brandStatusFilter.length === 0 || brandStatusFilter.includes(brand.status)
    const matchesSearch = !searchQuery ||
      brand.name.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStage && matchesStatus && matchesSearch
  })
}

export const selectUnreadAlertCount = (state: DashboardState) => {
  return state.dashboardData?.recentAlerts.filter(a => !a.isRead).length || 0
}
