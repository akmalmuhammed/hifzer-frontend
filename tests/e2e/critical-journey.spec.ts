import { expect, test, type Page, type Route } from "@playwright/test";

test.setTimeout(120000);

type MockState = {
  userId: string;
  email: string;
  fluencyGatePassed: boolean;
  fluencyScore: number | null;
};

const standardProtocol = [
  { step: "EXPOSURE", attempts_required: 3, optional: false },
  { step: "GUIDED", attempts_required: 1, optional: false },
  { step: "BLIND", attempts_required: 3, optional: false },
  { step: "LINK", attempts_required: 3, optional: false },
] as const;

function json(route: Route, payload: unknown, status = 200) {
  return route.fulfill({
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "*",
      "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    },
    body: JSON.stringify(payload),
  });
}

function defaultAuthPayload(email: string) {
  return {
    user: {
      id: "11111111-1111-4111-8111-111111111111",
      email,
    },
    access_token: "access-token",
    refresh_token: "refresh-token",
    refresh_token_expires_at: "2030-01-01T00:00:00.000Z",
  };
}

function stepResponse(stepType: string, attemptNumber: number) {
  if (stepType === "EXPOSURE" && attemptNumber < 3) {
    return {
      recorded: true,
      next_step: "EXPOSURE",
      next_attempt: attemptNumber + 1,
      step_status: "IN_PROGRESS",
      protocol: standardProtocol,
      progress: `${attemptNumber}/3 exposure attempts`,
    };
  }
  if (stepType === "EXPOSURE" && attemptNumber === 3) {
    return {
      recorded: true,
      next_step: "GUIDED",
      next_attempt: 1,
      step_status: "STEP_COMPLETE",
      protocol: standardProtocol,
      progress: "3/3 exposure attempts",
    };
  }
  if (stepType === "GUIDED") {
    return {
      recorded: true,
      next_step: "BLIND",
      next_attempt: 1,
      step_status: "STEP_COMPLETE",
      protocol: standardProtocol,
      progress: "1/1 guided attempts",
    };
  }
  if (stepType === "BLIND" && attemptNumber < 3) {
    return {
      recorded: true,
      next_step: "BLIND",
      next_attempt: attemptNumber + 1,
      step_status: "IN_PROGRESS",
      protocol: standardProtocol,
      progress: `${attemptNumber}/3 blind attempts`,
    };
  }
  if (stepType === "BLIND" && attemptNumber === 3) {
    return {
      recorded: true,
      next_step: "LINK",
      next_attempt: 1,
      step_status: "STEP_COMPLETE",
      protocol: standardProtocol,
      progress: "3/3 blind attempts",
    };
  }
  if (stepType === "LINK" && attemptNumber < 3) {
    return {
      recorded: true,
      next_step: "LINK",
      next_attempt: attemptNumber + 1,
      step_status: "IN_PROGRESS",
      protocol: standardProtocol,
      progress: `${attemptNumber}/3 link attempts`,
    };
  }
  return {
    recorded: true,
    next_step: "COMPLETE",
    next_attempt: null,
    step_status: "AYAH_COMPLETE",
    protocol: standardProtocol,
    progress: "3/3 link attempts",
  };
}

async function mockApi(page: Page, state: MockState) {
  await page.route("**/api/v1/**", async (route) => {
    const request = route.request();
    const method = request.method();
    const url = new URL(request.url());
    const path = url.pathname;

    if (method === "OPTIONS") {
      return route.fulfill({
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "*",
          "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        },
      });
    }

    if (path === "/api/v1/auth/signup" || path === "/api/v1/auth/login") {
      const body = request.postDataJSON() as { email?: string } | null;
      state.email = body?.email ?? state.email;
      return json(route, defaultAuthPayload(state.email));
    }

    if (path === "/api/v1/auth/refresh") {
      return json(route, defaultAuthPayload(state.email));
    }

    if (path === "/api/v1/assessment/submit") {
      return json(route, {
        defaults: {
          daily_new_target_ayahs: 7,
          review_ratio_target: 70,
          variant: "STANDARD",
          scaffolding_level: "STANDARD",
          retention_threshold: 0.85,
          backlog_freeze_ratio: 0.8,
          consolidation_retention_floor: 0.75,
          manzil_rotation_days: 30,
          avg_seconds_per_item: 75,
          overdue_cap_seconds: 172800,
          recommended_minutes: 30,
          warning: "15-minute plans are conservative by design",
        },
      });
    }

    if (path === "/api/v1/fluency-gate/status") {
      return json(route, {
        fluency_score: state.fluencyScore,
        fluency_gate_passed: state.fluencyGatePassed,
        requires_pre_hifz: !state.fluencyGatePassed,
        latest_test: state.fluencyGatePassed
          ? {
              id: "22222222-2222-4222-8222-222222222222",
              test_page: 2,
              status: "PASSED",
              fluency_score: state.fluencyScore,
              completed_at: "2026-02-11T10:00:00.000Z",
            }
          : null,
      });
    }

    if (path === "/api/v1/fluency-gate/start") {
      return json(route, {
        test_id: "22222222-2222-4222-8222-222222222222",
        page: 2,
        ayahs: [
          {
            id: 8,
            surah_number: 1,
            ayah_number: 2,
            text_uthmani: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
          },
        ],
        instructions:
          "Read this page aloud in under 3 minutes with fewer than 5 tajweed errors",
      });
    }

    if (path === "/api/v1/fluency-gate/submit") {
      state.fluencyGatePassed = true;
      state.fluencyScore = 92;
      return json(route, {
        passed: true,
        fluency_score: 92,
        time_score: 45,
        accuracy_score: 47,
        message: "Fluency gate passed.",
      });
    }

    if (path === "/api/v1/queue/today") {
      if (!state.fluencyGatePassed) {
        return json(route, {
          mode: "FLUENCY_GATE_REQUIRED",
          message: "You must pass the Fluency Gate test before memorizing",
          sabaq_allowed: false,
          sabqi_queue: [],
          manzil_queue: [],
          weak_transitions: [],
          link_repair_recommended: false,
          action_required: "COMPLETE_FLUENCY_GATE",
        });
      }
      return json(route, {
        mode: "NORMAL",
        debt: {
          dueItemsCount: 1,
          backlogMinutesEstimate: 2,
          overdueDaysMax: 0,
          freezeThresholdMinutes: 24,
        },
        retentionRolling7d: 0.91,
        warmup_test: {
          max_errors: 1,
          total_items: 0,
          passed: true,
          failed: false,
          pending: false,
          ayah_ids: [],
        },
        sabaq_task: {
          allowed: true,
          target_ayahs: 3,
          blocked_reason: "none",
        },
        sabqi_queue: [
          {
            ayah_id: 3,
            surah_number: 1,
            ayah_number: 3,
            page_number: 1,
            tier: "SABQI",
            next_review_at: "2026-02-11T10:00:00.000Z",
            overdue_seconds: 10,
            lapses: 0,
            difficulty_score: 0.1,
          },
        ],
        manzil_queue: [],
        weak_transitions: [],
        link_repair_recommended: false,
      });
    }

    if (path === "/api/v1/user/stats") {
      return json(route, {
        total_items_tracked: 12,
        due_items: 1,
        completed_sessions: 8,
        latest_daily_session: {
          sessionDate: "2026-02-11T00:00:00.000Z",
          retentionScore: 0.9,
          backlogMinutesEstimate: 2,
          minutesTotal: 42,
          mode: "NORMAL",
        },
        upcoming_due: [],
      });
    }

    if (path === "/api/v1/session/start") {
      return json(
        route,
        {
          session_id: "33333333-3333-4333-8333-333333333333",
          mode: "NORMAL",
          warmup_passed: true,
        },
        201,
      );
    }

    if (path === "/api/v1/session/step-complete") {
      const body = request.postDataJSON() as { step_type: string; attempt_number: number };
      return json(route, stepResponse(body.step_type, body.attempt_number));
    }

    if (path === "/api/v1/session/complete") {
      return json(route, {
        session_id: "33333333-3333-4333-8333-333333333333",
        retention_score: 0.95,
        backlog_minutes: 1,
        minutes_total: 14,
        mode: "NORMAL",
      });
    }

    return json(route, { error: `No mock for ${method} ${path}` }, 500);
  });
}

test("signup to session completion journey", async ({ page }) => {
  const state: MockState = {
    userId: "11111111-1111-4111-8111-111111111111",
    email: "new-user@example.com",
    fluencyGatePassed: false,
    fluencyScore: null,
  };
  await mockApi(page, state);

  await page.goto("/signup");

  await page.getByPlaceholder("Enter your display name").fill("Amina");
  await page.getByPlaceholder("you@example.com").fill("new-user@example.com");
  await page.getByPlaceholder("Create a strong password").fill("StrongPass123!");
  await page.getByPlaceholder("Confirm your password").fill("StrongPass123!");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page).toHaveURL(/\/assessment$/);

  await page.getByRole("button", { name: "Get Started" }).click();
  await page.getByRole("button", { name: /30 min/i }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /1-5 Juz/i }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /Medium/i }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /Full Quran/i }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "No" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Start My Hifz Journey" }).click();

  await expect(page).toHaveURL(/\/fluency-gate$/);
  await page.getByRole("button", { name: "Start Test" }).click();
  await page.locator('input[type="number"]').nth(0).fill("160");
  await page.locator('input[type="number"]').nth(1).fill("1");
  await page.getByRole("button", { name: "Submit Result" }).click();

  await expect(page.getByText("Status: Passed")).toBeVisible();
  await page.getByRole("button", { name: "Back to Today" }).click();

  await expect(page).toHaveURL(/\/today$/);
  await page.getByRole("button", { name: /Sabaq \(New\)/ }).click();
  await expect(page).toHaveURL(/\/session\/33333333-3333-4333-8333-333333333333/);

  for (let index = 0; index < 10; index += 1) {
    await page.getByRole("button", { name: "I got it" }).click();
  }

  await expect(page.getByText("Session Complete")).toBeVisible();
});

test("login lands on today with live queue", async ({ page }) => {
  const state: MockState = {
    userId: "11111111-1111-4111-8111-111111111111",
    email: "existing@example.com",
    fluencyGatePassed: true,
    fluencyScore: 88,
  };
  await mockApi(page, state);

  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill("existing@example.com");
  await page.getByPlaceholder("Enter your password").fill("StrongPass123!");
  await page.getByRole("button", { name: "Log In" }).click();

  await expect(page).toHaveURL(/\/today$/);
  await expect(page.getByText("Your plan for today is ready.")).toBeVisible();
});
