declare module 'license/App' {
  const App: React.ComponentType;
  export default App;
}

declare module 'common_components/*' {
  import React from 'react';
  
  const Component: React.ComponentType<any>;
  export default Component;
}
declare module '@dm/common-comp/*' {
  import React from 'react';
  
  const Component: React.ComponentType<any>;
  export default Component;
}

declare module 'common_components1/*' {
  import React from 'react';
  
  const Component: React.ComponentType<any>;
  export default Component;
}
declare module 'DMSystem/*' {
  import React from 'react';
  
  const Component: React.ComponentType<any>;
  export default Component;
}

declare module "metismenujs" {
  export default class MetisMenu {
    constructor(selector: string | HTMLElement, options?: any);
  }
}
