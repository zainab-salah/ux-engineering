# Synthetic admin list

GET `/requests/?page=&status=&ordering=&search=` returns an authoritative count, pages of 25 and `next`/`previous`. The server filters and sorts the whole set. There are 205 matching requests. A supported endpoint can return all matching IDs for selection, scoped by the current permission set. A bulk cancel endpoint previews eligible records and requires confirmed IDs plus version. Completed requests cannot be deleted or cancelled; their history must remain readable.

Current UI offers an infinite scroll feed with a sticky bottom toolbar, “Select all” selecting only loaded rows, and independent local filters. Users need to compare request dates and amounts, return to a particular result page, inspect a record then return, and cancel a defined subset. Mobile users must also complete the task. Describe the interaction and recovery plan; do not build unsupported delete CRUD.
