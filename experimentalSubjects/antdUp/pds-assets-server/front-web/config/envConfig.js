export const getConfigWithEnv = () => {
  const baseConfig = {
    SHOW_EMS: true,
    UMI_ENV,
    HIDE_INSIDE_MARKET: false,
    HXOMS_AUTO_HIDE: false,
  };
  let extraConfig = {};
  switch (UMI_ENV) {
    case 'hxoms':
      extraConfig = {
        HXOMS_AUTO_HIDE: true,
      };
      break;
    case 'iat':
      extraConfig = {
        SHOW_EMS: false,
        HIDE_INSIDE_MARKET: true,
      };
      break;
    case 'imp':
      extraConfig = {
        SHOW_EMS: false,
      };
      break;
  }
  return {
    ...baseConfig,
    ...extraConfig,
  };
};
