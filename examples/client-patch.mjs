// Synthetic boundary example: display labels never enter the wire payload.
export function clientPatch(changes, writableFields) {
  if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
    throw new TypeError('Changes must be an object');
  }
  const allowed = new Set(writableFields);
  const patch = {};
  for (const [field, value] of Object.entries(changes)) {
    if (!['name', 'country', 'owner'].includes(field)) {
      throw new TypeError(`Unknown form field: ${field}`);
    }
    const key = field === 'owner' ? 'owner_id' : field;
    if (!allowed.has(key)) throw new TypeError(`Field is not writable: ${key}`);
    if (field === 'owner') {
      if (value === null) patch.owner_id = null;
      else if (value && typeof value.id === 'string' && value.id.length > 0) patch.owner_id = value.id;
      else throw new TypeError('Choose an owner or explicitly clear it');
    } else if (field === 'country') {
      if (!value || typeof value.code !== 'string' || !/^[A-Z]{2}$/.test(value.code)) {
        throw new TypeError('Choose a country code from the verified catalogue');
      }
      patch.country = value.code;
    } else {
      if (typeof value !== 'string' || value.length > 120) throw new TypeError('Invalid name');
      patch.name = value;
    }
  }
  return patch;
}
