"""Shared dependencies. Filled in during step 3.

Planned:
- get_current_staff(token) -> StaffUser         (decodes JWT, loads user)
- require_role(*roles)                            (RBAC guard)
- resolve_cafe_from_qr(qr_token) -> (Cafe, Table) (public customer entry)
Every staff query is scoped to current_staff.cafe_id.
"""
