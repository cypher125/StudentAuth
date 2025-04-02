declare module 'js-cookie' {
  function get(name: string): string | undefined;
  function set(name: string, value: string, options?: any): void;
  function remove(name: string, options?: any): void;
  
  export = {
    get,
    set,
    remove
  };
} 