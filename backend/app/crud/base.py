"""Generic async CRUD base. Every query MUST be tenant-scoped by cafe_id
(pass it explicitly). Concrete cruds (crud/cafe.py, crud/menu.py, ...) subclass this."""
# TODO (step 3+): implement get/list/create/update/delete with cafe_id scoping.
