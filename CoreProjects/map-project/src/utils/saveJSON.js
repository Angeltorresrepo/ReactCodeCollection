function saveJSONBrowser(nameFile, data) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = nameFile.endsWith('.json') ? nameFile : `${nameFile}.json`;
  a.click();

  URL.revokeObjectURL(url);
}

export default saveJSONBrowser;
