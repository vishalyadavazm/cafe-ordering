from fastapi import APIRouter

from app.api.v1.endpoints import health

api_router = APIRouter()
api_router.include_router(health.router)

# Add as you build each step:
# from app.api.v1.endpoints import auth, cafes, tables, menu, public, orders, payments, reports
# api_router.include_router(auth.router,     prefix="/auth",       tags=["auth"])
# api_router.include_router(cafes.router,    prefix="/cafes",      tags=["cafes"])
# api_router.include_router(tables.router,   prefix="/tables",     tags=["tables"])
# api_router.include_router(menu.router,     prefix="",            tags=["menu"])
# api_router.include_router(public.router,   prefix="/public",     tags=["public"])
# api_router.include_router(orders.router,   prefix="/orders",     tags=["orders"])
# api_router.include_router(payments.router, prefix="/payments",   tags=["payments"])
# api_router.include_router(reports.router,  prefix="/reports",    tags=["reports"])
