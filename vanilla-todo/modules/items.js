let createItem = (listId, id, check, name, notes, label, created, scheduled, priority) => {
  return {
    listId: listId,
    id: id,
    check: check,
    name: name,
    notes: notes,
    label: label,
    created: created,
    scheduled: scheduled,
    priority: priority,
    child: null
  }
}

export { createItem }
