// Centralized configuration for environment variables
export const config = {
  geoapify: {
    apiKey: import.meta.env.VITE_GEOAPIFY_API_KEY || 'dc461739b87042228f6be3ee0e2bf02a'
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
};

// Log configuration on load (only in development)
if (config.isDevelopment) {
  console.log('🔧 App Config:', {
    environment: config.isDevelopment ? 'Development' : 'Production',
    apiKeyPresent: !!config.geoapify.apiKey
  });
}

