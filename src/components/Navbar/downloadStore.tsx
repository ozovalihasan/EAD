import { State } from "@/zustandStore";

const downloadStore = (data: State, projectName: string) => {
  const filename = `${projectName || "EAD"}.json`;
  const { version, idCounter, nodes, edges, tables, orderedTables } = data;
  const jsonData = { version, idCounter, nodes, edges, tables, orderedTables };
  
  const jsonString = JSON.stringify(jsonData, null, 4);
  
  const blob = new Blob([jsonString], { type: 'application/json' });
  const event = document.createEvent('MouseEvents');
  const anchor = document.createElement('a');
  
  anchor.download = filename;
  anchor.href = window.URL.createObjectURL(blob);
  anchor.dataset.downloadurl = ['text/json', anchor.download, anchor.href].join(':');
  event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  anchor.dispatchEvent(event);
};

export default downloadStore;
