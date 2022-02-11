chrome.storage.onChanged.addListener((store) => {
  const options = store.options?.newValue ?? [];
  const ol = document.querySelector("ol") || new HTMLOListElement();

  var next = document.createElement("ol");
  options.forEach((o: string) => {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(o));
    next.appendChild(li);
  });

  ol.replaceWith(next);
});
