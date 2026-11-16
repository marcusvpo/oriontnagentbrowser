# Orion Audit Console — regras técnicas

- Frontend only: all data flows through `src/services/api.ts` (USE_MOCK toggle → `src/mocks/mockApi.ts`); never call fetch from components. Why: the real Node backend is out of scope and must be swappable via env.
- `src/types/audit.ts` mirrors the backend verbatim; never rename/retype. Why: contract parity with the runner.
- Styling uses only Design System tokens/classes; app layout classes live in `src/styles.css`. No Tailwind/shadcn. Why: the attached DS is plain CSS and is the single source of truth.
- Use `@/components/ui/Modal` (wrapper that owns showModal via its own ref) instead of importing the DS Modal directly. Why: guarantees the native dialog opens regardless of ref forwarding in dev tooling.
- Page chrome is the `AppShell` component wrapped per route, not a layout route. Why: `__root` must stay providers-only for canvas preview routes.
- Explorer filter state lives in the URL (comma-separated lists, `src/lib/search.ts`). Why: shareable triage links and studio prev/next ordering.
- Screenshot gestures use react-zoom-pan-pinch for drag/pinch and a native non-passive, delta-normalized exponential wheel adapter in viewerZoom. Why: the library's additive wheel scaling overreacts at fitted screenshot scales; cursor anchoring and resize fitting must remain stable.
