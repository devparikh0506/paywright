import { SetMetadata } from '@nestjs/common';

export const SKIP_API_KEY = 'skipApiKey';

/**
 * Opts a route (or whole controller) out of the global ApiKeyGuard.
 * The guard reads this metadata back via Reflector.
 */
export const SkipApiKey = () => SetMetadata(SKIP_API_KEY, true);
