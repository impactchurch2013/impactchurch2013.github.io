export async function runEntryActivation({
  windowObj,
  resolveEntryModeFn,
  shouldFallbackToIndexFn,
  onFallbackFn,
  onStandaloneFn
}){
  const entryMode = resolveEntryModeFn(windowObj);
  if(shouldFallbackToIndexFn(entryMode)){
    onFallbackFn();
    return;
  }

  await onStandaloneFn();
}

export async function runStandaloneEntryDiagnostics({
  documentObj,
  windowObj,
  mountStandaloneShellFn,
  createStatusControllerFn,
  createStatusControllerArgs,
  runDiagnosticsFn,
  diagnosticsArgs
}){
  mountStandaloneShellFn(documentObj, windowObj);
  const statusController = createStatusControllerFn(createStatusControllerArgs);

  await runDiagnosticsFn({
    ...diagnosticsArgs,
    statusController
  });
}
