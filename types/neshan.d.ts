interface NeshanMap {
      remove: () => void;
      // Add other methods as needed
}

interface Neshan {
      Map: new (container: HTMLElement, options: any) => NeshanMap;
}

declare global {
      interface Window {
            L: Neshan;
      }
}