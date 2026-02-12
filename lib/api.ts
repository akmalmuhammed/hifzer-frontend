import * as Sentry from "@sentry/nextjs";

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthPayload = {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
  refresh_token_expires_at: string;
};

export type PriorJuzBand = "ZERO" | "ONE_TO_FIVE" | "FIVE_PLUS";
export type TajwidConfidence = "LOW" | "MED" | "HIGH";
export type GoalType = "FULL_QURAN" | "JUZ" | "SURAH";
export type ScaffoldingLevel = "BEGINNER" | "STANDARD" | "MINIMAL";
export type QueueMode = "NORMAL" | "REVIEW_ONLY" | "CONSOLIDATION";
export type SessionStep = "EXPOSURE" | "GUIDED" | "BLIND" | "LINK";

export type AssessmentRequest = {
  time_budget_minutes: 15 | 30 | 60 | 90;
  fluency_score: number;
  tajwid_confidence: TajwidConfidence;
  goal: GoalType;
  has_teacher: boolean;
  prior_juz_band: PriorJuzBand;
};

export type AssessmentDefaults = {
  daily_new_target_ayahs: number;
  review_ratio_target: number;
  variant: "MOMENTUM" | "STANDARD" | "CONSERVATIVE";
  scaffolding_level: ScaffoldingLevel;
  retention_threshold: number;
  backlog_freeze_ratio: number;
  consolidation_retention_floor: number;
  manzil_rotation_days: number;
  avg_seconds_per_item: number;
  overdue_cap_seconds: number;
  recommended_minutes?: 30;
  warning?: string;
};

export type AssessmentResponse = {
  defaults: AssessmentDefaults;
};

export type FluencyGateStatusResponse = {
  fluency_score: number | null;
  fluency_gate_passed: boolean;
  requires_pre_hifz: boolean;
  latest_test: {
    id: string;
    test_page: number;
    status: "IN_PROGRESS" | "PASSED" | "FAILED";
    fluency_score: number | null;
    completed_at: string | null;
  } | null;
};

export type FluencyGateStartResponse = {
  test_id: string;
  page: number;
  ayahs: Array<{
    id: number;
    surah_number: number;
    ayah_number: number;
    text_uthmani: string | null;
  }>;
  instructions: string;
};

export type FluencyGateSubmitResponse = {
  passed: boolean;
  fluency_score: number;
  time_score: number;
  accuracy_score: number;
  message: string;
};

export type QueueItem = {
  ayah_id: number;
  surah_number: number;
  ayah_number: number;
  page_number: number;
  tier: "SABAQ" | "SABQI" | "MANZIL";
  next_review_at: string;
  overdue_seconds: number;
  lapses: number;
  difficulty_score: number;
};

export type WeakTransition = {
  from_ayah_id: number;
  to_ayah_id: number;
  success_rate: number;
  success_count: number;
  attempt_count: number;
};

export type TodayQueueResponse =
  | {
      mode: "FLUENCY_GATE_REQUIRED";
      message: string;
      sabaq_allowed: false;
      sabqi_queue: [];
      manzil_queue: [];
      weak_transitions: [];
      link_repair_recommended: false;
      action_required: "COMPLETE_FLUENCY_GATE";
    }
  | {
      mode: QueueMode;
      debt: {
        dueItemsCount: number;
        backlogMinutesEstimate: number;
        overdueDaysMax: number;
        freezeThresholdMinutes: number;
      };
      retentionRolling7d: number;
      warmup_test: {
        max_errors: number;
        total_items: number;
        passed: boolean;
        failed: boolean;
        pending: boolean;
        ayah_ids: number[];
      };
      sabaq_task: {
        allowed: boolean;
        target_ayahs: number;
        blocked_reason:
          | "none"
          | "mode_review_only"
          | "warmup_pending"
          | "warmup_failed";
      };
      sabqi_queue: QueueItem[];
      manzil_queue: QueueItem[];
      weak_transitions: WeakTransition[];
      link_repair_recommended: boolean;
    };

export type SessionStartResponse = {
  session_id: string;
  mode: QueueMode;
  warmup_passed: boolean | null;
};

export type SessionStepProtocol = {
  step: SessionStep;
  attempts_required: number;
  optional: boolean;
};

export type SessionStepCompleteResponse = {
  recorded: boolean;
  next_step: SessionStep | "COMPLETE" | null;
  next_attempt: number | null;
  step_status: "IN_PROGRESS" | "STEP_COMPLETE" | "AYAH_COMPLETE";
  protocol: SessionStepProtocol[];
  progress: string;
};

export type SessionCompleteResponse = {
  session_id: string;
  retention_score: number;
  backlog_minutes: number;
  minutes_total: number;
  mode: QueueMode;
};

export type UserStatsResponse = {
  total_items_tracked: number;
  due_items: number;
  completed_sessions: number;
  latest_daily_session: {
    sessionDate: string;
    retentionScore: number;
    backlogMinutesEstimate: number;
    minutesTotal: number;
    mode: QueueMode;
  } | null;
  upcoming_due: Array<{
    ayah_id: number;
    next_review_at: string;
    tier: "SABAQ" | "SABQI" | "MANZIL";
  }>;
};

export type UserCalendarDay = {
  date: string;
  completed: boolean;
  minutes_total: number;
  ayahs_memorized: number;
  reviews_total: number;
  reviews_successful: number;
  xp: number;
  mode: QueueMode | null;
};

export type UserCalendarResponse = {
  month: string;
  timezone: "UTC";
  days: UserCalendarDay[];
  summary: {
    total_minutes: number;
    total_ayahs: number;
    total_xp: number;
    active_days: number;
    tracked_days_in_month: number;
    missed_days: number;
    current_streak: number;
    best_streak: number;
  };
};

export type AchievementBadge = {
  id: string;
  name: string;
  description: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  unlocked: boolean;
  current: number;
  target: number;
  progress_percent: number;
  unlocked_at: string | null;
  requirement: string | null;
};

export type UserAchievementsResponse = {
  level: number;
  title: string;
  xp: number;
  xp_next: number;
  unlocked_count: number;
  total_badges: number;
  badges: AchievementBadge[];
  recent_achievements: AchievementBadge[];
  next_milestone: {
    id: string;
    name: string;
    requirement: string | null;
  } | null;
  metrics: {
    current_streak: number;
    best_streak: number;
    items_tracked: number;
    memorized_ayahs: number;
    transition_attempts: number;
    transition_success_rate: number;
    weak_transition_count: number;
    fluency_score: number | null;
    fluency_gate_passed: boolean;
  };
};

export type UserProgressResponse = {
  overview: {
    total_items_tracked: number;
    due_items: number;
    completed_sessions: number;
    retention_percent: number;
  };
  activity: {
    days: Array<{
      date: string;
      minutes_total: number;
      ayahs_memorized: number;
      xp: number;
      completed: boolean;
    }>;
    active_days: number;
    average_minutes: number;
  };
  transitions: {
    overall_strength: number;
    weak: Array<{
      from_ayah_id: number;
      to_ayah_id: number;
      from_label: string;
      to_label: string;
      success_rate: number;
      success_count: number;
      attempt_count: number;
    }>;
    strong: Array<{
      from_ayah_id: number;
      to_ayah_id: number;
      from_label: string;
      to_label: string;
      success_rate: number;
      attempt_count: number;
    }>;
    link_repair_recommended: boolean;
  };
  retention: {
    checkpoints: Array<{
      checkpoint: "4h" | "8h" | "1d" | "3d" | "7d" | "14d" | "30d" | "90d";
      interval_seconds: number;
      items_count: number;
      success_rate: number | null;
    }>;
    overall_success_rate: number | null;
    recommendation: string;
  };
};

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, unknown>;
  retryAfterSeconds?: number;

  constructor(params: {
    message: string;
    status: number;
    code?: string;
    details?: Record<string, unknown>;
    retryAfterSeconds?: number;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
    this.retryAfterSeconds = params.retryAfterSeconds;
  }
}

function normalizeApiBaseUrl(raw: string): string {
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }
  return `https://${trimmed}`;
}

const RAW_API_BASE_URL = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"
).replace(/\/$/, "");
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/api\/v1$/i, "");

const STORAGE_KEYS = {
  refreshToken: "hifz_refresh_token",
  user: "hifz_user",
  displayName: "hifz_display_name",
  liveMigrationDone: "hifz_live_migration_done",
} as const;

let accessTokenMemory: string | null = null;
let refreshInFlight: Promise<AuthPayload> | null = null;
let currentUserMemory: AuthUser | null = null;
let bearerTokenProvider: (() => Promise<string | null>) | null = null;

if (typeof window !== "undefined") {
  const persistedUserRaw = localStorage.getItem(STORAGE_KEYS.user);
  if (persistedUserRaw) {
    try {
      currentUserMemory = JSON.parse(persistedUserRaw) as AuthUser;
    } catch {
      localStorage.removeItem(STORAGE_KEYS.user);
    }
  }
}

function getStorageValue(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(key);
}

function setStorageValue(key: string, value: string): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(key, value);
}

function removeStorageValue(key: string): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(key);
}

function setSessionCookie(enabled: boolean): void {
  if (typeof document === "undefined") {
    return;
  }

  if (!enabled) {
    document.cookie = "hifz_has_session=; Path=/; Max-Age=0; SameSite=Lax";
    return;
  }

  document.cookie =
    "hifz_has_session=1; Path=/; Max-Age=2592000; SameSite=Lax";
}

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

function getRefreshToken(): string | null {
  return getStorageValue(STORAGE_KEYS.refreshToken);
}

function setRefreshToken(token: string): void {
  setStorageValue(STORAGE_KEYS.refreshToken, token);
}

function clearRefreshToken(): void {
  removeStorageValue(STORAGE_KEYS.refreshToken);
}

export function setBearerTokenProvider(
  provider: (() => Promise<string | null>) | null,
): void {
  bearerTokenProvider = provider;
}

function parseApiErrorPayload(payload: unknown): {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
} {
  if (!payload || typeof payload !== "object") {
    return { message: "Request failed" };
  }
  const data = payload as Record<string, unknown>;
  const message =
    typeof data.error === "string"
      ? data.error
      : typeof data.message === "string"
        ? data.message
        : "Request failed";
  const code = typeof data.code === "string" ? data.code : undefined;
  return { message, code, details: data };
}

function captureApiException(error: unknown, context: {
  path: string;
  method: string;
  status?: number;
  code?: string;
}): void {
  if (typeof window === "undefined") {
    return;
  }

  Sentry.withScope((scope) => {
    scope.setTag("category", "api-client");
    scope.setTag("path", context.path);
    scope.setTag("method", context.method);
    if (context.status !== undefined) {
      scope.setTag("status", String(context.status));
    }
    if (context.code) {
      scope.setTag("error_code", context.code);
    }
    Sentry.captureException(
      error instanceof Error ? error : new Error(typeof error === "string" ? error : "API error")
    );
  });
}

async function parseJsonBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return null;
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestInternal<T>(params: {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  timeoutMs?: number;
  allowRefreshRetry?: boolean;
  networkRetryCount?: number;
  maxNetworkRetries?: number;
}): Promise<T> {
  const {
    path,
    method = "GET",
    body,
    auth = true,
    timeoutMs = 20000,
    allowRefreshRetry = true,
    networkRetryCount = 0,
    maxNetworkRetries = 1,
  } = params;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = { "content-type": "application/json" };

  let bearerToken: string | null = null;
  if (auth) {
    if (accessTokenMemory) {
      bearerToken = accessTokenMemory;
    } else if (bearerTokenProvider) {
      try {
        bearerToken = await bearerTokenProvider();
      } catch {
        bearerToken = null;
      }
    }
  }

  if (auth && bearerToken) {
    headers.authorization = `Bearer ${bearerToken}`;
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof DOMException && error.name === "AbortError") {
      if (networkRetryCount < maxNetworkRetries) {
        await wait(1500 * (networkRetryCount + 1));
        return requestInternal<T>({
          path,
          method,
          body,
          auth,
          timeoutMs: Math.max(timeoutMs, 30000),
          allowRefreshRetry,
          networkRetryCount: networkRetryCount + 1,
          maxNetworkRetries,
        });
      }
      captureApiException(error, {
        path,
        method,
        status: 408,
        code: "TIMEOUT"
      });
      throw new ApiError({
        message:
          "Request timed out. If the backend is waking from sleep, wait a few seconds and retry.",
        status: 408,
        code: "TIMEOUT",
      });
    }
    if (networkRetryCount < maxNetworkRetries) {
      await wait(1500 * (networkRetryCount + 1));
      return requestInternal<T>({
        path,
        method,
        body,
        auth,
        timeoutMs: Math.max(timeoutMs, 30000),
        allowRefreshRetry,
        networkRetryCount: networkRetryCount + 1,
        maxNetworkRetries,
      });
    }
    captureApiException(error, {
      path,
      method,
      code: "NETWORK_ERROR"
    });
    throw new ApiError({
      message: "Network unavailable",
      status: 0,
      code: "NETWORK_ERROR",
    });
  }

  clearTimeout(timeout);

  const payload = await parseJsonBody(response);

  if (!response.ok) {
    if (
      [502, 503, 504].includes(response.status) &&
      networkRetryCount < maxNetworkRetries
    ) {
      await wait(1500 * (networkRetryCount + 1));
      return requestInternal<T>({
        path,
        method,
        body,
        auth,
        timeoutMs: Math.max(timeoutMs, 30000),
        allowRefreshRetry,
        networkRetryCount: networkRetryCount + 1,
        maxNetworkRetries,
      });
    }

    if (
      response.status === 401 &&
      auth &&
      allowRefreshRetry &&
      (path !== "/api/v1/auth/refresh" || Boolean(bearerTokenProvider))
    ) {
      try {
        if (bearerTokenProvider) {
          // Force a single retry with a fresh token from Clerk/session provider.
          await bearerTokenProvider();
        } else if (getRefreshToken()) {
          await refreshSession();
        } else {
          throw new Error("No token refresh strategy available");
        }
        return await requestInternal<T>({
          path,
          method,
          body,
          auth,
          timeoutMs,
          allowRefreshRetry: false,
        });
      } catch {
        clearAuthSession();
      }
    }

    const parsed = parseApiErrorPayload(payload);
    if (response.status >= 500) {
      captureApiException(new Error(parsed.message), {
        path,
        method,
        status: response.status,
        code: parsed.code
      });
    }
    const retryAfterRaw = response.headers.get("retry-after");
    const retryAfterSeconds = retryAfterRaw ? Number(retryAfterRaw) : undefined;
    throw new ApiError({
      message: parsed.message,
      status: response.status,
      code: parsed.code,
      details: parsed.details,
      retryAfterSeconds: Number.isFinite(retryAfterSeconds)
        ? retryAfterSeconds
        : undefined,
    });
  }

  return payload as T;
}

function setAuthSession(payload: AuthPayload): void {
  accessTokenMemory = payload.access_token;
  setRefreshToken(payload.refresh_token);
  currentUserMemory = payload.user;
  setStorageValue(STORAGE_KEYS.user, JSON.stringify(payload.user));
  setSessionCookie(true);
}

export function clearAuthSession(): void {
  accessTokenMemory = null;
  clearRefreshToken();
  currentUserMemory = null;
  removeStorageValue(STORAGE_KEYS.user);
  setSessionCookie(false);
}

export function getCurrentUser(): AuthUser | null {
  return currentUserMemory;
}

export function hasAuthSession(): boolean {
  return Boolean(accessTokenMemory || getRefreshToken());
}

export async function refreshSession(): Promise<AuthPayload> {
  if (refreshInFlight) {
    return refreshInFlight;
  }
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new ApiError({
      message: "No refresh token",
      status: 401,
      code: "NO_REFRESH_TOKEN",
    });
  }

  refreshInFlight = requestInternal<AuthPayload>({
    path: "/api/v1/auth/refresh",
    method: "POST",
    body: {
      refresh_token: refreshToken,
    },
    auth: false,
    allowRefreshRetry: false,
  })
    .then((payload) => {
      setAuthSession(payload);
      return payload;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

export async function signup(params: {
  email: string;
  password: string;
}): Promise<AuthPayload> {
  const payload = await requestInternal<AuthPayload>({
    path: "/api/v1/auth/signup",
    method: "POST",
    body: params,
    auth: false,
    timeoutMs: 45000,
    allowRefreshRetry: false,
  });
  setAuthSession(payload);
  return payload;
}

export async function login(params: {
  email: string;
  password: string;
}): Promise<AuthPayload> {
  const payload = await requestInternal<AuthPayload>({
    path: "/api/v1/auth/login",
    method: "POST",
    body: params,
    auth: false,
    timeoutMs: 45000,
    allowRefreshRetry: false,
  });
  setAuthSession(payload);
  return payload;
}

export async function submitAssessment(
  payload: AssessmentRequest,
): Promise<AssessmentResponse> {
  return requestInternal<AssessmentResponse>({
    path: "/api/v1/assessment/submit",
    method: "POST",
    body: payload,
    auth: true,
    timeoutMs: 45000,
  });
}

export async function getTodayQueue(): Promise<TodayQueueResponse> {
  return requestInternal<TodayQueueResponse>({
    path: "/api/v1/queue/today",
    method: "GET",
    auth: true,
    timeoutMs: 45000,
  });
}

export async function getUserStats(): Promise<UserStatsResponse> {
  return requestInternal<UserStatsResponse>({
    path: "/api/v1/user/stats",
    method: "GET",
    auth: true,
    timeoutMs: 30000,
  });
}

export async function getUserCalendar(month?: string): Promise<UserCalendarResponse> {
  const params = month ? `?month=${encodeURIComponent(month)}` : "";
  return requestInternal<UserCalendarResponse>({
    path: `/api/v1/user/calendar${params}`,
    method: "GET",
    auth: true,
  });
}

export async function getUserAchievements(): Promise<UserAchievementsResponse> {
  return requestInternal<UserAchievementsResponse>({
    path: "/api/v1/user/achievements",
    method: "GET",
    auth: true,
  });
}

export async function getUserProgress(): Promise<UserProgressResponse> {
  return requestInternal<UserProgressResponse>({
    path: "/api/v1/user/progress",
    method: "GET",
    auth: true,
  });
}

export async function startSession(params: {
  mode?: QueueMode;
  warmup_passed?: boolean;
}): Promise<SessionStartResponse> {
  return requestInternal<SessionStartResponse>({
    path: "/api/v1/session/start",
    method: "POST",
    body: params,
    auth: true,
  });
}

export async function completeSession(
  sessionId: string,
): Promise<SessionCompleteResponse> {
  return requestInternal<SessionCompleteResponse>({
    path: "/api/v1/session/complete",
    method: "POST",
    body: {
      session_id: sessionId,
    },
    auth: true,
  });
}

export async function stepComplete(payload: {
  session_id: string;
  ayah_id: number;
  step_type: SessionStep;
  attempt_number: number;
  success: boolean;
  errors_count: number;
  scaffolding_used?: boolean;
  duration_seconds?: number;
  linked_ayah_id?: number;
}): Promise<SessionStepCompleteResponse> {
  return requestInternal<SessionStepCompleteResponse>({
    path: "/api/v1/session/step-complete",
    method: "POST",
    body: payload,
    auth: true,
  });
}

export async function ingestReviewEvent(payload: {
  client_event_id: string;
  event_type: "REVIEW_ATTEMPTED" | "TRANSITION_ATTEMPTED";
  session_type?: "SABAQ" | "SABQI" | "MANZIL" | "WARMUP";
  occurred_at: string;
  session_id?: string;
  item_ayah_id?: number;
  tier?: "SABAQ" | "SABQI" | "MANZIL";
  step_type?: SessionStep;
  attempt_number?: number;
  linked_ayah_id?: number;
  success: boolean;
  errors_count?: number;
  duration_seconds?: number;
  from_ayah_id?: number;
  to_ayah_id?: number;
}): Promise<{ deduplicated: boolean; event_id?: string }> {
  return requestInternal<{ deduplicated: boolean; event_id?: string }>({
    path: "/api/v1/review/event",
    method: "POST",
    body: payload,
    auth: true,
  });
}

export async function startFluencyGateTest(): Promise<FluencyGateStartResponse> {
  return requestInternal<FluencyGateStartResponse>({
    path: "/api/v1/fluency-gate/start",
    method: "POST",
    auth: true,
  });
}

export async function submitFluencyGateTest(payload: {
  test_id: string;
  duration_seconds: number;
  error_count: number;
}): Promise<FluencyGateSubmitResponse> {
  return requestInternal<FluencyGateSubmitResponse>({
    path: "/api/v1/fluency-gate/submit",
    method: "POST",
    body: payload,
    auth: true,
  });
}

export async function getFluencyGateStatus(): Promise<FluencyGateStatusResponse> {
  return requestInternal<FluencyGateStatusResponse>({
    path: "/api/v1/fluency-gate/status",
    method: "GET",
    auth: true,
  });
}

export function setDisplayName(value: string): void {
  const trimmed = value.trim();
  if (!trimmed) {
    removeStorageValue(STORAGE_KEYS.displayName);
    return;
  }
  setStorageValue(STORAGE_KEYS.displayName, trimmed);
}

export function getDisplayName(): string | null {
  return getStorageValue(STORAGE_KEYS.displayName);
}

export function markLiveMigrationDone(): void {
  setStorageValue(STORAGE_KEYS.liveMigrationDone, "true");
}

export function isLiveMigrationDone(): boolean {
  return getStorageValue(STORAGE_KEYS.liveMigrationDone) === "true";
}

export function clearLegacyMockState(): void {
  const legacyKeys = [
    "hifz_mock_user",
    "hifz_mock_queue",
    "hifz_session_draft",
    "hifz_today_snapshot",
    "hifz_assessment_draft",
    "hifz_transition_practice",
  ];
  for (const key of legacyKeys) {
    removeStorageValue(key);
  }
}
