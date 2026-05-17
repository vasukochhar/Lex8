"""
Lex8 Gateway — Central API service.
All module requests flow through here.
"""

import time
import uuid
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from middleware.rate_limit import rate_limit_middleware
from middleware.idempotency import idempotency_middleware

# ── Structured logging ──
structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.dev.ConsoleRenderer() if settings.DEBUG else structlog.processors.JSONRenderer(),
    ],
    wrapper_class=structlog.make_filtering_bound_logger(settings.LOG_LEVEL),
)
log = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    log.info("lex8.gateway.starting", version="0.1.0", env=settings.ENV)
    yield
    log.info("lex8.gateway.shutdown")


app = FastAPI(
    title="Lex8 Gateway",
    description="Central API gateway for the Lex8 legal AI platform",
    version="0.1.0",
    lifespan=lifespan,
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Rate limiting + Idempotency ──
app.middleware("http")(rate_limit_middleware)
app.middleware("http")(idempotency_middleware)


# ── Request ID middleware ──
@app.middleware("http")
async def add_request_context(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    start = time.perf_counter()

    structlog.contextvars.clear_contextvars()
    structlog.contextvars.bind_contextvars(request_id=request_id)

    response: Response = await call_next(request)

    duration_ms = round((time.perf_counter() - start) * 1000, 2)
    log.info(
        "request.completed",
        method=request.method,
        path=request.url.path,
        status=response.status_code,
        duration_ms=duration_ms,
    )
    response.headers["X-Request-ID"] = request_id
    return response


# ── Health check ──
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "lex8-gateway",
        "version": "0.1.0",
    }


# ── Module route stubs ──
@app.get("/api/v1/modules")
async def list_modules():
    """List all 8 Lex8 modules and their status."""
    return {
        "modules": [
            {"name": "Drafter", "archetype": "drafter", "status": "scaffold"},
            {"name": "Filer", "archetype": "filer", "status": "scaffold"},
            {"name": "Vault Vision", "archetype": "vault_vision", "status": "scaffold"},
            {"name": "Library", "archetype": "library", "status": "scaffold"},
            {"name": "Forecast", "archetype": "forecast", "status": "scaffold"},
            {"name": "War Room", "archetype": "war_room", "status": "scaffold"},
            {"name": "Validator", "archetype": "validator", "status": "scaffold"},
            {"name": "Case Synth", "archetype": "case_synth", "status": "scaffold"},
        ]
    }
