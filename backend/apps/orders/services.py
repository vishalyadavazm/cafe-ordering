"""Order creation + status transitions (steps 8 & 11).

create_order():
  - next order_number: Cafe.objects.select_for_update() on the cafe row, bump order_seq
  - compute subtotal/tax/total from DB prices (never trust client amounts)
  - snapshot name+price into OrderItem
Status transitions stamp accepted_at/ready_at/served_at and (step 10) broadcast over WS.
"""
# TODO
