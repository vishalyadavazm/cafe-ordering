"""Order creation + status transitions (step 8/11).

- next order_number: SELECT ... FOR UPDATE on the cafe row, increment order_seq.
- compute subtotal/tax/total from menu prices (never trust client amounts).
- snapshot item name+price into order_items.
- on status change, stamp accepted_at/ready_at/served_at and broadcast over WS.
"""
# TODO
