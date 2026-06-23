const nvidiaConfig = {
  configuration: {
    baseURL: "https://integrate.api.nvidia.com/v1",
  },
};

export const embeddingModel = {
  ...nvidiaConfig,
  apiKey: process.env.NVIDIA_EMBEDDING_MODEL_API_KEY!,
  model: "nvidia/nv-embed-v1",
};

export const textModel = {
  ...nvidiaConfig,
  apiKey: process.env.NVIDIA_TEXT_MODEL_API_KEY!,
  model: "openai/gpt-oss-120b",
};