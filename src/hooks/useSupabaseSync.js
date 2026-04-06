// Recipe sync is handled by useCollectionSync — this is a thin wrapper
// so existing components don't need to change their imports.
export { useCollectionSync as useSupabaseSync } from './useCollectionSync';
