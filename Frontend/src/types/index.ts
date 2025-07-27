// Comprehensive type definitions for the entire application

// ============================================================================
// CORE USER & AUTHENTICATION TYPES
// ============================================================================

export interface User {
  id: string
  name: string
  email: string
  phoneNumber: string
  avatarUrl?: string
  role: 'admin' | 'editor' | 'viewer' | 'owner'
  permissions: Permission[]
  preferences: UserPreferences
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  isActive: boolean
  mfaEnabled: boolean
}

export interface Permission {
  resource: 'api' | 'dataset' | 'model' | 'team' | 'billing' | 'settings'
  action: 'create' | 'read' | 'update' | 'delete' | 'admin'
  conditions?: Record<string, any>
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: NotificationPreferences
  dashboard: DashboardPreferences
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  types: {
    apiAlerts: boolean
    billingAlerts: boolean
    securityAlerts: boolean
    teamUpdates: boolean
  }
}

export interface DashboardPreferences {
  layout: 'grid' | 'list' | 'compact'
  defaultView: 'overview' | 'apis' | 'analytics'
  widgets: string[]
  refreshInterval: number
}

// ============================================================================
// AUTHENTICATION & SECURITY TYPES
// ============================================================================

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  mfaRequired: boolean
  sessionExpiry: string | null
}

export interface MFASetup {
  type: 'totp' | 'sms' | 'email' | 'hardware'
  secret?: string
  backupCodes: string[]
  isEnabled: boolean
  qrCode?: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupData {
  name: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  marketingEmails?: boolean
}

export interface PasswordReset {
  email: string
  token?: string
  newPassword?: string
}

// ============================================================================
// API MANAGEMENT TYPES
// ============================================================================

export interface ApiItem {
  id: string
  name: string
  description: string
  status: 'draft' | 'active' | 'deprecated' | 'training' | 'error'
  type: 'prediction' | 'classification' | 'regression' | 'custom' | 'nlp' | 'computer_vision'
  version: string
  createdAt: string
  updatedAt: string
  lastUsed?: string
  owner: User
  team: TeamMember[]
  usage: ApiUsage
  model?: Model
  settings: ApiSettings
  security: ApiSecurity
  documentation: ApiDocumentation
  integrations: Integration[]
}

export interface ApiUsage {
  calls: number
  limit: number
  accuracy?: number
  latency?: number
  errorRate?: number
  costPerCall?: number
  totalCost?: number
  trends: UsageTrend[]
}

export interface UsageTrend {
  date: string
  calls: number
  errors: number
  latency: number
  cost: number
}

export interface ApiSettings {
  rateLimit: RateLimit
  timeout: number
  retryAttempts: number
  caching: CacheConfig
  logging: LoggingConfig
  monitoring: MonitoringConfig
}

export interface RateLimit {
  requestsPerMinute: number
  requestsPerHour: number
  requestsPerDay: number
  burstLimit: number
  perUser: boolean
  perIP: boolean
}

export interface CacheConfig {
  enabled: boolean
  ttl: number
  strategy: 'memory' | 'redis' | 'cdn'
  invalidation: string[]
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error'
  retention: number
  format: 'json' | 'text'
  destinations: string[]
}

export interface MonitoringConfig {
  healthChecks: HealthCheck[]
  alerts: Alert[]
  metrics: Metric[]
  dashboards: Dashboard[]
}

export interface ApiSecurity {
  authentication: AuthConfig
  authorization: AuthzConfig
  encryption: EncryptionConfig
  ipWhitelist: string[]
  cors: CorsConfig
}

export interface AuthConfig {
  type: 'api_key' | 'jwt' | 'oauth2' | 'none'
  apiKeyHeader?: string
  jwtSecret?: string
  oauth2Config?: OAuth2Config
}

export interface AuthzConfig {
  roles: Role[]
  permissions: Permission[]
  policies: Policy[]
}

export interface EncryptionConfig {
  algorithm: 'AES-256-GCM' | 'ChaCha20-Poly1305'
  keyRotation: boolean
  atRest: boolean
  inTransit: boolean
}

export interface CorsConfig {
  allowedOrigins: string[]
  allowedMethods: string[]
  allowedHeaders: string[]
  allowCredentials: boolean
}

export interface ApiDocumentation {
  description: string
  endpoints: Endpoint[]
  schemas: Schema[]
  examples: Example[]
  sdk: SDKConfig
}

export interface Endpoint {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  description: string
  parameters: Parameter[]
  requestBody?: RequestBody
  responses: Response[]
  examples: Example[]
}

export interface Parameter {
  name: string
  type: string
  required: boolean
  description: string
  example: string
  validation?: ValidationRule[]
}

export interface RequestBody {
  type: string
  schema: Schema
  required: boolean
  description: string
}

export interface Response {
  code: number
  description: string
  schema: Schema
  example: string
}

export interface Schema {
  type: string
  properties: Record<string, SchemaProperty>
  required: string[]
  example: any
}

export interface SchemaProperty {
  type: string
  description: string
  example: any
  validation?: ValidationRule[]
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'format'
  value: any
  message: string
}

export interface Example {
  name: string
  description: string
  request: string
  response: string
}

export interface SDKConfig {
  languages: string[]
  autoGenerate: boolean
  documentation: boolean
  examples: boolean
}

// ============================================================================
// MACHINE LEARNING & MODEL TYPES
// ============================================================================

export interface Model {
  id: string
  name: string
  type: 'xgboost' | 'neural_network' | 'random_forest' | 'custom' | 'auto'
  version: string
  status: 'training' | 'ready' | 'failed' | 'deployed' | 'archived'
  accuracy: number
  createdAt: string
  updatedAt: string
  owner: User
  dataset: Dataset
  metrics: ModelMetrics
  hyperparameters: Hyperparameters
  artifacts: ModelArtifacts
  deployment: ModelDeployment
  monitoring: ModelMonitoring
}

export interface ModelMetrics {
  precision: number
  recall: number
  f1Score: number
  loss: number
  confusionMatrix?: number[][]
  rocCurve?: Point[]
  featureImportance?: FeatureImportance[]
}

export interface Point {
  x: number
  y: number
}

export interface FeatureImportance {
  feature: string
  importance: number
  type: 'numerical' | 'categorical'
}

export interface Hyperparameters {
  learningRate?: number
  epochs?: number
  batchSize?: number
  layers?: number[]
  dropout?: number
  regularization?: number
  [key: string]: any
}

export interface ModelArtifacts {
  modelFile: string
  configFile: string
  metadataFile: string
  size: number
  checksum: string
}

export interface ModelDeployment {
  environment: 'development' | 'staging' | 'production'
  endpoint: string
  replicas: number
  resources: ResourceRequirements
  scaling: ScalingConfig
  healthCheck: HealthCheck
}

export interface ResourceRequirements {
  cpu: string
  memory: string
  gpu?: string
}

export interface ScalingConfig {
  minReplicas: number
  maxReplicas: number
  targetCPUUtilization: number
  targetMemoryUtilization: number
}

export interface ModelMonitoring {
  dataDrift: DataDriftConfig
  performanceDrift: PerformanceDriftConfig
  alerts: Alert[]
  retraining: RetrainingConfig
  explainability: ExplainabilityConfig
}

export interface DataDriftConfig {
  enabled: boolean
  threshold: number
  features: string[]
  detectionMethod: 'statistical' | 'ml_based'
}

export interface PerformanceDriftConfig {
  enabled: boolean
  threshold: number
  metrics: string[]
  window: number
}

export interface RetrainingConfig {
  enabled: boolean
  schedule: string
  trigger: 'manual' | 'scheduled' | 'drift_detected'
  conditions: RetrainingCondition[]
}

export interface RetrainingCondition {
  metric: string
  threshold: number
  operator: 'gt' | 'lt' | 'eq'
}

export interface ExplainabilityConfig {
  enabled: boolean
  method: 'shap' | 'lime' | 'integrated_gradients'
  features: string[]
}

// ============================================================================
// DATASET & DATA MANAGEMENT TYPES
// ============================================================================

export interface Dataset {
  id: string
  name: string
  description: string
  type: 'csv' | 'excel' | 'json' | 'parquet' | 'integration'
  size: number
  rows: number
  columns: number
  uploadedAt: string
  updatedAt: string
  status: 'uploading' | 'processing' | 'ready' | 'error'
  owner: User
  schema: DatasetSchema
  preview: any[]
  metadata: DatasetMetadata
  quality: DataQuality
  lineage: DataLineage
  access: DataAccess
}

export interface DatasetSchema {
  columns: Column[]
  primaryKey?: string
  foreignKeys?: ForeignKey[]
  constraints?: Constraint[]
}

export interface Column {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime'
  nullable: boolean
  unique: boolean
  description: string
  example: any
  validation?: ValidationRule[]
}

export interface ForeignKey {
  column: string
  referenceTable: string
  referenceColumn: string
}

export interface Constraint {
  type: 'not_null' | 'unique' | 'check' | 'default'
  column?: string
  value?: any
  expression?: string
}

export interface DatasetMetadata {
  source: string
  tags: string[]
  category: string
  version: string
  license?: string
  citation?: string
}

export interface DataQuality {
  completeness: number
  accuracy: number
  consistency: number
  timeliness: number
  validity: number
  issues: DataIssue[]
}

export interface DataIssue {
  id: string
  type: 'missing' | 'outlier' | 'format' | 'duplicate' | 'inconsistent'
  column: string
  row: number
  value: string
  severity: 'low' | 'medium' | 'high'
  suggestedFix: string
  fixed: boolean
}

export interface DataLineage {
  source: string
  transformations: Transformation[]
  dependencies: string[]
  version: string
}

export interface Transformation {
  type: string
  description: string
  parameters: Record<string, any>
  timestamp: string
}

export interface DataAccess {
  permissions: Permission[]
  encryption: EncryptionConfig
  audit: AuditConfig
}

export interface AuditConfig {
  enabled: boolean
  events: string[]
  retention: number
}

// ============================================================================
// TEAM & COLLABORATION TYPES
// ============================================================================

export interface Team {
  id: string
  name: string
  description: string
  owner: User
  members: TeamMember[]
  projects: Project[]
  settings: TeamSettings
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  user: User
  role: 'admin' | 'editor' | 'viewer' | 'guest'
  permissions: Permission[]
  joinedAt: string
  invitedBy: User
  status: 'active' | 'pending' | 'suspended'
}

export interface Project {
  id: string
  name: string
  description: string
  owner: User
  team: Team
  apis: ApiItem[]
  datasets: Dataset[]
  models: Model[]
  tasks: Task[]
  milestones: Milestone[]
  progress: Progress
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  assignee: User
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string
  tags: string[]
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  dueDate: string
  tasks: Task[]
  progress: number
  status: 'upcoming' | 'in_progress' | 'completed' | 'overdue'
}

export interface Progress {
  completed: number
  total: number
  percentage: number
  estimatedCompletion?: string
}

export interface Comment {
  id: string
  content: string
  author: User
  createdAt: string
  updatedAt: string
  replies: Comment[]
}

export interface TeamSettings {
  defaultRole: 'editor' | 'viewer'
  allowInvites: boolean
  requireApproval: boolean
  maxMembers: number
  billing: BillingConfig
}

// ============================================================================
// BILLING & SUBSCRIPTION TYPES
// ============================================================================

export interface Subscription {
  id: string
  user: User
  plan: Plan
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid'
  billingCycle: 'monthly' | 'yearly'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  paymentMethod: PaymentMethod
  usage: UsageMetrics
  invoices: Invoice[]
  createdAt: string
  updatedAt: string
}

export interface Plan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  features: Feature[]
  limits: PlanLimits
  isPopular: boolean
  isCustom: boolean
}

export interface Feature {
  name: string
  description: string
  included: boolean
  limit?: number
  unit?: string
}

export interface PlanLimits {
  apis: number
  requestsPerMonth: number
  teamMembers: number
  storage: number
  support: 'email' | 'chat' | 'phone'
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_account' | 'paypal'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  country?: string
}

export interface UsageMetrics {
  apiCalls: number
  storage: number
  teamMembers: number
  customFeatures: Record<string, number>
  cost: number
  period: string
}

export interface Invoice {
  id: string
  number: string
  amount: number
  currency: string
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
  dueDate: string
  paidAt?: string
  items: InvoiceItem[]
  pdfUrl?: string
  createdAt: string
}

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
  type: 'subscription' | 'usage' | 'one_time'
}

export interface BillingConfig {
  autoRenew: boolean
  paymentMethod: PaymentMethod
  billingAddress: Address
  taxId?: string
  notifications: BillingNotifications
}

export interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface BillingNotifications {
  paymentFailed: boolean
  paymentSucceeded: boolean
  invoiceReady: boolean
  subscriptionCancelled: boolean
}

// ============================================================================
// ANALYTICS & MONITORING TYPES
// ============================================================================

export interface Analytics {
  overview: OverviewMetrics
  apis: ApiAnalytics[]
  users: UserAnalytics[]
  revenue: RevenueAnalytics
  performance: PerformanceMetrics
  trends: TrendData[]
}

export interface OverviewMetrics {
  totalApis: number
  totalRequests: number
  totalUsers: number
  totalRevenue: number
  growthRate: number
  uptime: number
}

export interface ApiAnalytics {
  apiId: string
  name: string
  requests: number
  errors: number
  latency: number
  revenue: number
  users: number
  trends: TrendData[]
}

export interface UserAnalytics {
  userId: string
  name: string
  apiUsage: number
  lastActive: string
  subscription: string
  revenue: number
}

export interface RevenueAnalytics {
  total: number
  monthly: number
  growth: number
  byPlan: Record<string, number>
  byApi: Record<string, number>
  trends: TrendData[]
}

export interface PerformanceMetrics {
  responseTime: number
  throughput: number
  errorRate: number
  availability: number
  cpuUsage: number
  memoryUsage: number
}

export interface TrendData {
  date: string
  value: number
  change: number
  changePercent: number
}

export interface Dashboard {
  id: string
  name: string
  description: string
  owner: User
  widgets: Widget[]
  layout: Layout
  refreshInterval: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface Widget {
  id: string
  type: 'chart' | 'metric' | 'table' | 'list'
  title: string
  config: WidgetConfig
  data: any
  position: Position
  size: Size
}

export interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'pie' | 'area'
  metric?: string
  query?: string
  filters?: Filter[]
  refreshInterval?: number
}

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Layout {
  type: 'grid' | 'flexible'
  columns: number
  rows: number
  gap: number
}

export interface Filter {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in'
  value: any
}

// ============================================================================
// INTEGRATION & WORKFLOW TYPES
// ============================================================================

export interface Integration {
  id: string
  name: string
  type: 'webhook' | 'database' | 'api' | 'file' | 'streaming'
  provider: string
  status: 'active' | 'inactive' | 'error'
  config: IntegrationConfig
  credentials: Credentials
  events: Event[]
  lastSync: string
  createdAt: string
  updatedAt: string
}

export interface IntegrationConfig {
  url?: string
  method?: string
  headers?: Record<string, string>
  body?: any
  schedule?: string
  retryPolicy: RetryPolicy
  timeout: number
}

export interface Credentials {
  type: 'api_key' | 'oauth2' | 'basic' | 'bearer'
  apiKey?: string
  username?: string
  password?: string
  token?: string
  refreshToken?: string
  expiresAt?: string
}

export interface Event {
  id: string
  type: string
  payload: any
  timestamp: string
  status: 'pending' | 'sent' | 'failed'
  retries: number
  error?: string
}

export interface RetryPolicy {
  maxRetries: number
  backoff: 'linear' | 'exponential'
  initialDelay: number
  maxDelay: number
}

export interface Workflow {
  id: string
  name: string
  description: string
  owner: User
  nodes: WorkflowNode[]
  connections: Connection[]
  triggers: Trigger[]
  status: 'draft' | 'active' | 'paused' | 'archived'
  executions: Execution[]
  createdAt: string
  updatedAt: string
}

export interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'transform' | 'api_call'
  name: string
  description: string
  position: Position
  config: NodeConfig
  inputs: Input[]
  outputs: Output[]
}

export interface NodeConfig {
  [key: string]: any
}

export interface Input {
  name: string
  type: string
  required: boolean
  default?: any
}

export interface Output {
  name: string
  type: string
  description: string
}

export interface Connection {
  id: string
  fromNode: string
  fromPort: string
  toNode: string
  toPort: string
  condition?: string
}

export interface Trigger {
  id: string
  type: 'schedule' | 'webhook' | 'event' | 'manual'
  config: TriggerConfig
  enabled: boolean
}

export interface TriggerConfig {
  schedule?: string
  url?: string
  event?: string
  filters?: Filter[]
}

export interface Execution {
  id: string
  workflowId: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  startedAt: string
  completedAt?: string
  duration?: number
  result?: any
  error?: string
  logs: LogEntry[]
}

export interface LogEntry {
  timestamp: string
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  data?: any
}

// ============================================================================
// NOTIFICATION & COMMUNICATION TYPES
// ============================================================================

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  recipient: User
  read: boolean
  actionUrl?: string
  actionText?: string
  metadata?: Record<string, any>
  createdAt: string
  expiresAt?: string
}

export interface NotificationTemplate {
  id: string
  name: string
  type: 'email' | 'push' | 'sms' | 'in_app'
  subject?: string
  body: string
  variables: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  sender: User
  content: string
  type: 'text' | 'file' | 'image' | 'system'
  roomId: string
  timestamp: string
  editedAt?: string
  reactions: Reaction[]
}

export interface Reaction {
  emoji: string
  user: User
  timestamp: string
}

export interface ChatRoom {
  id: string
  name: string
  type: 'direct' | 'group' | 'channel'
  participants: User[]
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt: string
  updatedAt: string
}

// ============================================================================
// MISSING INTERFACE DEFINITIONS
// ============================================================================

export interface HealthCheck {
  name: string
  type: 'http' | 'tcp' | 'command' | 'grpc'
  endpoint?: string
  interval: number
  timeout: number
  retries: number
  status: 'healthy' | 'unhealthy' | 'unknown'
  lastCheck: string
  nextCheck: string
}

export interface Alert {
  id: string
  name: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'resolved' | 'acknowledged'
  source: string
  condition: string
  threshold: number
  currentValue: number
  triggeredAt: string
  resolvedAt?: string
  acknowledgedAt?: string
  acknowledgedBy?: User
}

export interface Metric {
  name: string
  type: 'counter' | 'gauge' | 'histogram' | 'summary'
  value: number
  unit: string
  labels: Record<string, string>
  timestamp: string
  description: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface Policy {
  id: string
  name: string
  description: string
  effect: 'allow' | 'deny'
  resources: string[]
  actions: string[]
  conditions?: Record<string, any>
  priority: number
  createdAt: string
  updatedAt: string
}

export interface OAuth2Config {
  clientId: string
  clientSecret: string
  redirectUri: string
  scope: string[]
  authorizationUrl: string
  tokenUrl: string
  userInfoUrl?: string
}

// ============================================================================
// API RESPONSE & ERROR TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  data: T
  message: string
  success: boolean
  timestamp: string
  requestId: string
  pagination?: Pagination
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
  requestId: string
  statusCode: number
}

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface LoadingStateData<T> {
  data: T | null
  loading: LoadingState
  error: string | null
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  icon?: string
}

export interface TableColumn<T = any> {
  key: keyof T
  title: string
  sortable?: boolean
  filterable?: boolean
  width?: number
  render?: (value: any, record: T) => React.ReactNode
}

export interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

export interface FilterConfig {
  field: string
  operator: string
  value: any
}

export interface SearchConfig {
  query: string
  fields: string[]
  filters: FilterConfig[]
  sort: SortConfig
}

// ============================================================================
// ENVIRONMENT & CONFIGURATION TYPES
// ============================================================================

export interface Environment {
  name: 'development' | 'staging' | 'production'
  config: EnvironmentConfig
  secrets: SecretManagement
  monitoring: MonitoringConfig
}

export interface EnvironmentConfig {
  apiUrl: string
  websocketUrl: string
  cdnUrl: string
  features: FeatureFlags
  limits: EnvironmentLimits
}

export interface FeatureFlags {
  [key: string]: boolean
}

export interface EnvironmentLimits {
  maxFileSize: number
  maxApiCalls: number
  maxTeamMembers: number
  maxStorage: number
}

export interface SecretManagement {
  apiKeys: string[]
  databaseUrl: string
  redisUrl: string
  jwtSecret: string
  encryptionKey: string
}

export interface MonitoringConfig {
  logging: LoggingConfig
  metrics: MetricsConfig
  tracing: TracingConfig
  alerting: AlertingConfig
}

export interface MetricsConfig {
  enabled: boolean
  interval: number
  retention: number
  exporters: string[]
}

export interface TracingConfig {
  enabled: boolean
  sampler: number
  exporters: string[]
}

export interface AlertingConfig {
  enabled: boolean
  channels: AlertChannel[]
  rules: AlertRule[]
}

export interface AlertChannel {
  type: 'email' | 'slack' | 'webhook' | 'sms'
  config: Record<string, any>
  enabled: boolean
}

export interface AlertRule {
  name: string
  condition: string
  threshold: number
  duration: number
  channels: string[]
  enabled: boolean
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  User,
  Permission,
  UserPreferences,
  NotificationPreferences,
  DashboardPreferences,
  AuthState,
  MFASetup,
  LoginCredentials,
  SignupData,
  PasswordReset,
  ApiItem,
  ApiUsage,
  UsageTrend,
  ApiSettings,
  RateLimit,
  CacheConfig,
  LoggingConfig,
  MonitoringConfig,
  ApiSecurity,
  AuthConfig,
  AuthzConfig,
  EncryptionConfig,
  CorsConfig,
  ApiDocumentation,
  Endpoint,
  Parameter,
  RequestBody,
  Response,
  Schema,
  SchemaProperty,
  ValidationRule,
  Example,
  SDKConfig,
  Model,
  ModelMetrics,
  Point,
  FeatureImportance,
  Hyperparameters,
  ModelArtifacts,
  ModelDeployment,
  ResourceRequirements,
  ScalingConfig,
  ModelMonitoring,
  DataDriftConfig,
  PerformanceDriftConfig,
  RetrainingConfig,
  RetrainingCondition,
  ExplainabilityConfig,
  Dataset,
  DatasetSchema,
  Column,
  ForeignKey,
  Constraint,
  DatasetMetadata,
  DataQuality,
  DataIssue,
  DataLineage,
  Transformation,
  DataAccess,
  AuditConfig,
  Team,
  TeamMember,
  Project,
  Task,
  Milestone,
  Progress,
  Comment,
  TeamSettings,
  Subscription,
  Plan,
  Feature,
  PlanLimits,
  PaymentMethod,
  UsageMetrics,
  Invoice,
  InvoiceItem,
  BillingConfig,
  Address,
  BillingNotifications,
  Analytics,
  OverviewMetrics,
  ApiAnalytics,
  UserAnalytics,
  RevenueAnalytics,
  PerformanceMetrics,
  TrendData,
  Dashboard,
  Widget,
  WidgetConfig,
  Position,
  Size,
  Layout,
  Filter,
  Integration,
  IntegrationConfig,
  Credentials,
  Event,
  RetryPolicy,
  Workflow,
  WorkflowNode,
  NodeConfig,
  Input,
  Output,
  Connection,
  Trigger,
  TriggerConfig,
  Execution,
  LogEntry,
  Notification,
  NotificationTemplate,
  ChatMessage,
  Reaction,
  ChatRoom,
  HealthCheck,
  Alert,
  Metric,
  Role,
  Policy,
  OAuth2Config,
  ApiResponse,
  Pagination,
  ApiError,
  AppError,
  LoadingState,
  LoadingStateData,
  SelectOption,
  TableColumn,
  SortConfig,
  FilterConfig,
  SearchConfig,
  Environment,
  EnvironmentConfig,
  FeatureFlags,
  EnvironmentLimits,
  SecretManagement,
  MonitoringConfig,
  MetricsConfig,
  TracingConfig,
  AlertingConfig,
  AlertChannel,
  AlertRule
} 