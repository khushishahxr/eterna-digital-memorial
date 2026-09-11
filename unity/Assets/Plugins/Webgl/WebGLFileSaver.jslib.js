mergeInto(LibraryManager.library, {
  SaveFile: function (contentPtr, fileNamePtr) {
    const content = UTF8ToString(contentPtr);
    const fileName = UTF8ToString(fileNamePtr);

    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
  }
});
