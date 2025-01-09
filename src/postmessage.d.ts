declare module 'postmessage' {
  function bind(type: string, callback: (params: {
    event: MessageEvent;
    data: any;
  }) => void): void;

  function unbind(type: string): void;

  function send(type: string, source: Window|null, data: any): void;
}