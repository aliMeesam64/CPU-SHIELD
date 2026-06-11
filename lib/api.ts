const API_BASE_URL = 'http://localhost:5000/api'

export interface BaselineStats {
  [task: string]: {
    mean: number
    variance: number
    skewness: number
    kurtosis: number
    L2_dist: number
    perm_ent: number
    mean_power_w: number
  }
}

export interface TimeSeriesData {
  timestamps: string[]
  power_values: number[]
  tasks: string[]
  total_samples: number
  duration_seconds: number
  sampling_rate: number
}

export interface PowerDistribution {
  [task: string]: {
    mean: number
    std: number
    samples: number
    distribution: Array<{
      power_range: string
      count: number
    }>
  }
}

export interface TrainingRuns {
  training_files: string[]
  testing_files: string[]
  total_training: number
  total_testing: number
}

export interface VoteDistribution {
  counts: number[]
  mean: number
  std: number
  threshold: number
  infected_runs: number
}

export interface KPIMetrics {
  avg_power_w: number
  peak_power_w: number
  infected_runs: number
  total_runs: number
  anomaly_threshold: number
  data_points_collected: number
}

export interface DashboardData {
  baseline: BaselineStats
  timeseries: TimeSeriesData
  power_distribution: PowerDistribution
  training_runs: TrainingRuns
  vote_distribution: VoteDistribution
  sampling_info: {
    sampling_rate_hz: number
    total_samples: number
    duration_seconds: number
    actual_rate_hz: number
  }
}

// Fetch functions with error handling
export async function fetchBaseline(): Promise<BaselineStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/baseline`)
    if (!response.ok) throw new Error('Failed to fetch baseline')
    return response.json()
  } catch (error) {
    throw error
  }
}

export async function fetchBaselineTask(task: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/baseline/${task}`)
    if (!response.ok) throw new Error(`Failed to fetch baseline for ${task}`)
    return response.json()
  } catch (error) {
    throw error
  }
}

export async function fetchTimeSeries(): Promise<TimeSeriesData> {
  try {
    const response = await fetch(`${API_BASE_URL}/timeseries`)
    if (!response.ok) throw new Error('Failed to fetch time series')
    return response.json()
  } catch (error) {
    throw error
  }
}

export async function fetchPowerDistribution(): Promise<PowerDistribution> {
  try {
    const response = await fetch(`${API_BASE_URL}/power-distribution`)
    if (!response.ok) throw new Error('Failed to fetch power distribution')
    return response.json()
  } catch (error) {
    throw error
  }
}

export async function fetchTrainingRuns(): Promise<TrainingRuns> {
  try {
    const response = await fetch(`${API_BASE_URL}/training-runs`)
    if (!response.ok) throw new Error('Failed to fetch training runs')
    return response.json()
  } catch (error) {
    throw error
  }
}

export async function fetchVoteDistribution(): Promise<VoteDistribution> {
  try {
    const response = await fetch(`${API_BASE_URL}/vote-distribution`)
    if (!response.ok) throw new Error('Failed to fetch vote distribution')
    return response.json()
  } catch (error) {
    throw error
  }
}

export async function fetchKPI(): Promise<KPIMetrics> {
  try {
    const response = await fetch(`${API_BASE_URL}/kpi`)
    if (!response.ok) throw new Error('Failed to fetch KPI')
    return response.json()
  } catch (error) {
    throw error
  }
}

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard`)
    if (!response.ok) throw new Error('Failed to fetch dashboard data')
    return response.json()
  } catch (error) {
    throw error
  }
}
