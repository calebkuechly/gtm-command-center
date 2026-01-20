import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useDashboardStore } from '@/store'
import type {
  DashboardData,
  BrandWithRelations,
  UpdateBrandInput,
  UpdatePriorityInput,
  CreateVisionaryInput
} from '@/types'

// API functions
async function fetchDashboard(): Promise<DashboardData> {
  const response = await fetch('/api/dashboard')
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data')
  }
  return response.json()
}

async function updateBrand(id: string, data: UpdateBrandInput): Promise<BrandWithRelations> {
  const response = await fetch(`/api/brands/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update brand')
  }
  return response.json()
}

async function updatePriority(id: string, data: UpdatePriorityInput): Promise<void> {
  const response = await fetch(`/api/priorities/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update priority')
  }
}

async function createVisionary(data: CreateVisionaryInput): Promise<void> {
  const response = await fetch('/api/pipeline/visionary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create visionary')
  }
}

async function markAlertRead(id: string): Promise<void> {
  const response = await fetch(`/api/alerts/${id}/read`, {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error('Failed to mark alert as read')
  }
}

// Hooks
export function useDashboardData() {
  const { setDashboardData, setLoading, setError } = useDashboardStore()

  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    refetchInterval: 60000,
    staleTime: 30000,
  })

  // Sync with Zustand store
  useEffect(() => {
    if (query.data) {
      setDashboardData(query.data)
    }
  }, [query.data, setDashboardData])

  useEffect(() => {
    if (query.error) {
      setError((query.error as Error).message)
    }
  }, [query.error, setError])

  useEffect(() => {
    setLoading(query.isLoading)
  }, [query.isLoading, setLoading])

  return query
}

export function useUpdateBrand() {
  const queryClient = useQueryClient()
  const { updateBrand: optimisticUpdate } = useDashboardStore()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandInput }) =>
      updateBrand(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['dashboard'] })
      optimisticUpdate(id, data as Partial<BrandWithRelations>)
      return { id }
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdatePriority() {
  const queryClient = useQueryClient()
  const { updatePriority: optimisticUpdate } = useDashboardStore()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePriorityInput }) =>
      updatePriority(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['dashboard'] })
      optimisticUpdate(id, data)
      return { id }
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useCreateVisionary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createVisionary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['pipeline'] })
    },
  })
}

export function useMarkAlertRead() {
  const queryClient = useQueryClient()
  const { markAlertRead: optimisticUpdate } = useDashboardStore()

  return useMutation({
    mutationFn: markAlertRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['dashboard'] })
      optimisticUpdate(id)
      return { id }
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
