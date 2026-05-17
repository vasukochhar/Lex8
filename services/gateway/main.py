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
from starlette.responses import PlainTextResponse

from config import settings
from middleware.rate_limit import rate_limit_middleware
from middleware.idempotency import idempotency_middleware
from cache.embedding_cache import embedding_cache
from cache.threshold_store import threshold_store
from integrations.anchor8_client import anchor8_client
from observability import init_sentry_if_configured, observability_status, record_request, render_metrics
from routes import (
    case_synth,
    defensibility,
    drafter,
    filer,
    forecast,
    lane4,
    library,
    validator,
    vault_vision,
    war_room,
)

MODULES = [
    {"name": "Drafter", "archetype": "drafter", "status": "product_mock"},
    {"name": "Filer", "archetype": "filer", "status": "product_mock"},
    {"name": "Vault Vision", "archetype": "vault_vision", "status": "product_mock"},
    {"name": "Library", "archetype": "library", "status": "product_mock"},
    {"name": "Forecast", "archetype": "forecast", "status": "product_mock"},
    {"name": "War Room", "archetype": "war_room", "status": "product_mock"},
    {"name": "Validator", "archetype": "validator", "status": "product_mock"},
    {"name": "Case Synth", "archetype": "case_synth", "status": "product_mock"},
]

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
SENTRY_STATE = init_sentry_if_configured()


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

app.include_router(drafter.router)
app.include_router(filer.router)
app.include_router(vault_vision.router)
app.include_router(forecast.router)
app.include_router(case_synth.router)
app.include_router(defensibility.router)
app.include_router(lane4.router)
app.include_router(library.router)
app.include_router(validator.router)
app.include_router(war_room.router)


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


@app.middleware("http")
async def add_observability(request: Request, call_next):
    response: Response = await call_next(request)
    record_request(request.method, request.url.path, response.status_code)
    return response


# ── Health check ──
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "lex8-gateway",
        "version": "0.1.0",
        "observability": observability_status(),
    }


@app.get("/metrics")
async def metrics():
    return PlainTextResponse(render_metrics(), media_type="text/plain; version=0.0.4")


# ── Module route stubs ──
@app.get("/api/v1/modules")
async def list_modules():
    """List all 8 Lex8 modules and their status."""
    return {"modules": MODULES}


@app.get("/api/v1/health/modules")
async def module_health():
    """Aggregate module status for frontend health panels."""
    embedding_status = await embedding_cache.status()
    threshold_status = await threshold_store.status()
    return {
        "status": "healthy",
        "modules": [
            {
                **module,
                "health": "ok",
                "mode": "mock",
            }
            for module in MODULES
        ],
        "anchor8": {
            "mode": "mock" if anchor8_client.mock_mode else "stored",
            "gateway_configured": bool(anchor8_client.base_url),
            "internals": "external",
        },
        "cache": {
            "embedding_cache": embedding_status,
            "threshold_store": threshold_status,
        },
    }
